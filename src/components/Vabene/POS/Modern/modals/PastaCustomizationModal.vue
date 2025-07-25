<template>
  <div v-if="product" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Personnaliser les pâtes</h2>
        <button @click="closeModal" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenu principal -->
      <div class="modal-body">
        <!-- Image et informations du produit -->
        <div class="product-info">
          <div class="product-image">
            <img :src="product.image || '/imgs/pasta-placeholder.jpg'" :alt="product.name" class="product-img" />
          </div>
          <div class="product-details">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ htmlToText(product.description || '') }}</p>
          </div>
        </div>

        <!-- Description du parmesan -->
        <div class="options-section">
          <p class="options-description">
            Ajoutez du parmesan râpé pour encore plus de saveur (1.00 CHF) :
          </p>

          <!-- Option parmesan -->
          <div class="parmesan-option">
            <div class="supplement-card" :class="{ 'selected': withParmesan }" @click="toggleParmesan">
              <div class="supplement-image">
                <img :src="parmesanSupplement.image_url" :alt="parmesanSupplement.name" class="supplement-img" />
              </div>
              <div class="supplement-info">
                <span class="supplement-name">{{ parmesanSupplement.name }}</span>
                <span class="supplement-price">+{{ formatPrice(parmesanSupplement.extra_cost_price) }}</span>
              </div>
              <div class="supplement-checkbox">
                <i :class="withParmesan ? 'fas fa-check-circle' : 'far fa-circle'"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Contrôle de quantité -->
        <div class="quantity-section">
          <label class="quantity-label">Quantité :</label>
          <div class="quantity-controls">
            <button @click="decrementQuantity" :disabled="quantity <= 1" class="quantity-btn">
              ➖
            </button>
            <span class="quantity-display">{{ quantity }}</span>
            <button @click="incrementQuantity" class="quantity-btn">
              ➕
            </button>
          </div>
        </div>
      </div>

      <!-- Footer avec prix et actions -->
      <div class="modal-footer">
        <div class="total-price">
          <span class="price-label">Total :</span>
          <span class="price-value">{{ formatPrice(calculateTotal()) }}</span>
        </div>
        <div class="action-buttons">
          <button @click="closeModal" class="cancel-btn">
            Annuler
          </button>
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
import { ref } from 'vue'
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

// Supplément parmesan pour les pâtes
const parmesanSupplement: Supplement = {
  id: "parmesan",
  name: "Parmesan",
  price: 1.0,
  extra_cost_price: 1.0,
  image_url: "/images/supplements/default-parmesan.png",
  quantity: 0,
  type: "pasta",
  size: "Normale",
  isDefault: false,
  isAvailable: true
}

// État local
const withParmesan = ref(false)
const quantity = ref(1)

// Fonctions utilitaires
const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} CHF`
}

const toggleParmesan = () => {
  withParmesan.value = !withParmesan.value
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

  const basePrice = parseFloat(props.selectedSize.price) || 0
  const parmesanPrice = withParmesan.value ? parmesanSupplement.extra_cost_price : 0

  return (basePrice + parmesanPrice) * quantity.value
}

const closeModal = () => {
  // Réinitialiser l'état
  withParmesan.value = false
  quantity.value = 1
  emit('close')
}


const handleAddToCart = () => {
  if (!props.product || !props.selectedSize) return

  // Ajouter le parmesan au store features s'il est sélectionné
  if (withParmesan.value) {
    store.dispatch('features/toggleFeature', parmesanSupplement.name)
  }

  // Préparer les suppléments sélectionnés
  const selectedSupplements: CartSupplement[] = withParmesan.value ? [{
    id: parmesanSupplement.id,
    name: parmesanSupplement.name,
    extra_cost_price: parmesanSupplement.extra_cost_price,
    quantity: 1,
    type: parmesanSupplement.type,
    size: parmesanSupplement.size
  }] : []

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
    size: props.selectedSize,
    quantity: quantity.value,
    ingredients: cartIngredients,
    supplements: selectedSupplements,
    notes: ''
  }

  emit('add-to-cart', event)
  closeModal()
}
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

.options-section {
  margin-bottom: 1.5rem;

  .options-description {
    color: #64748b;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
}

.parmesan-option {
  .supplement-card {
    display: flex;
    align-items: center;
    max-width: 100%;
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