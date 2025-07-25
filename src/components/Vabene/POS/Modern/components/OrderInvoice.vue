<template>
  <div class="order-invoice">
    <!-- En-tête avec informations client -->
    <div class="invoice-header">
      <!-- <div class="header-info">
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
      </div> -->
      <!-- Information restaurant -->
      <div v-if="restaurantInfo" class="restaurant-info">
        <div class="restaurant-name">{{ restaurantInfo.name }}</div>
        <div class="restaurant-address">{{ restaurantInfo.address }} {{ restaurantInfo.numeroRue }}</div>
        <div class="restaurant-city">{{ restaurantInfo.codePostalID?.numeroPostal }} {{
          restaurantInfo.codePostalID?.ville }}</div>
        <div class="restaurant-phone">{{ restaurantInfo.phoneNumber }}</div>
      </div>
    </div>

    <!-- Informations client -->
    <div class="customer-section">
      <h3 class="section-title">Informations Client</h3>
      <!-- Indicateur client sélectionné -->
      <div v-if="selectedCustomer" class="selected-customer-banner">
        <div class="banner-content">
          <span class="banner-icon">👤</span>
          <div class="banner-text">
            <span class="banner-title">Client enregistré sélectionné</span>
            <span class="banner-subtitle">{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</span>
          </div>
        </div>
        <button @click="clearSelectedCustomer" class="banner-clear-btn">
          <i class="fas fa-times"></i>
          Désélectionner
        </button>
      </div>
      <div class="customer-form">
        <div class="form-group">
          <label>Prénom</label>
          <input v-model="customerInfo.firstName" type="text" placeholder="Prénom du client"
            :class="['form-input', { 'client-selected': selectedCustomer }]" @input="handleCustomerSearch" />



          <!-- Suggestions de clients -->
          <div v-if="customerSuggestions.length > 0" class="customer-suggestions">
            <div v-for="customer in customerSuggestions" :key="customer.id" class="customer-suggestion"
              @click="selectCustomer(customer)">
              <div class="suggestion-main">
                <span class="suggestion-name">{{ customer.firstName }} {{ customer.lastName }}</span>
                <span class="suggestion-phone">{{ customer.phoneNumber }}</span>
              </div>
              <div class="suggestion-address">{{ customer.email }}</div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Nom</label>
          <input v-model="customerInfo.lastName" type="text" placeholder="Nom du client"
            :class="['form-input', { 'client-selected': selectedCustomer }]" @input="handleCustomerSearch" />
        </div>
        <div class="form-group">
          <label>Téléphone</label>
          <input v-model="customerInfo.phone" type="tel" placeholder="Numéro de téléphone"
            :class="['form-input', { 'client-selected': selectedCustomer }]" @input="handleCustomerSearch" />
        </div>
        <!-- <div class="form-group">
          <label>Type de commande</label>
          <select v-model="orderType" class="form-select">
            <option value="dine-in">Sur place</option>
            <option value="takeaway">À emporter</option>
            <option value="delivery">Livraison</option>
          </select>
        </div> -->
      </div>
    </div>

    <!-- Liste des articles -->
    <div class="cart-section">
      <div class="section-header">
        <h3 class="section-title">Commande</h3>
        <span class="item-count">{{ cart.length }} article(s)</span>
      </div>

      <div class="cart-items">
        <div v-for="item in cart" :key="item.localProductId" class="cart-item">
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
                <span v-for="ingredient in getCustomIngredients(item)" :key="ingredient.id" class="ingredient-tag">
                  {{ ingredient.name }} ({{ ingredient.quantity }})
                </span>
              </div>
            </div>

            <!-- Options additionnelles -->
            <div v-if="item.additionnal && item.additionnal.length" class="item-customization">
              <span class="customization-label">Options :</span>
              <div class="ingredients-list">
                <span v-for="option in item.additionnal" :key="option" class="ingredient-tag">
                  {{ option }}
                </span>
              </div>
            </div>

            <!-- Suppléments -->
            <div v-if="item.supplements && item.supplements.length" class="item-customization">
              <span class="customization-label">Suppléments :</span>
              <div class="ingredients-list">
                <span v-for="supp in item.supplements" :key="supp.id" class="ingredient-tag">
                  {{ supp.name }}<template v-if="supp.quantity > 1"> ({{ supp.quantity }})</template>
                </span>
              </div>
            </div>

            <!-- Notes -->
            <p v-if="item.notes" class="item-notes">{{ item.notes }}</p>
          </div>

          <div class="item-controls">
            <div class="quantity-controls">
              <button class="qty-btn decrease" @click="decreaseQuantity(item.localProductId)">
                ➖
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button class="qty-btn increase" @click="increaseQuantity(item.localProductId)">
                ➕
              </button>
            </div>

            <div class="item-price">
              <span class="price">{{ formatPrice(item.totalPrice) }} CHF</span>
            </div>

            <button class="remove-btn" @click="removeItem(item.localProductId)">
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

      <!-- Features sélectionnées -->
      <div v-if="selectedFeatures.length > 0" class="features-section">
        <h4 class="features-title">Options sélectionnées</h4>
        <div class="features-list">
          <span v-for="feature in selectedFeatures" :key="feature" class="feature-tag">
            {{ feature }}
          </span>
        </div>
      </div>

      <div class="summary-lines">
        <div class="summary-row">
          <span class="label">Sous-total</span>
          <span class="value">{{ formatPrice(orderSummary.subtotal) }} CHF</span>
        </div>

        <div class="summary-row">
          <span class="label">TVA ({{ taxRate }}%)</span>
          <span class="value">{{ formatPrice(orderSummary.tax) }} CHF</span>
        </div>

        <div class="summary-row total">
          <span class="label">Total</span>
          <span class="value">{{ formatPrice(orderSummary.total) }} CHF</span>
        </div>
      </div>
    </div>

    <!-- Méthodes de paiement -->
    <div v-if="cart.length > 0" class="payment-section">
      <h3 class="section-title">Mode de paiement</h3>

      <div class="payment-methods">
        <button v-for="method in paymentMethods" :key="method.id"
          :class="['payment-btn', { active: selectedPaymentMethod === method.id }]"
          @click="selectPaymentMethod(method.id)">
          <span class="payment-icon">{{ getPaymentIcon(method.icon) }}</span>
          <span>{{ method.name }}</span>
        </button>
      </div>
    </div>

    <!-- Bouton de validation -->
    <div v-if="cart.length > 0" class="action-section">

      <button @click="handlePlaceOrder" :disabled="!canPlaceOrder || isProcessingOrder" class="place-order-btn">
        <i :class="isProcessingOrder ? 'fas fa-spinner fa-spin' : 'fas fa-receipt'"></i>
        {{ isProcessingOrder ? 'Traitement...' : 'Valider la commande' }}
        <span class="order-total">{{ formatPrice(orderSummary.total) }} CHF</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { CartItem, OrderSummary, PaymentMethod } from '../types'
import { createPOSOrder, detailRestaurant } from '@/service/api'
import { getCustomers } from '@/service/api'
import type { ApiResponse } from '@/models/Apiresponse'
import type { RestaurantModel } from '@/models/restaurant.model'
import type { CustomerModel } from '@/models/customer.model'
import { UserGeneralKey } from '@/models/user.generalkey'
import { useToast } from 'vue-toastification'
import { useStore } from 'vuex'

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
  id: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: ''
})

