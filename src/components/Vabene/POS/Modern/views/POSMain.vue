<template>
  <div class="pos-main">
    <!-- Header avec recherche et informations utilisateur -->
    <header class="pos-header">
      <div class="header-left">
        <div class="logo">
          <div class="logo-icon">
            <i class="fas fa-utensils"></i>
          </div>
        </div>
        <div class="search-container">
          <i class="fas fa-search search-icon"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search Your Menu Here"
            class="search-input"
          />
        </div>
      </div>
      
      <div class="header-right">
        <div class="language-selector">
          <img src="/icons/uk-flag.png" alt="EN" class="flag-icon" />
          <img src="/icons/china-flag.png" alt="CN" class="flag-icon" />
        </div>
        <div class="notifications">
          <i class="fas fa-bell notification-icon"></i>
        </div>
        <div class="user-profile">
          <img src="/images/cashier-avatar.jpg" alt="Cashier" class="user-avatar" />
          <div class="user-info">
            <span class="user-name">Courtney Henry</span>
            <span class="user-role">Cashier 1st Shift</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Corps principal avec sidebar et contenu -->
    <div class="pos-body">
      <!-- Sidebar gauche avec navigation -->
      <aside class="pos-sidebar">
        <nav class="sidebar-nav">
          <button class="nav-item active">
            <i class="fas fa-th-large"></i>
          </button>
          <button class="nav-item">
            <i class="fas fa-chart-bar"></i>
          </button>
          <button class="nav-item">
            <i class="fas fa-tag"></i>
          </button>
          <button class="nav-item">
            <i class="fas fa-users"></i>
          </button>
          <button class="nav-item">
            <i class="fas fa-history"></i>
          </button>
          <button class="nav-item">
            <i class="fas fa-cog"></i>
          </button>
        </nav>
        <div class="sidebar-bottom">
          <button class="nav-item">
            <i class="fas fa-question-circle"></i>
          </button>
          <button class="nav-item">
            <i class="fab fa-google"></i>
          </button>
        </div>
      </aside>

      <!-- Zone principale de contenu -->
      <main class="pos-content">
        <!-- Navigation par catégories -->
        <CategoryNavigation 
          :categories="categories"
          :selected-category="selectedCategory"
          @category-change="handleCategoryChange"
        />

        <!-- Menu et grille de produits -->
        <ProductMenu 
          :category="selectedCategory"
          :search-query="searchQuery"
          @add-to-cart="handleAddToCart"
        />
      </main>

      <!-- Zone de commande/facturation à droite -->
      <aside class="pos-invoice">
        <OrderInvoice 
          :cart="cart"
          :order-summary="orderSummary"
          @update-quantity="handleUpdateQuantity"
          @remove-item="handleRemoveItem"
          @place-order="handlePlaceOrder"
        />
      </aside>
    </div>

    <!-- Modales -->
    <ProductCustomizationModal 
      v-if="showProductModal"
      :product="selectedProduct"
      @close="closeProductModal"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import CategoryNavigation from '../components/CategoryNavigation.vue'
import ProductMenu from '../components/ProductMenu.vue'
import OrderInvoice from '../components/OrderInvoice.vue'
import ProductCustomizationModal from '../modals/ProductCustomizationModal.vue'
import type { 
  Category, 
  Product, 
  CartItem, 
  AddToCartEvent,
  OrderSummary 
} from '../types'
import { CATEGORIES } from '../types'

const store = useStore()

// État local
const searchQuery = ref('')
const selectedCategory = ref('lunch')
const showProductModal = ref(false)
const selectedProduct = ref<Product | null>(null)

// Données des catégories
const categories = ref<Category[]>(CATEGORIES)

// État du panier depuis Vuex
const cart = computed(() => store.getters['cart/cart'])
const cartTotal = computed(() => store.getters['cart/cartTotal'])
const cartCount = computed(() => store.getters['cart/cartCount'])

// Calcul du résumé de commande
const orderSummary = computed((): OrderSummary => {
  const subtotal = cart.value.reduce((sum: number, item: CartItem) => sum + item.totalPrice, 0)
  const tax = subtotal * 0.1 // 10% de taxe
  const total = subtotal + tax
  
  return {
    subtotal,
    tax,
    total,
    items: cart.value
  }
})

// Gestionnaires d'événements
const handleCategoryChange = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const handleAddToCart = (event: AddToCartEvent) => {
  const cartItem: CartItem = {
    id: generateId(),
    productId: event.product.id,
    name: event.product.name,
    image: event.product.image,
    selectedSize: event.size,
    quantity: event.quantity,
    basePrice: parseFloat(event.size.price),
    totalPrice: calculateItemTotal(event),
    ingredients: event.ingredients,
    supplements: event.supplements,
    notes: event.notes || '',
    localProductId: generateLocalProductId(event)
  }
  
  store.dispatch('cart/addToCart', { item: cartItem })
  closeProductModal()
}

