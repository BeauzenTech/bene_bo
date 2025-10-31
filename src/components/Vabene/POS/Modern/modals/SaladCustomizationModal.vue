<template>
  <div v-if="product" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <div class="header-text">
          <h2 class="modal-title">{{ t('title') }}</h2>
          <p class="modal-description">{{ t('description') }}</p>
        </div>
        <button @click="closeModal" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenu principal -->
      <div class="modal-body">
        <!-- Image et informations du produit -->
        <div class="product-info">
          <div class="product-image">
            <img :src="product.image || '/imgs/salad-placeholder.jpg'" :alt="product.name" class="product-img" />
          </div>
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">{{ htmlToText(product.description || '') }}</p>
        </div>

        <!-- Sélection des sauces -->
        <div class="options-section">
          <h4 class="options-title">{{ t('sauces-title') }}</h4>
          <div class="options-list">
            <div v-for="sauce in availableSauces" :key="sauce.id" class="supplement-card"
              :class="{ 'selected': selectedSauces[sauce.name] }" @click="toggleSauce(sauce.name)">
              <div class="supplement-image">
                <img :src="sauce.image_url" :alt="sauce.name" class="supplement-img" />
              </div>
              <div class="supplement-info">
                <span class="supplement-name">{{ sauce.name }}</span>
                <span class="supplement-price">+{{ formatPrice(sauce.extra_cost_price) }}</span>
              </div>
              <div class="supplement-checkbox">
                <i :class="selectedSauces[sauce.name] ? 'fas fa-check-circle' : 'far fa-circle'"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Contrôle de quantité -->
        <div class="quantity-section">
          <label class="quantity-label">{{ t('quantity') }} :</label>
          <div class="quantity-controls">
            <button @click="decrementQuantity" :disabled="quantity <= 1" class="quantity-btn">
              -
            </button>
            <span class="quantity-display">{{ quantity }}</span>
            <button @click="incrementQuantity" class="quantity-btn">
              +
            </button>
          </div>
        </div>
      </div>

      <!-- Footer avec actions -->
      <div class="modal-footer">
        <div class="total-price">
          <span class="price-label">{{ t('total') }} :</span>
          <span class="price-value">{{ formatPrice(calculateTotal()) }}</span>
        </div>
        <div class="action-buttons">
          <button @click="closeModal" class="cancel-btn">
            Annuler
          </button>
          <button @click="handleAddToCart" class="add-to-cart-btn">
            <i class="fas fa-shopping-cart"></i>
            {{ t('add-to-cart') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Product, ProductSize, Supplement, AddToCartEvent, CartSupplement } from '../types'
import htmlToText from '@/utils/html-to-text';
import { useStore } from 'vuex'

const store = useStore()

// Props
const props = defineProps<{
  product: Product | null
  selectedSize: ProductSize | null
}>()

// Events
const emit = defineEmits<{
  close: []
  'add-to-cart': [event: AddToCartEvent]
}>()

// Translations (simulation)
const t = (key: string) => {
  const translations: { [key: string]: string } = {
    'title': 'Personnaliser la salade',
    'description': 'Ajoutez des sauces pour sublimer votre salade.',
    'sauces-title': 'Choisissez vos sauces',
    'selected-sauces': 'Sauces sélectionnées',
    'quantity': 'Quantité',
    'total': 'Total',
    'add-to-cart': 'Ajouter au panier',
  }
  return translations[key] || key
}

// Sauces disponibles pour les salades
const availableSauces: Supplement[] = [
  {
    id: "sauce-balsamique",
    name: "Sauce Balsamique",
    price: 1.0,
    extra_cost_price: 1.0,
    image_url: "/images/supplements/sauce-balsamique.png",
    quantity: 0,
    type: "supplement",
    size: "Normale",
    isDefault: false,
    isAvailable: true
  },
  {
    id: "sauce-francaise",
    name: "Sauce Française",
    price: 1.0,
    extra_cost_price: 1.0,
    image_url: "/images/supplements/sauce-francaise.png",
    quantity: 0,
    type: "supplement",
    size: "Normale",
    isDefault: false,
    isAvailable: true
  },
  {
    id: "sauce-italienne",
    name: "Sauce Italienne",
    price: 1.0,
    extra_cost_price: 1.0,
    image_url: "/images/supplements/sauce-italienne.png",
    quantity: 0,
    type: "supplement",
    size: "Normale",
    isDefault: false,
    isAvailable: true
  }
]

// État local
const selectedSauces = ref<{ [key: string]: boolean }>({})
const quantity = ref(1)

// Computed
const selectedSauceItems = computed(() => {
  return availableSauces.filter(sauce => selectedSauces.value[sauce.name])
})

// Fonctions utilitaires
const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} CHF`
}

const toggleSauce = (sauceName: string) => {
  selectedSauces.value[sauceName] = !selectedSauces.value[sauceName]
}

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const calculateTotal = (): number => {
  if (!props.selectedSize) return 0

  // Utiliser le prix de livraison si le type de commande est 'delivery'
  const isDelivery = store.getters['orderType/isDelivery']
  const basePrice = isDelivery && props.selectedSize.priceLivraison 
    ? parseFloat(props.selectedSize.priceLivraison) || 0
    : parseFloat(props.selectedSize.price) || 0
  
  const saucesPrice = availableSauces.reduce((total, sauce) => {
    return selectedSauces.value[sauce.name] ? total + sauce.extra_cost_price : total
  }, 0)

  return (basePrice + saucesPrice) * quantity.value
}


const closeModal = () => {
  // Réinitialiser l'état
  selectedSauces.value = {}
  quantity.value = 1
  emit('close')
}

const handleAddToCart = () => {
  if (!props.product || !props.selectedSize) return

  // IMPORTANT: Ne pas modifier le prix, garder les données originales
  // Le prix sera calculé dynamiquement dans le store cart selon le type de commande
  

  // Ajouter les sauces sélectionnées au store features
  const selectedSauceNames = availableSauces
    .filter(sauce => selectedSauces.value[sauce.name])
    .map(sauce => sauce.name)
  
  selectedSauceNames.forEach(sauceName => {
    store.dispatch('features/toggleFeature', sauceName)
  })

  // Préparer les suppléments sélectionnés
  const selectedSupplements: CartSupplement[] = availableSauces
    .filter(sauce => selectedSauces.value[sauce.name])
    .map(sauce => ({
      id: sauce.id,
      name: sauce.name,
      extra_cost_price: sauce.extra_cost_price,
      quantity: 1,
      type: sauce.type,
      size: sauce.size
    }))

  // Convertir les ingrédients en CartIngredient[]
  const cartIngredients = (props.product.ingredients || []).map(ing => ({
    id: ing.id,
    name: ing.name,
    extra_cost_price: ing.price || 0,
    quantity: ing.isDefault ? 1 : 0,
    isDefault: ing.isDefault,
    size: props.selectedSize?.name || props.selectedSize?.size || ''
  }))

  const event: AddToCartEvent = {
    product: props.product,
    size: props.selectedSize, // Prix originaux préservés
    quantity: quantity.value,
    ingredients: cartIngredients,
    supplements: selectedSupplements,
    notes: ''
  }

  emit('add-to-cart', event)
  closeModal()
}

// Reset state when product changes
watch(() => props.product, () => {
  selectedSauces.value = {}
  quantity.value = 1
}, { immediate: true })

</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 12px 12px 0 0;

  .header-text {
    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: #1e293b;
    }

    .modal-description {
      color: #64748b;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1rem;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;
    margin-top: -0.25rem;

    &:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1.5rem;

  .product-image {
    width: 128px;
    height: 128px;
    margin-bottom: 1rem;

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  }

  .product-name {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: #1e293b;
  }

  .product-description {
    color: #64748b;
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.4;
  }
}

.options-section {
  margin-bottom: 1.5rem;

  .options-title {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: #374151;
  }
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.supplement-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #388D35;
    background: #f0f9ff;
  }

  &.selected {
    border-color: #388D35;
    background: #f0fdf4;
  }

  .supplement-image {
    .supplement-img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 6px;
    }
  }

  .supplement-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .supplement-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 1rem;
    }

    .supplement-price {
      color: #388D35;
      font-weight: 600;
      font-size: 0.875rem;
    }
  }

  .supplement-checkbox {
    color: #388D35;
    font-size: 1.5rem;
  }
}

.quantity-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  .quantity-label {
    font-size: 1.125rem;
    font-weight: 500;
    color: #1e293b;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .quantity-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #374151;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        border-color: #388D35;
        color: #388D35;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .quantity-display {
      min-width: 40px;
      text-align: center;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
    }
  }
}

.total-price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;

  .price-label {
    font-size: 1.125rem;
    font-weight: 500;
    color: #374151;
  }

  .price-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #388D35;
  }
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  bottom: 0;
  background: white;
  border-radius: 0 0 12px 12px;

  .total-price {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .price-label {
      font-size: 0.875rem;
      color: #64748b;
    }

    .price-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #388D35;
    }
  }

  .action-buttons {
    display: flex;
    gap: 0.75rem;
  }

  .cancel-btn {
    padding: 0.75rem 1.5rem;
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  }

  .add-to-cart-btn {
    padding: 0.75rem 1.5rem;
    background: #388D35;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
      background: #2d7a2a;
    }
  }
}

@media (max-width: 640px) {
  .modal-content {
    margin: 0;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }
}
</style>