// État pour la recherche de clients
const customerSuggestions = ref<CustomerModel[]>([])
const allCustomers = ref<CustomerModel[]>([])
const searchTimeout = ref<NodeJS.Timeout | null>(null)
const selectedCustomer = ref<CustomerModel | null>(null)

const orderType = ref<'dine-in' | 'takeaway' | 'delivery'>('dine-in')
const selectedPaymentMethod = ref<string>('pay_click_collect_cash')
const taxRate = ref(2.6) // Taux de TVA suisse

// État pour la commande
const isProcessingOrder = ref(false)
const restaurantInfo = ref<RestaurantModel | null>(null)

// Utilitaires
const toast = useToast()
const store = useStore()

// Computed pour les features sélectionnées
const selectedFeatures = computed(() => {
  return store?.getters?.['features/selectedFeatures'] || []
})

// Méthodes de paiement pour click_collect
const paymentMethods: PaymentMethod[] = [
  { id: 'pay_click_collect_cash', name: 'Paiement en espèces', icon: 'money-bill', isSelected: true },
  { id: 'pay_click_collect_carte', name: 'Paiement par carte', icon: 'credit-card', isSelected: false }
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
    customerInfo.value.firstName.trim() !== '' &&
    customerInfo.value.lastName.trim() !== '' &&
    customerInfo.value.phone.trim() !== ''
})

