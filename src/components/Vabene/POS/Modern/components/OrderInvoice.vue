<template>
  <div class="order-invoice">
    <!-- En-tête avec informations client -->
    <div class="invoice-header">
      <div class="header-info">
        <div class="cashier-info">
          <div class="cashier-avatar">
            👤
          </div>
          <div class="cashier-details">
            <span class="cashier-name">Caissier</span>
            <span class="shift-info">Service {{ getCurrentShift() }}</span>
          </div>
        </div>
        <div class="invoice-number">
          <span class="invoice-label">Facture</span>
          <span class="invoice-id">#{{ getInvoiceNumber() }}</span>
        </div>
      </div>
    </div>

    <!-- Informations client -->
    <div class="customer-section">
      <h3 class="section-title">Informations Client</h3>
      <div class="customer-form">
        <div class="form-group">
          <label>Nom du client</label>
          <input 
            v-model="customerInfo.name" 
            type="text" 
            placeholder="Nom du client"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>Téléphone</label>
          <input 
            v-model="customerInfo.phone" 
            type="tel" 
            placeholder="Numéro de téléphone"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>Type de commande</label>
          <select v-model="orderType" class="form-select">
            <option value="dine-in">Sur place</option>
            <option value="takeaway">À emporter</option>
            <option value="delivery">Livraison</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste des articles -->
    <div class="cart-section">
      <div class="section-header">
        <h3 class="section-title">Commande</h3>
        <span class="item-count">{{ cart.length }} article(s)</span>
      </div>

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
            <p class="item-size">{{ item.selectedSize.size }}</p>
            
            <!-- Ingrédients personnalisés -->
            <div v-if="hasCustomIngredients(item)" class="item-customization">
              <span class="customization-label">Personnalisé:</span>
              <div class="ingredients-list">
                <span 
                  v-for="ingredient in getCustomIngredients(item)" 
                  :key="ingredient.id"
                  class="ingredient-tag"
                >
                  {{ ingredient.name }} ({{ ingredient.quantity }})
                </span>
              </div>
            </div>
            
            <!-- Notes -->
            <p v-if="item.notes" class="item-notes">{{ item.notes }}</p>
          </div>

          <div class="item-controls">
            <div class="quantity-controls">
              <button 
                class="qty-btn decrease"
                @click="decreaseQuantity(item.localProductId)"
              >
                ➖
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button 
                class="qty-btn increase"
                @click="increaseQuantity(item.localProductId)"
              >
                ➕
              </button>
            </div>
            
            <div class="item-price">
              <span class="price">{{ formatPrice(item.totalPrice) }}€</span>
            </div>
            
            <button 
              class="remove-btn"
              @click="removeItem(item.localProductId)"
            >
              🗑️
            </button>
          </div>
        </div>

        <!-- Message panier vide -->
        <div v-if="cart.length === 0" class="empty-cart">
          <div class="empty-icon">
            🛒
          </div>
          <p>Panier vide</p>
          <span>Ajoutez des articles pour commencer</span>
        </div>
      </div>
    </div>

    <!-- Résumé de la commande -->
    <div v-if="cart.length > 0" class="order-summary">
      <h3 class="section-title">Résumé</h3>
      
      <div class="summary-lines">
        <div class="summary-row">
          <span class="label">Sous-total</span>
          <span class="value">{{ formatPrice(orderSummary.subtotal) }}€</span>
        </div>
        
        <div class="summary-row">
          <span class="label">TVA ({{ taxRate }}%)</span>
          <span class="value">{{ formatPrice(orderSummary.tax) }}€</span>
        </div>
        
        <div class="summary-row total">
          <span class="label">Total</span>
          <span class="value">{{ formatPrice(orderSummary.total) }}€</span>
        </div>
      </div>
    </div>

    <!-- Méthodes de paiement -->
    <div v-if="cart.length > 0" class="payment-section">
      <h3 class="section-title">Mode de paiement</h3>
      
      <div class="payment-methods">
        <button
          v-for="method in paymentMethods"
          :key="method.id"
          :class="['payment-btn', { active: selectedPaymentMethod === method.id }]"
          @click="selectPaymentMethod(method.id)"
        >
          <span class="payment-icon">{{ getPaymentIcon(method.icon) }}</span>
          <span>{{ method.name }}</span>
        </button>
      </div>
    </div>

    <!-- Bouton de validation -->
    <div v-if="cart.length > 0" class="action-section">
      <button 
        class="place-order-btn"
        @click="handlePlaceOrder"
        :disabled="!canPlaceOrder"
      >
        <span>Valider la commande</span>
        <span class="order-total">{{ formatPrice(orderSummary.total) }}€</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CartItem, OrderSummary, PaymentMethod } from '../types'