const handleUpdateQuantity = (itemId: string, quantity: number) => {
  if (quantity <= 0) {
    handleRemoveItem(itemId)
  } else {
    store.dispatch('cart/incrementQuantity', itemId)
  }
}

const handleRemoveItem = (itemId: string) => {
  const item = cart.value.find((item: CartItem) => item.localProductId === itemId)
  if (item) {
    store.dispatch('cart/removeFromCart', item)
  }
}

const handlePlaceOrder = () => {
  // Logique pour finaliser la commande
  console.log('Commande placée:', orderSummary.value)
  // Ici on pourrait ouvrir une modale de confirmation ou rediriger
}

const closeProductModal = () => {
  showProductModal.value = false
  selectedProduct.value = null
}

// Fonctions utilitaires
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

const generateLocalProductId = (event: AddToCartEvent): string => {
  const baseId = `${event.product.id}_${event.size.id}`
  const ingredientsHash = event.ingredients
    .filter(ing => !ing.isDefault && ing.quantity > 0)
    .map(ing => `${ing.id}_${ing.quantity}`)
    .sort()
    .join('_')
  const supplementsHash = event.supplements
    .filter(sup => sup.quantity > 0)
    .map(sup => `${sup.id}_${sup.quantity}`)
    .sort()
    .join('_')
  
  return `${baseId}_${ingredientsHash}_${supplementsHash}`
}

const calculateItemTotal = (event: AddToCartEvent): number => {
  const basePrice = parseFloat(event.size.price)
  const ingredientsPrice = event.ingredients.reduce((sum, ing) => {
    return !ing.isDefault && ing.quantity > 0 ? sum + (ing.extra_cost_price * ing.quantity) : sum
  }, 0)
  const supplementsPrice = event.supplements.reduce((sum, sup) => {
    return sup.quantity > 0 ? sum + (sup.extra_cost_price * sup.quantity) : sum
  }, 0)
  
  return (basePrice + ingredientsPrice + supplementsPrice) * event.quantity
}

// Initialisation
onMounted(() => {
  // Charger les données initiales depuis les stores
  store.dispatch('cart/loadFromCookies')
})
</script>

<style lang="scss" scoped>
.pos-main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
}

.pos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  height: 80px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 2rem;

    .logo {
      .logo-icon {
        width: 48px;
        height: 48px;
        background: #3b82f6;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
      }
    }

    .search-container {
      position: relative;
      
      .search-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #64748b;
        font-size: 16px;
      }

      .search-input {
        width: 400px;
        height: 48px;
        padding: 0 16px 0 48px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        font-size: 14px;
        background: #f8fafc;
        
        &:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 2rem;

    .language-selector {
      display: flex;
      gap: 8px;

      .flag-icon {
        width: 24px;
        height: 18px;
        border-radius: 2px;
        cursor: pointer;
      }
    }

    .notifications {
      .notification-icon {
        font-size: 20px;
        color: #64748b;
        cursor: pointer;
      }
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;

      .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
      }

      .user-info {
        display: flex;
        flex-direction: column;

        .user-name {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
        }

        .user-role {
          font-size: 12px;
          color: #64748b;
        }
      }
    }
  }
}

.pos-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.pos-sidebar {
  width: 80px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 0;

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;

    .nav-item {
      width: 48px;
      height: 48px;
      border: none;
      background: transparent;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      font-size: 18px;
      transition: all 0.2s;

      &:hover {
        background: #f1f5f9;
        color: #3b82f6;
      }

      &.active {
        background: #3b82f6;
        color: white;
      }
    }
  }

  .sidebar-bottom {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;

    .nav-item {
      width: 48px;
      height: 48px;
      border: none;
      background: transparent;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      font-size: 18px;
      transition: all 0.2s;

      &:hover {
        background: #f1f5f9;
        color: #3b82f6;
      }
    }
  }
}

.pos-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.pos-invoice {
  width: 400px;
  background: white;
  border-left: 1px solid #e2e8f0;
  overflow-y: auto;
}

@media (max-width: 1200px) {
  .pos-invoice {
    width: 350px;
  }
}

@media (max-width: 768px) {
  .pos-header {
    .header-left {
      .search-container {
        .search-input {
          width: 200px;
        }
      }
    }
  }

  .pos-invoice {
    width: 320px;
  }
}
</style> 