// Charger tous les clients du restaurant
const loadCustomers = async () => {
  try {
    const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID)
    if (restaurantID) {
      const response = await getCustomers(1, restaurantID)
      if (response.code === 200 && response.data?.items) {
        allCustomers.value = response.data.items
        console.log(`✅ ${allCustomers.value.length} clients chargés pour la recherche`)
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error)
  }
}

// Recherche de clients avec debounce
const handleCustomerSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    searchCustomers()
  }, 300)
}

// Filtrer les clients selon la recherche
const searchCustomers = () => {
  const firstName = customerInfo.value.firstName.toLowerCase().trim()
  const lastName = customerInfo.value.lastName.toLowerCase().trim()
  const phone = customerInfo.value.phone.trim()
  const email = customerInfo.value.email.trim()

  // Si le client est déjà sélectionné, ne pas afficher les suggestions
  if (selectedCustomer.value) {
    customerSuggestions.value = []
    return
  }

  // Critères de recherche plus souples
  if (firstName.length < 2 && lastName.length < 2 && phone.length < 3) {
    customerSuggestions.value = []
    return
  }

  const results = allCustomers.value.filter(customer => {
    let matches = false

    // Recherche par prénom
    if (firstName.length >= 2) {
      matches = matches || customer.firstName.toLowerCase().includes(firstName)
    }

    // Recherche par nom
    if (lastName.length >= 2) {
      matches = matches || customer.lastName.toLowerCase().includes(lastName)
    }

    // Recherche par téléphone
    if (phone.length >= 3) {
      matches = matches || customer.phoneNumber.includes(phone)
    }

    // Recherche par email
    if (email.length >= 3) {
      matches = matches || customer.email.includes(email)
    }

    return matches
  }).slice(0, 5) // Limiter à 5 suggestions

  customerSuggestions.value = results
}

// Sélectionner un client depuis les suggestions
const selectCustomer = (customer: CustomerModel) => {
  selectedCustomer.value = customer
  customerInfo.value.id = customer.id
  customerInfo.value.firstName = customer.firstName
  customerInfo.value.lastName = customer.lastName
  customerInfo.value.phone = customer.phoneNumber
  customerInfo.value.email = customer.email
  customerSuggestions.value = []
}

// Supprimer la sélection du client
const clearSelectedCustomer = () => {
  selectedCustomer.value = null
  customerInfo.value = { id: '', firstName: '', lastName: '', phone: '', email: '' }
  customerSuggestions.value = []
}



// Fermer les suggestions
const closeSuggestions = () => {
  customerSuggestions.value = []
}

// Fermer les suggestions quand on clique ailleurs
onMounted(() => {
  loadRestaurantInfo()
  loadCustomers()

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.customer-form')) {
      closeSuggestions()
    }
  })
})

