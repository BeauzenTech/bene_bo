<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Personnaliser votre commande</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="product-info" v-if="product">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-details">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>
          </div>
        </div>

        <!-- Sélection de taille -->
        <div class="size-selection" v-if="product?.sizes.length">
          <h4 class="section-title">Choisir la taille</h4>
          <div class="size-options">
            <button
              v-for="size in product.sizes"
              :key="size.id"
              :class="['size-option', { active: selectedSize?.id === size.id }]"
              @click="selectedSize = size"
            >
              <span class="size-name">{{ size.name }}</span>
              <span class="size-price">${{ size.price }}</span>
            </button>
          </div>
        </div>

        <!-- Quantité -->
        <div class="quantity-section">
          <h4 class="section-title">Quantité</h4>
          <div class="quantity-controls">
            <button 
              class="quantity-btn"
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
            >
              <i class="fas fa-minus"></i>
            </button>
            <span class="quantity">{{ quantity }}</span>
            <button 
              class="quantity-btn"
              @click="increaseQuantity"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <!-- Notes spéciales -->
        <div class="notes-section">
          <h4 class="section-title">Notes spéciales</h4>
          <textarea
            v-model="notes"
            placeholder="Instructions spéciales pour votre commande..."
            class="notes-input"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <div class="total-price">
          <span class="label">Total:</span>
          <span class="price">${{ calculateTotal() }}</span>
        </div>
        <button 
          class="add-to-cart-btn"
          @click="addToCart"
          :disabled="!selectedSize"
        >
          <i class="fas fa-shopping-cart"></i>
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Product, ProductSize, AddToCartEvent } from '../types'

interface Props {
  product: Product | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'add-to-cart': [event: AddToCartEvent]
}>()

// État local
const selectedSize = ref<ProductSize | null>(null)
const quantity = ref(1)
const notes = ref('')

// Méthodes
const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const calculateTotal = (): string => {
  if (!selectedSize.value) return '0.00'
  const basePrice = parseFloat(selectedSize.value.price)
  return (basePrice * quantity.value).toFixed(2)
}

const addToCart = () => {
  if (!props.product || !selectedSize.value) return

  const event: AddToCartEvent = {
    product: props.product,
    size: selectedSize.value,
    quantity: quantity.value,
    ingredients: [],
    supplements: [],
    notes: notes.value
  }

  emit('add-to-cart', event)
}

// Watcher pour initialiser la première taille quand le produit change
watch(() => props.product, (newProduct) => {
  if (newProduct?.sizes.length) {
    selectedSize.value = newProduct.sizes[0]
  }
  quantity.value = 1
  notes.value = ''
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
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;

  .modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .close-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s ease;

    &:hover {
      background: #e2e8f0;
      color: #1e293b;
    }
  }
}

.modal-body {
  padding: 2rem;

  .product-info {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;

    .product-image {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .product-details {
      flex: 1;

      .product-name {
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 8px 0;
      }

      .product-description {
        font-size: 14px;
        color: #64748b;
        margin: 0;
        line-height: 1.4;
      }
    }
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
  }

  .size-selection {
    margin-bottom: 2rem;

    .size-options {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .size-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          border-color: #3b82f6;
        }

        &.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .size-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .size-price {
          font-size: 12px;
          color: #3b82f6;
          font-weight: 600;
        }
      }
    }
  }

  .quantity-section {
    margin-bottom: 2rem;

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 1rem;

      .quantity-btn {
        width: 40px;
        height: 40px;
        border: 1px solid #e2e8f0;
        background: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #64748b;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .quantity {
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
        min-width: 30px;
        text-align: center;
      }
    }
  }

  .notes-section {
    .notes-input {
      width: 100%;
      min-height: 80px;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      &::placeholder {
        color: #94a3b8;
      }
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem 2rem 2rem;
  border-top: 1px solid #e2e8f0;

  .total-price {
    .label {
      font-size: 14px;
      color: #64748b;
      margin-right: 8px;
    }

    .price {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
    }
  }

  .add-to-cart-btn {
    padding: 12px 24px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: #2563eb;
    }

    &:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .modal-body {
    padding: 1.5rem;

    .product-info {
      flex-direction: column;
      text-align: center;

      .product-image {
        align-self: center;
      }
    }

    .size-selection {
      .size-options {
        .size-option {
          flex: 1;
          min-width: 80px;
        }
      }
    }
  }

  .modal-footer {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    flex-direction: column;
    gap: 1rem;

    .add-to-cart-btn {
      width: 100%;
      justify-content: center;
    }
  }
}
</style> 