interface Props {
  cart: CartItem[]
  orderSummary: OrderSummary
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-quantity': [itemId: string, quantity: number]
  'remove-item': [itemId: string]
  'place-order': [orderData: any]
}>()

// État local
const customerInfo = ref({
  name: '',
  phone: ''
})

const orderType = ref<'dine-in' | 'takeaway' | 'delivery'>('dine-in')
const selectedPaymentMethod = ref<string>('cash')
const taxRate = ref(2.6) // Taux de TVA suisse

// Méthodes de paiement
const paymentMethods: PaymentMethod[] = [
  { id: 'cash', name: 'Espèces', icon: 'money-bill', isSelected: true },
  { id: 'card', name: 'Carte', icon: 'credit-card', isSelected: false },
  { id: 'twint', name: 'TWINT', icon: 'mobile-alt', isSelected: false }
]

// Fonctions utilitaires
const formatPrice = (price: number | string | undefined): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  if (numPrice === undefined || numPrice === null || isNaN(numPrice)) {
    return '0.00'
  }
  return numPrice.toFixed(2)
}

const getCurrentShift = (): string => {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 14) return 'Matin'
  if (hour >= 14 && hour < 22) return 'Après-midi'
  return 'Soir'
}

const getInvoiceNumber = (): string => {
  const now = new Date()
  const timestamp = now.getTime().toString().slice(-6)
  return `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${timestamp}`
}

const hasCustomIngredients = (item: CartItem): boolean => {
  return item.ingredients.some(ing => !ing.isDefault && ing.quantity > 0)
}

const getCustomIngredients = (item: CartItem) => {
  return item.ingredients.filter(ing => !ing.isDefault && ing.quantity > 0)
}

const getPaymentIcon = (iconName: string): string => {
  const iconMap: Record<string, string> = {
    'money-bill': '💵',
    'credit-card': '💳',
    'mobile-alt': '📱'
  }
  return iconMap[iconName] || '💵'
}

// Validation pour passer commande
const canPlaceOrder = computed(() => {
  return props.cart.length > 0 && 
         customerInfo.value.name.trim() !== '' &&
         selectedPaymentMethod.value !== ''
})

// Gestionnaires d'événements
const decreaseQuantity = (itemId: string) => {
  const item = props.cart.find(item => item.localProductId === itemId)
  if (item) {
    emit('update-quantity', itemId, item.quantity - 1)
  }
}

const increaseQuantity = (itemId: string) => {
  const item = props.cart.find(item => item.localProductId === itemId)
  if (item) {
    emit('update-quantity', itemId, item.quantity + 1)
  }
}

const removeItem = (itemId: string) => {
  emit('remove-item', itemId)
}

const selectPaymentMethod = (methodId: string) => {
  selectedPaymentMethod.value = methodId
}

const handlePlaceOrder = () => {
  const orderData = {
    customer: customerInfo.value,
    orderType: orderType.value,
    paymentMethod: selectedPaymentMethod.value,
    items: props.cart,
    summary: props.orderSummary,
    timestamp: new Date().toISOString()
  }
  
  emit('place-order', orderData)
}
</script>