// Charger les informations du restaurant
const loadRestaurantInfo = async () => {
  try {
    const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID)
    if (restaurantID) {
      const response = await detailRestaurant(restaurantID) as ApiResponse<RestaurantModel>
      if (response.code === 200 && response.data) {
        restaurantInfo.value = response.data
        console.log('Restaurant info loaded:', restaurantInfo.value)
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des informations du restaurant:', error)
  }
}

// Transformer le panier pour l'API
const transformCartForAPI = (cart: CartItem[]) => {
  return cart.map(item => {
    // Collecter toutes les options pour ce produit
    const options: string[] = []

    // Ajouter les options additionnelles
    if (item.additionnal && item.additionnal.length > 0) {
      options.push(...item.additionnal)
    }

    // Ajouter les suppléments comme options
    if (item.supplements && item.supplements.length > 0) {
      item.supplements.forEach(supp => {
        if (supp.quantity > 0) {
          options.push(supp.name)
        }
      })
    }

    return {
      product_id: item.productId,
      specification_id: item.selectedSize.id,
      quantity: item.quantity,
      optionSpecific: options.join(', ') || "",
      ingredient: [...item.ingredients.map(ing => ({
        name: ing.name,
        extra_cost_price: String(ing.extra_cost_price),
        isDefault: ing.isDefault,
        size: ing.size || "",
        quantite: ing.quantity,
      })), ...item.supplements.map(supp => ({
        name: supp.name,
        extra_cost_price: String(supp.extra_cost_price),
        isDefault: false,
        size: supp.size || "",
        quantite: supp.quantity,
      }))],
    }
  })
}

// Extraire toutes les features du panier
const extractFeaturesFromCart = (cart: CartItem[]): string[] => {
  const features: string[] = []

  // Ajouter les features du store Vuex
  const storeFeatures = store?.getters?.['features/selectedFeatures'] || []
  features.push(...storeFeatures)

  cart.forEach(item => {
    // Ajouter les features additionnelles si elles existent
    if (item.additionnal && item.additionnal.length > 0) {
      features.push(...item.additionnal)
    }

    // Ajouter les ingrédients personnalisés comme features
    const customIngredients = item.ingredients.filter(ing => !ing.isDefault && ing.quantity > 0)
    customIngredients.forEach(ing => {
      features.push(`${ing.name} (${ing.quantity})`)
    })

    // Ajouter les suppléments comme features
    if (item.supplements && item.supplements.length > 0) {
      item.supplements.forEach(supp => {
        if (supp.quantity > 0) {
          features.push(`${supp.name}${supp.quantity > 1 ? ` (${supp.quantity})` : ''}`)
        }
      })
    }
  })

  // Retourner les features uniques
  return [...new Set(features)]
}

// Passer commande
const handlePlaceOrder = async () => {
  if (!canPlaceOrder.value || isProcessingOrder.value) return

  isProcessingOrder.value = true

  try {
    const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID)

    if (!restaurantID || !restaurantInfo.value) {
      toast.error('Informations du restaurant manquantes')
      return
    }

    // Extraire les features du panier
    const cartFeatures = extractFeaturesFromCart(props.cart)

    // ID du client
    const customerID = /* selectedCustomer.value?.id ||  */customerInfo.value.id;
    console.log('Customer ID:', customerID)

    // Préparer les données de commande selon le format de l'API
    const orderData = {
      coupon: "",
      codePostal: restaurantInfo.value.codePostalID?.numeroPostal || "",
      deliveryLocality: restaurantInfo.value.codePostalID?.ville || "",
      restaurantID: restaurantID,
      paniers: transformCartForAPI(props.cart),
      userID: selectedCustomer.value?.user?.id || "", // ID utilisateur si client sélectionné
      guest_first_name: customerInfo.value.firstName,
      civilite: selectedCustomer.value?.civilite || "",
      guest_last_name: customerInfo.value.lastName,
      guest_email: selectedCustomer.value?.email || "",
      guest_phone_number: customerInfo.value.phone,
      feature: cartFeatures, // L'API attend un array, pas un string
      order_type: "click_collect", // Toujours sur place pour le POS
      numberRue: restaurantInfo.value.numeroRue || "",
      deliveryPreference: "immediat", // Toujours immédiat
      typeCustomer: "customer",
      SpecialInstructions: "",
      timeOrder: "", // Pas de programmation pour immédiat
      payment_method: selectedPaymentMethod.value,
      addressLivraison: `${restaurantInfo.value.address} ${restaurantInfo.value.numeroRue}`.trim(),
      batiment: restaurantInfo.value.batiment || "",
      rue: restaurantInfo.value.address || "",
      newsletter: "0",
      intructionOrder: [
        {
          demandeCouverts: false,
          quantityCouverts: "0",
          delaiRecuperation: "00:00",
          isTrancher: false,
          cuisson: "Normal",
        },
      ],
    }

    console.log('Restaurant info utilisée:', {
      name: restaurantInfo.value.name,
      codePostal: restaurantInfo.value.codePostalID?.numeroPostal,
      ville: restaurantInfo.value.codePostalID?.ville,
      address: restaurantInfo.value.address,
      numeroRue: restaurantInfo.value.numeroRue,
      batiment: restaurantInfo.value.batiment
    })
    console.log('Payload de commande final:', orderData);
    console.log("Supplements:", props.cart.map(item => item.supplements))

    const response = await createPOSOrder(orderData)

    if (response.code === 200 || response.code === 201) {
      toast.success('Commande créée avec succès!')

      // Vider le panier
      if (store) {
        store.dispatch('cart/clearCart')
        // Vider les features sélectionnées
        store.dispatch('features/clearFeatures')
      }

      // Réinitialiser les informations client
      customerInfo.value = { id: '', firstName: '', lastName: '', phone: '', email: '' }

      // Vider le client sélectionné
      selectedCustomer.value = null
      customerSuggestions.value = []

      // Émettre l'événement de succès
      emit('place-order', { success: true, orderData: response.data })
    } else {
      toast.error(response.message || 'Erreur lors de la création de la commande')
    }
  } catch (error: any) {
    console.error('Erreur lors de la création de la commande:', error)
    const errorMessage = error?.response?.data?.message || 'Erreur lors de la création de la commande'
    toast.error(errorMessage)
  } finally {
    isProcessingOrder.value = false
  }
}

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

  .restaurant-info {
    // margin-top: 1rem;
    // padding-top: 1rem;
    // border-top: 1px solid #f1f5f9;
    text-align: center;

    .restaurant-name {
      font-size: 16px;
      font-weight: 600;
      color: #388D35;
      margin-bottom: 4px;
    }

    .restaurant-address {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 2px;
    }

    .restaurant-city {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 2px;
    }

    .restaurant-phone {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
  }
}

