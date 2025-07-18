<template>
  <div class="order-invoice">
    <!-- En-tête -->
    <div class="invoice-header">
      <h2 class="invoice-title">Invoice</h2>
    </div>

    <!-- Liste des articles -->
    <div class="cart-items">
      <div 
        v-for="item in cart" 
        :key="item.localProductId"
        class="cart-item"
      >
        <div class="item-image">
          <img :src="item.image" :alt="item.name" />
        </div>
        
        <div class="item-details">
          <h4 class="item-name">{{ item.name }}</h4>
          <div class="item-meta">
            <span class="item-quantity">{{ item.quantity }}x</span>
            <span class="item-note" v-if="item.notes">{{ item.notes }}</span>
          </div>
        </div>
        
        <div class="item-price">
          <span class="price">{{ formatPrice(item.totalPrice) }}</span>
        </div>
        
        <button 
          class="remove-item"
          @click="$emit('remove-item', item.localProductId)"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Message si panier vide -->
      <div v-if="cart.length === 0" class="empty-cart">
        <div class="empty-icon">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <p>Votre panier est vide</p>
        <span>Ajoutez des articles pour commencer</span>
      </div>
    </div>

    <!-- Résumé de paiement -->
    <div class="payment-summary">
      <h3 class="summary-title">Payment Summary</h3>
      
      <div class="summary-rows">
        <div class="summary-row">
          <span class="label">Sub Total</span>
          <span class="value">{{ formatPrice(orderSummary.subtotal) }}</span>
        </div>
        
        <div class="summary-row">
          <span class="label">Tax</span>
          <span class="value">{{ formatPrice(orderSummary.tax) }}</span>
        </div>
        
        <div class="summary-row total">
          <span class="label">Total Payment</span>
          <span class="value">{{ formatPrice(orderSummary.total) }}</span>
        </div>
      </div>
    </div>

    <!-- Méthodes de paiement -->
    <div class="payment-methods">
      <div class="payment-options">
        <button 
          v-for="method in paymentMethods"
          :key="method.id"
          :class="['payment-method', { active: selectedPaymentMethod === method.id }]"
          @click="selectPaymentMethod(method.id)"
        >
          <div class="method-icon">
            <i :class="getPaymentIcon(method.id)"></i>
          </div>
          <span class="method-name">{{ method.name }}</span>
        </button>
      </div>
    </div>

    <!-- Bouton de commande -->
    <div class="order-actions">
      <button 
        class="place-order-btn"
        :disabled="cart.length === 0 || !selectedPaymentMethod"
        @click="$emit('place-order')"
      >
        <span>Place An Order</span>
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CartItem, OrderSummary, PaymentMethod } from '../types'
import { PAYMENT_METHODS } from '../types'

interface Props {
  cart: CartItem[]
  orderSummary: OrderSummary
}

defineProps<Props>()

defineEmits<{
  'update-quantity': [itemId: string, quantity: number]
  'remove-item': [itemId: string]
  'place-order': []
}>()

// État local
const selectedPaymentMethod = ref<string>('card')
const paymentMethods = ref<PaymentMethod[]>(PAYMENT_METHODS)

// Méthodes
const formatPrice = (price: number): string => {
  return price.toFixed(1)
}

const selectPaymentMethod = (methodId: string) => {
  selectedPaymentMethod.value = methodId
}

const getPaymentIcon = (methodId: string): string => {
  const icons: Record<string, string> = {
    card: 'fas fa-credit-card',
    paylater: 'fas fa-clock',
    cash: 'fas fa-money-bill-wave'
  }
  return icons[methodId] || 'fas fa-credit-card'
}
</script>

<style lang="scss" scoped>
.order-invoice {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem;

  .invoice-header {
    margin-bottom: 2rem;

    .invoice-title {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
  }

  .cart-items {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 2rem;
    
    .cart-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 0;
      border-bottom: 1px solid #f1f5f9;
      position: relative;

      &:last-child {
        border-bottom: none;
      }

      .item-image {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        overflow: hidden;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .item-details {
        flex: 1;
        min-width: 0;

        .item-name {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }

        .item-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;

          .item-quantity {
            color: #64748b;
            font-weight: 500;
          }

          .item-note {
            color: #3b82f6;
            font-size: 12px;
            background: #eff6ff;
            padding: 2px 6px;
            border-radius: 4px;
          }
        }
      }

      .item-price {
        .price {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
        }
      }

      .remove-item {
        width: 24px;
        height: 24px;
        border: none;
        background: #fee2e2;
        color: #dc2626;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 10px;
        transition: all 0.2s ease;

        &:hover {
          background: #dc2626;
          color: white;
          transform: scale(1.1);
        }
      }
    }

    .empty-cart {
      text-align: center;
      padding: 3rem 1rem;
      color: #64748b;

      .empty-icon {
        font-size: 48px;
        margin-bottom: 1rem;
        opacity: 0.3;
      }

      p {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 4px 0;
      }

      span {
        font-size: 14px;
      }
    }
  }

  .payment-summary {
    background: #f8fafc;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;

    .summary-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 1rem 0;
    }

    .summary-rows {
      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-size: 14px;
          color: #64748b;
        }

        .value {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        &.total {
          border-top: 1px solid #e2e8f0;
          padding-top: 12px;
          margin-top: 8px;

          .label,
          .value {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
          }
        }
      }
    }
  }

  .payment-methods {
    margin-bottom: 2rem;

    .payment-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;

      .payment-method {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px 8px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        &.active {
          border-color: #3b82f6;
          background: #eff6ff;

          .method-icon {
            color: #3b82f6;
          }

          .method-name {
            color: #3b82f6;
          }
        }

        .method-icon {
          font-size: 24px;
          color: #64748b;
          transition: color 0.2s ease;
        }

        .method-name {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-align: center;
          transition: color 0.2s ease;
        }
      }
    }
  }

  .order-actions {
    .place-order-btn {
      width: 100%;
      height: 56px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
      }

      &:disabled {
        background: #94a3b8;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      i {
        font-size: 14px;
      }
    }
  }
}

@media (max-width: 768px) {
  .order-invoice {
    padding: 1rem;

    .cart-items {
      .cart-item {
        padding: 12px 0;

        .item-image {
          width: 50px;
          height: 50px;
        }

        .item-details {
          .item-name {
            font-size: 14px;
          }

          .item-meta {
            font-size: 12px;
          }
        }

        .item-price {
          .price {
            font-size: 14px;
          }
        }
      }
    }

    .payment-summary {
      padding: 1rem;

      .summary-title {
        font-size: 16px;
      }
    }

    .payment-methods {
      .payment-options {
        gap: 8px;

        .payment-method {
          padding: 12px 6px;

          .method-icon {
            font-size: 20px;
          }

          .method-name {
            font-size: 11px;
          }
        }
      }
    }

    .order-actions {
      .place-order-btn {
        height: 48px;
        font-size: 14px;
      }
    }
  }
}
</style> 