<style lang="scss" scoped>
.order-invoice {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.invoice-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  
  .header-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .cashier-info {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .cashier-avatar {
        width: 40px;
        height: 40px;
        background: #388D35;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
      }
      
      .cashier-details {
        display: flex;
        flex-direction: column;
        
        .cashier-name {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
        }
        
        .shift-info {
          font-size: 12px;
          color: #64748b;
        }
      }
    }
    
    .invoice-number {
      text-align: right;
      
      .invoice-label {
        display: block;
        font-size: 12px;
        color: #64748b;
      }
      
      .invoice-id {
        font-weight: 600;
        font-size: 14px;
        color: #1e293b;
      }
    }
  }
}

.customer-section, .cart-section, .order-summary, .payment-section {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.customer-form {
  .form-group {
    margin-bottom: 1rem;
    
    label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 4px;
    }
    
    .form-input, .form-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s ease;
      
      &:focus {
        outline: none;
        border-color: #388D35;
        box-shadow: 0 0 0 2px rgba(56, 141, 53, 0.1);
      }
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  .item-count {
    font-size: 12px;
    color: #64748b;
    background: #f8fafc;
    padding: 4px 8px;
    border-radius: 4px;
  }
}

.cart-items {
  max-height: 300px;
  overflow-y: auto;
  
  .cart-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f8fafc;
    
    &:last-child {
      border-bottom: none;
    }
    
    .item-image {
      width: 48px;
      height: 48px;
      border-radius: 6px;
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
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 4px 0;
        line-height: 1.3;
      }
      
      .item-size {
        font-size: 12px;
        color: #64748b;
        margin: 0 0 4px 0;
      }
      
      .item-customization {
        margin: 4px 0;
        
        .customization-label {
          font-size: 11px;
          color: #388D35;
          font-weight: 500;
        }
        
        .ingredients-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 2px;
          
          .ingredient-tag {
            font-size: 10px;
            background: #f0f9ff;
            color: #0369a1;
            padding: 2px 6px;
            border-radius: 4px;
          }
        }
      }
      
      .item-notes {
        font-size: 11px;
        color: #64748b;
        font-style: italic;
        margin: 0;
      }
    }
    
    .item-controls {
      display: flex;
      flex-direction: column;
      align-items: end;
      gap: 8px;
      
      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #f8fafc;
        border-radius: 6px;
        padding: 2px;
        
        .qty-btn {
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 4px;
          background: white;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 10px;
          transition: all 0.2s ease;
          
          &:hover {
            background: #388D35;
            color: white;
          }
          
          &.increase {
            background: #388D35;
            color: white;
          }
        }
        
        .quantity {
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
          min-width: 16px;
          text-align: center;
        }
      }
      
      .item-price {
        .price {
          font-size: 14px;
          font-weight: 600;
          color: #388D35;
        }
      }
      
      .remove-btn {
        width: 20px;
        height: 20px;
        border: none;
        background: #fef2f2;
        color: #dc2626;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
        transition: all 0.2s ease;
        
        &:hover {
          background: #dc2626;
          color: white;
        }
      }
    }
  }
}

.empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: #94a3b8;
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  p {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 4px 0;
    color: #64748b;
  }
  
  span {
    font-size: 12px;
  }
}

.summary-lines {
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    
    &.total {
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
      margin-top: 8px;
      
      .label, .value {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
      }
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
  }
}

.payment-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  
  .payment-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #388D35;
    }
    
    &.active {
      background: #388D35;
      border-color: #388D35;
      color: white;
    }
    
    i {
      font-size: 18px;
    }
    
    span {
      font-size: 11px;
      font-weight: 500;
    }
  }
}

.action-section {
  padding: 1.5rem;
  margin-top: auto;
  
  .place-order-btn {
    width: 100%;
    padding: 16px;
    background: #388D35;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &:hover:not(:disabled) {
      background: #2f7d32;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background: #94a3b8;
      cursor: not-allowed;
      transform: none;
    }
    
    .order-total {
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style> 