.customer-section,
.cart-section,
.order-summary,
.payment-section {
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
    position: relative;

    label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 4px;
    }

    .form-input,
    .form-select {
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

    &.client-selected {
      border: 1px solid #388D35;
      box-shadow: 0 0 0 2px rgba(56, 141, 53, 0.1);
    }

    .customer-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;

      .customer-suggestion {
        padding: 12px;
        cursor: pointer;
        border-bottom: 1px solid #f1f5f9;
        transition: background-color 0.2s ease;

        &:hover {
          background: #f8fafc;
        }

        &:last-child {
          border-bottom: none;
        }

        .suggestion-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;

          .suggestion-name {
            font-weight: 600;
            color: #1e293b;
            font-size: 14px;
          }

          .suggestion-phone {
            color: #388D35;
            font-size: 12px;
            font-weight: 500;
          }
        }

        .suggestion-address {
          color: #64748b;
          font-size: 12px;
        }
      }
    }
  }
}

.selected-customer-banner {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #388D35;
  font-size: 14px;
  font-weight: 500;

  .banner-content {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .banner-icon {
    font-size: 20px;
  }

  .banner-text {
    display: flex;
    flex-direction: column;
  }

  .banner-title {
    font-size: 12px;
    color: #388D35;
    font-weight: 600;
  }

  .banner-subtitle {
    font-size: 14px;
    font-weight: 600;
  }

  .banner-clear-btn {
    background: #dc2626;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;

    &:hover {
      background: #b91c1c;
      transform: translateY(-1px);
    }

    i {
      font-size: 10px;
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

      .label,
      .value {
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

.features-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;

  .features-title {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .features-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .feature-tag {
      display: inline-block;
      background: #f0fdf4;
      color: #388D35;
      border-radius: 6px;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      border: 1px solid #bbf7d0;
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