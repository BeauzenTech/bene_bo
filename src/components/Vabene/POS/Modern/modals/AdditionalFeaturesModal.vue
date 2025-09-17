<template>
  <div v-if="visible && product" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Personnaliser les options</h2>
        <button @click="closeModal" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenu principal -->
      <div class="modal-body">
        <!-- Image et informations du produit -->
        <div class="product-info">
          <div class="product-image">
            <img :src="product.image || '/imgs/product-placeholder.jpg'" :alt="product.name" class="product-img" />
          </div>
          <div class="product-details">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ htmlToText(product.description || '') }}</p>
          </div>
        </div>

        <!-- Sélection des options additionnelles -->
        <div class="options-section">
          <h4 class="options-title">
            Choisissez une option
          </h4>
          <div class="options-list">
            <div v-for="option in product.additionnal" :key="option" class="supplement-card"
              :class="{ 'selected': isSelected(option) }"
              @click="selectFeature(option)">
              <div class="supplement-info">
                <span class="supplement-name">{{ option }}</span>
              </div>
              <div class="supplement-checkbox">
                <i :class="selectedFeature === option ? 'fas fa-dot-circle' : 'far fa-circle'"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Options sélectionnées -->
        <div v-if="hasSelectedOptions" class="selected-options-section">
          <h4 class="selected-options-title">
            Option sélectionnée
          </h4>
          <div class="selected-option">
            <span class="selected-option-name">{{ selectedFeature }}</span>
          </div>
        </div>

        <!-- Contrôle de quantité -->
        <!-- <div class="quantity-section">
          <label class="quantity-label">Quantité :</label>
          <div class="quantity-controls">
            <button @click="decrementQuantity" :disabled="quantity <= 1" class="quantity-btn">-</button>
            <span class="quantity-display">{{ quantity }}</span>
            <button @click="incrementQuantity" class="quantity-btn">+</button>
          </div>
        </div> -->
      </div>

      <!-- Footer avec prix et actions -->
      <div class="modal-footer">
        <div class="total-price">
          <span class="price-label">Total :</span>
          <span class="price-value">{{ formatPrice(calculateTotal()) }}</span>
        </div>
        <div class="action-buttons">
          <button @click="closeModal" class="cancel-btn">Annuler</button>
          <button @click="handleAddToCart" class="add-to-cart-btn">
            <i class="fas fa-shopping-cart"></i>
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import htmlToText from '@/utils/html-to-text';
import type { Product, ProductSize, AddToCartEvent, CartSupplement, CartIngredient } from '../types'
import { useStore } from 'vuex'


const store = useStore()

const props = defineProps<{
  product: any // Product type, doit contenir additionnal: string[]
  selectedSize: any // ProductSize type
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  'add-to-cart': [event: any]
}>()

const selectedFeature = ref('')
const quantity = ref(1)

const selectedOptions = computed(() => {
  return selectedFeature.value ? [selectedFeature.value] : []
})

const hasSelectedOptions = computed(() => selectedOptions.value.length > 0)

watch(() => props.product, (newProduct) => {
  // Réinitialiser à chaque ouverture, sans pré-sélection
  selectedFeature.value = ''
  quantity.value = 1
}, { immediate: true })

const isSelected = (option: string) => {
  return selectedFeature.value === option
}

const selectFeature = (option: string) => {
  if (selectedFeature.value === option) {
    // Si on clique sur l'option déjà sélectionnée, on la désélectionne
    selectedFeature.value = ''
  } else {
    // Sinon, on la sélectionne
    selectedFeature.value = option
  }
}

const incrementQuantity = () => {
  quantity.value++
}
const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

const formatPrice = (price: number): string => `${price.toFixed(2)} CHF`

const calculateTotal = (): number => {
  if (!props.selectedSize) return 0
  
  // Utiliser le prix de livraison si le type de commande est 'delivery'
  const isDelivery = store.getters['orderType/isDelivery']
  const basePrice = isDelivery && props.selectedSize.priceLivraison 
    ? parseFloat(props.selectedSize.priceLivraison) || 0
    : parseFloat(props.selectedSize.price) || 0
  
  return basePrice * quantity.value
}

const closeModal = () => {
  selectedFeature.value = ''
  quantity.value = 1
  emit('close')
}

const handleAddToCart = () => {
  if (!props.product || !props.selectedSize) return

  

  // ❌ ANCIEN CODE QUI MODIFIAIT LES PRIX :
  // const isDelivery = store.getters['orderType/isDelivery']
  // const correctPrice = isDelivery && props.selectedSize.priceLivraison 
  //   ? parseFloat(props.selectedSize.priceLivraison) || 0
  //   : parseFloat(props.selectedSize.price) || 0
  // const sizeWithCorrectPrice = {
  //   ...props.selectedSize,
  //   price: correctPrice.toString()  // ← PROBLÈME : Écrasait le prix original !
  // }

  // ✅ NOUVEAU CODE : Préserver les prix originaux
  // Le store cart se chargera de calculer le bon prix selon le type de commande
  const sizeWithOriginalPrices = {
    ...props.selectedSize,
    // Garder les prix originaux intacts
    price: props.selectedSize.price,
    priceLivraison: props.selectedSize.priceLivraison
  }

  
  // Ajouter l'option sélectionnée au store features
  if (selectedFeature.value) {
    store.dispatch('features/toggleFeature', selectedFeature.value)
  }
  
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
    size: sizeWithOriginalPrices,  // ← Utiliser les prix originaux
    quantity: quantity.value,
    ingredients: cartIngredients,
    supplements: [],
    additionnal: selectedOptions.value,
    notes: ''
  }
  emit('add-to-cart', event)
  closeModal()
}
</script>

<style lang="scss" scoped>
// Copied from PastaCustomizationModal.vue for consistency
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
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 12px 12px 0 0;

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
  }
}

.modal-body {
  padding: 1.5rem;
}

.product-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .product-image {
    .product-img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
    }
  }

  .product-details {
    flex: 1;

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
}

.quantity-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  .quantity-label {
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
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #374151;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        border-color: #388D35;
        color: #388D35;
        background: #f9fafb;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .quantity-display {
      min-width: 40px;
      text-align: center;
      font-weight: 600;
      color: #1e293b;
    }
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
}

// Styles specific to AdditionalFeaturesModal
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
  justify-content: space-between;
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
  }
  .supplement-checkbox {
    color: #388D35;
    font-size: 1.5rem;
  }
}
.selected-options-section {
  margin-bottom: 1.5rem;
  .selected-options-title {
    font-size: 0.95rem;
    font-weight: 500;
    color: #388D35;
    margin-bottom: 0.5rem;
  }
  .selected-option-name {
    display: inline-block;
    background: #f0fdf4;
    color: #388D35;
    border-radius: 6px;
    padding: 0.25rem 0.75rem;
    margin-right: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
  }
}

@media (max-width: 640px) {
  .modal-content {
    margin: 0;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }

  .product-info {
    flex-direction: column;
    text-align: center;

    .product-image .product-img {
      width: 120px;
      height: 120px;
      margin: 0 auto;
    }
  }

  .modal-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;

    .action-buttons {
      width: 100%;

      .cancel-btn,
      .add-to-cart-btn {
        flex: 1;
      }
    }
  }
}
</style> 