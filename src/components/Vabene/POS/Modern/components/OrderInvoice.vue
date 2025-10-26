<template>
  <div class="order-invoice">
    <!-- En-tête avec informations client -->
    <div class="invoice-header">
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
            <span class="banner-subtitle">{{ selectedCustomer.first_name || selectedCustomer.firstName }} {{ selectedCustomer.last_name || selectedCustomer.lastName }}</span>
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
                <span class="suggestion-name">{{ customer.first_name || customer.firstName }} {{ customer.last_name || customer.lastName }}</span>
                <span class="suggestion-phone">{{ customer.phone_number || customer.phoneNumber }}</span>
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
          <div class="phone-input-container">
            <span class="country-prefix">+41</span>
            <input v-model="customerInfo.phone" type="tel" placeholder="Numéro de téléphone"
              :class="['form-input', 'phone-input', { 'client-selected': selectedCustomer }]" @input="handleCustomerSearch" />
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="customerInfo.email" 
            type="email" 
            placeholder="Email du client" 
            required
            :class="['form-input', { 'client-selected': selectedCustomer, 'invalid-email': customerInfo.email && !isValidEmail(customerInfo.email) }]" 
            @input="handleCustomerSearch"
            @blur="validateEmail"
          />
          <div v-if="customerInfo.email && !isValidEmail(customerInfo.email)" class="email-error">
            Veuillez saisir une adresse email valide
          </div>
        </div>
        <div class="form-group">
          <label>Type de commande</label>
          <select v-model="selectedOrderType" class="form-select">
            <option value="dine_in">Sur place</option>
            <option value="click_collect">À emporter</option>
            <option value="delivery">Livraison</option>
          </select>
        </div>

        <!-- Type client -->
        <div style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px;">
          <label>Type client</label>
          <div style="display: flex; align-items: center; gap: 5px;">
            <input type="radio" name="customer" id="customer" value="customer" v-model="clientType">
            <label for="customer" style="font-size: 14px;">Client</label>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <input type="radio" name="organisation" id="organisation" value="organisation" v-model="clientType">
            <label for="organisation" style="font-size: 14px;">Organisation</label>
          </div>
        </div>

        <!-- AFficher champs organisation -->
        <div v-if="clientType === 'organisation'">
          <div class="form-group">
            <label>Société</label>
            <input v-model="organisationInfo.societe" type="text" placeholder="Nom de la société"
              :class="['form-input', { 'client-selected': selectedCustomer }]" @input="handleCustomerSearch" />
          </div>
          <div class="form-group">
            <label>Département</label>
            <input v-model="organisationInfo.departement" type="text" placeholder="Département"
              :class="['form-input', { 'client-selected': selectedCustomer }]" @input="handleCustomerSearch" />
          </div>
        </div>

        <!-- Options de récupération pour click_collect -->
        <div v-if="storeOrderType === 'click_collect' || storeOrderType === 'delivery'"
          class="delivery-preference-section">
          <label>Moment de récupération</label>
          <div class="delivery-options">
            <div class="delivery-option">
              <input type="radio" id="immediat" name="deliveryPreference" value="immediat" v-model="deliveryPreference"
                :disabled="!isRestaurantOpen">
              <label for="immediat" class="delivery-option-label">
                <span class="delivery-option-title">Dès que possible</span>
                <span v-if="!isRestaurantOpen" class="delivery-option-subtitle">
                  (Restaurant fermé)
                </span>
                <span v-else class="delivery-option-subtitle">
                  Prêt dans 15-20 minutes
                </span>
              </label>
            </div>
            
            <div class="delivery-option">
              <input type="radio" id="ulterieur" name="deliveryPreference" value="ulterieur"
                v-model="deliveryPreference">
              <label for="ulterieur" class="delivery-option-label">
                <span class="delivery-option-title">Date et heure souhaitées</span>
                <span class="delivery-option-subtitle">
                  Programmer pour plus tard
                </span>
              </label>
            </div>
          </div>

          <!-- Sélecteurs de date et heure pour livraison programmée -->
          <div v-if="deliveryPreference === 'ulterieur'" class="scheduled-delivery">
            <div class="form-group">
              <label>Date de récupération</label>
              <select v-model="selectedDate" class="form-select" @change="handleDateChange">
                <option value="">Sélectionner une date</option>
                <option v-for="date in getAvailableDates" :key="date.value" :value="date.value">
                  {{ date.label }}
                </option>
              </select>
            </div>
            
            <div class="form-group" v-if="selectedDate">
              <label>Heure de récupération</label>
              <select v-model="selectedTime" class="form-select">
                <option value="">Sélectionner une heure</option>
                <option v-for="time in getAvailableTimes" :key="time" :value="time">
                  {{ time }}
                </option>
              </select>
              <div v-if="selectedDate === getSwissDate().toISOString().split('T')[0] && getAvailableTimes.length === 0"
                class="time-info">
                <span class="time-info-text">Aucune heure disponible aujourd'hui. Veuillez sélectionner demain.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Champs d'adresse pour la livraison -->
        <div v-if="storeOrderType === 'delivery'" class="delivery-address-section">
          <h4 class="delivery-address-title">Adresse de livraison</h4>

          <!-- Sélection d'adresse utilisateur si client sélectionné -->
          <div v-if="selectedCustomer && userAddresses.length > 0" class="form-group">
            <label>Adresses enregistrées</label>
            <select v-model="selectedAddressId" class="form-select" @change="handleAddressSelection">
              <option value="">Nouvelle adresse</option>
              <option v-for="address in userAddresses" :key="address.id" :value="address.id">
                {{ address.rue || address.address }} {{ address.numeroLocalite || address.numeroRue }}, {{ address.localite || address.city }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>NPA (Code postal)</label>
            <div class="postal-code-input-container">
            <input 
                v-model="deliveryAddress.npa" 
              type="text" 
                placeholder="Code postal"
              class="form-input"
                :disabled="selectedAddressId !== '' && userAddresses.length > 0"
                @input="handlePostalCodeChange"
                @focus="handlePostalCodeChange"
              />
              
              <!-- Dropdown des suggestions de codes postaux -->
              <div v-if="showPostalCodeSuggestions" class="postal-code-suggestions">
                <div 
                  v-for="postalCode in postalCodeSuggestions" 
                  :key="postalCode.code" 
                  class="postal-code-suggestion"
                  @click="selectPostalCode(postalCode)"
                >
                  <span class="postal-code-number">{{ postalCode.code }}</span>
                  <span class="postal-code-city">{{ postalCode.locality }}</span>
          </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Localité</label>
            <input 
              v-model="deliveryAddress.localite" 
              type="text" 
              placeholder="Localité" 
              class="form-input"
              :disabled="selectedAddressId !== '' && userAddresses.length > 0"
            />
          </div>

          <div class="form-group">
            <label>Rue</label>
            <input v-model="deliveryAddress.rue" type="text" placeholder="Nom de la rue" class="form-input"
              :disabled="selectedAddressId !== '' && userAddresses.length > 0" />
          </div>

          <div class="form-group">
            <label>N° Rue</label>
            <input v-model="deliveryAddress.numeroRue" type="text" placeholder="Numéro de rue" class="form-input"
              :disabled="selectedAddressId !== '' && userAddresses.length > 0" />
          </div>
        </div>
      </div>

      <!-- Liste des articles -->
      <div class="cart-section">
        <div class="section-header">
          <h3 class="section-title">Commande</h3>
          <span class="item-count">{{ cartItemsWithCorrectPrices?.length || 0 }} article(s)</span>
        </div>

        <div class="cart-items">
          <div v-for="item in validCartItems" :key="item?.localProductId || item?.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>

            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-size">{{ item.selectedSize?.size }}</p>

              <!-- Ingrédients personnalisés -->
              <div v-if="hasCustomIngredients(item)" class="item-customization">
                <span class="customization-label">Personnalisé:</span>
                <div class="ingredients-list">
                  <span v-for="ingredient in getCustomIngredients(item)" :key="ingredient.id" class="ingredient-tag">
                    {{ ingredient.name }} ({{ ingredient.quantity }})
                  </span>
                </div>
              </div>

              <!-- Ingrédients retirés -->
              <div v-if="hasRemovedIngredients(item)" class="item-customization">
                <span class="customization-label">Retiré:</span>
                <div class="ingredients-list">
                  <span v-for="ingredient in getRemovedIngredients(item)" :key="ingredient.id" class="ingredient-tag removed-ingredient">
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
                <span class="price">{{ formatPrice(item.calculatedTotalPrice || item.totalPrice) }} CHF</span> 
              </div>

              <button class="remove-btn" @click="removeItem(item.localProductId)">
                🗑️
              </button>
            </div>
          </div>

          <!-- Message panier vide -->
          <div v-if="!validCartItems || validCartItems.length === 0" class="empty-cart">
            <div class="empty-icon">
              
            </div>
            <p>Panier vide</p>
            <span>Ajoutez des articles pour commencer</span>
          </div>
        </div>
      </div>

      <!-- Résumé de la commande -->
      <div v-if="storeCart.length > 0" class="order-summary">
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

        <!-- Section coupon -->
        <div class="coupon-section">
          <h4 class="coupon-title">Code promo</h4>
          
          <!-- Message montant minimum pour livraison -->
          <div v-if="storeOrderType === 'delivery' && restaurantMinOrder > 0" class="min-order-info">
            <div class="min-order-message">
              <span class="min-order-icon">ℹ️</span>
              <span class="min-order-text">
                Montant minimum de commande :<strong>{{ formatPrice(restaurantMinOrder) }} CHF</strong>
                <span v-if="minOrderSupplement > 0" class="min-order-warning">
                  (supplément de {{ formatPrice(minOrderSupplement) }} CHF appliqué)
                </span>
              </span>
            </div>
          </div>
          
          <!-- Coupon appliqué -->
          <div v-if="appliedCoupon" class="applied-coupon">
            <div class="coupon-info">
              <span class="coupon-code">{{ appliedCoupon.code }}</span>
              <span class="coupon-discount">-{{ formatPrice(appliedCoupon.discountAmount || 0) }} CHF</span>
            </div>
            <button @click="removeCoupon" class="remove-coupon-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Formulaire d'application de coupon -->
          <div v-else class="coupon-form">
            <div class="coupon-input-group">
              <input 
                v-model="couponCode" 
                type="text" 
                placeholder="Entrez votre code promo"
                class="coupon-input"
                :disabled="isApplyingCoupon"
                @keyup.enter="applyCouponCode"
              />
              <button 
                @click="applyCouponCode" 
                :disabled="!couponCode.trim() || isApplyingCoupon"
                class="apply-coupon-btn"
              >
                <i v-if="isApplyingCoupon" class="fas fa-spinner fa-spin"></i>
                <span v-else>Appliquer</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Bouton pour désactiver/réactiver le montant minimum -->
        <div v-if="storeOrderType === 'delivery'" class="min-order-controls">
          <button v-if="restaurantMinOrder > 0" type="button" class="btn-disable-min-order" @click="disableMinOrder">
            <span class="btn-icon">🚫</span>
            <span class="btn-text">Désactiver le montant minimum</span>
          </button>
          <button v-else type="button" class="btn-enable-min-order" @click="enableMinOrder">
            <span class="btn-icon">✅</span>
            <span class="btn-text">Réactiver le montant minimum</span>
          </button>
        </div>

        <!-- Champ de rabais -->
        <div class="discount-section">
          <div class="form-group">
            <label>Type de rabais</label>
            <div class="discount-type-selector">
              <label class="discount-type-option">
                <input type="radio" v-model="discountType" value="percentage" @change="handleDiscountTypeChange" />
                <span>Pourcentage (%)</span>
              </label>
              <label class="discount-type-option">
                <input type="radio" v-model="discountType" value="fixed" @change="handleDiscountTypeChange" />
                <span>Montant fixe (CHF)</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label v-if="discountType === 'percentage'">Rabais (%)</label>
            <label v-else>Rabais (CHF)</label>
            <div class="discount-input-group">
              <input v-if="discountType === 'percentage'" v-model="discountPercentage" type="number" min="0" max="100"
                step="0.1" placeholder="0" class="discount-input" @input="handleDiscountChange" />
              <input v-else v-model="discountFixed" type="number" min="0" step="0.01" placeholder="0.00"
                class="discount-input" @input="handleFixedDiscountChange" />
              <span class="discount-symbol">{{ discountType === 'percentage' ? '%' : 'CHF' }}</span>
            </div>
          </div>
        </div>

        <!-- Section Divers -->
        <div class="divers-section">
          <div class="form-group">
            <label>Divers (CHF)</label>
            <div class="discount-input-group">
              <input v-model="diversAmount" type="number" min="0" step="0.01" placeholder="0.00"
                class="discount-input" @input="handleDiversChange" />
              <span class="discount-symbol">CHF</span>
            </div>
          </div>
        </div>


        <div class="summary-lines">
          <div class="summary-row">
            <span class="label">Sous-total</span>
            <span class="value">{{ formatPrice(storeCartTotal) }} CHF</span>
          </div>

          <div class="summary-row" v-if="discountAmount > 0">
            <span class="label">
              Rabais 
              <span v-if="discountType === 'percentage'">({{ discountPercentage }}%)</span>
              <span v-else>({{ formatPrice(discountFixed) }} CHF)</span>
            </span>
            <span class="value discount-value">-{{ formatPrice(discountAmount) }} CHF</span>
          </div>

          <div class="summary-row" v-if="couponDiscountAmount > 0">
            <span class="label">Coupon ({{ appliedCoupon?.code }})</span>
            <span class="value discount-value">-{{ formatPrice(couponDiscountAmount) }} CHF</span>
          </div>

          <div class="summary-row" v-if="minOrderSupplement > 0">
            <span class="label">Supplément minimum de commande</span>
            <span class="value supplement-value">+{{ formatPrice(minOrderSupplement) }} CHF</span>
          </div>

          <div class="summary-row" v-if="diversAmount > 0">
            <span class="label">Divers</span>
            <span class="value divers-value">+{{ formatPrice(diversAmount) }} CHF</span>
          </div>

          <div class="summary-row">
            <span class="label">TVA ({{ taxRate }}%)</span>
            <span class="value">{{ formatPrice(storeCartTotal * taxRate / 100) }} CHF</span>
          </div>

          <div class="summary-row total">
            <span class="label">Total</span>
            <span class="value">{{ formatPrice(finalTotalWithCoupon) }} CHF</span>
          </div>
        </div>
      </div>

      <!-- Méthodes de paiement ! -->
      <div v-if="storeCart.length > 0" class="payment-section">
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
      <div v-if="storeCart.length > 0" class="action-section">

        <button @click="handlePlaceOrder" :disabled="!canPlaceOrder || isProcessingOrder" class="place-order-btn">
          <i :class="isProcessingOrder ? 'fas fa-spinner fa-spin' : 'fas fa-receipt'"></i>
          {{ isProcessingOrder ? 'Traitement...' : 'Valider la commande' }}
          <span class="order-total">{{ formatPrice(finalTotalWithCoupon) }} CHF</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { CartItem, OrderSummary, PaymentMethod } from '../types'
import { createPOSOrder, detailRestaurant, getUserAddresses, applyCoupon, getRestaurantDetails, getAllPostalCodes, calculateMinimumAmount } from '@/service/api'
import { getAllCustomers } from '@/service/api'
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

// Utiliser les getters du store pour avoir les données réactives
const storeCart = computed(() => store.getters['cart/cart'] || [])
const storeCartTotal = computed(() => store.getters['cart/cartTotal'] || 0)

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

// Synchroniser avec le store
const storeOrderType = computed({
  get: () => store.getters['orderType/selectedOrderType'] || 'dine_in',
  set: (value) => store.dispatch('orderType/setOrderType', value)
})

// Variable locale pour le select
const selectedOrderType = ref('dine_in')

// Synchroniser avec le store au montage
onMounted(() => {
  store.dispatch('cart/clearCart')
  selectedOrderType.value = store.getters['orderType/selectedOrderType'] || 'dine_in'
  
  loadRestaurantInfo()
  loadRestaurantDetails()
  loadAllPostalCodes()
  // Ne pas charger tous les clients au démarrage, seulement quand l'utilisateur recherche
  // loadCustomers()
  //store.dispatch('orderType/loadFromStorage')


  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.customer-form')) {
      closeSuggestions()
    }
    if (!target.closest('.postal-code-input-container')) {
      showPostalCodeSuggestions.value = false
    }
  })
})

const selectedPaymentMethod = ref<string>('pay_click_collect_cash')
const taxRate = ref(2.6) // Taux de TVA suisse

// Type de client
const clientType = ref<'customer' | 'organisation'>('customer');
const organisationInfo = ref({
  societe: '',
  departement: '',
})

// État pour la préférence de livraison
const deliveryPreference = ref<'immediat' | 'ulterieur'>('immediat')
const selectedDate = ref<string>('')
const selectedTime = ref<string>('')

// État pour la commande
const isProcessingOrder = ref(false)
const restaurantInfo = ref<RestaurantModel | null>(null)

// État pour le rabais
const discountType = ref<'percentage' | 'fixed'>('percentage')
const discountPercentage = ref<number>(0)
const discountFixed = ref<number>(0)

// État pour le champ divers
const diversAmount = ref<number>(0)

// État pour les coupons
const couponCode = ref<string>('')
const appliedCoupon = ref<any>(null)
const isApplyingCoupon = ref<boolean>(false)

// État pour le montant minimum de commande
const restaurantDetails = ref<any>(null)
const restaurantMinOrder = ref<number>(0)

// État pour les codes postaux
const allPostalCodes = ref<any[]>([])
const postalCodeSuggestions = ref<any[]>([])
const showPostalCodeSuggestions = ref<boolean>(false)
const selectedPostalCode = ref<any>(null)

// État pour l'adresse de livraison
const deliveryAddress = ref({
  rue: '',
  numeroRue: '',
  npa: '',
  localite: ''
})

// État pour les adresses utilisateur
const userAddresses = ref<any[]>([])
const selectedAddressId = ref<string>('')
const isLoadingAddresses = ref(false)

// Utilitaires
const toast = useToast()
const store = useStore()

// Fonction pour valider si un email est valide
const isValidEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

const getRestaurantMinOrder = async (codePostal: string, localite: string, restaurantID: string) : Promise<number> => {
  try {
    const response = await calculateMinimumAmount(codePostal, localite, restaurantID)
   
    const minOrder = response?.data?.zone?.minimumOrderAmount || 0;
    return minOrder
  } catch (error) {
    return 0
  }
}

const validateEmail = () => {
  if (customerInfo.value.email && !isValidEmail(customerInfo.value.email)) {
    // Optionnel: afficher un toast d'avertissement
    // toast.warning('Email invalide. Un email unique sera généré pour cette commande.')
  }
}

// Fonctions utilitaires pour la gestion des dates et horaires
const getSwissDate = (date?: Date) => {
  const now = date || new Date();
  // Utiliser le fuseau horaire de la Suisse (Europe/Zurich)
  return new Date(now.toLocaleString("en-US", { timeZone: "Europe/Zurich" }));
};

// Utilitaires pour la gestion des horaires
const getCurrentTime = () => {
  // Utiliser le fuseau horaire de la Suisse
  const swissDate = getSwissDate();
  return swissDate.getHours() * 60 + swissDate.getMinutes(); // Minutes depuis minuit en heure suisse
};

const parseTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

const isRestaurantOpen = computed(() => {
  // Utiliser directement la propriété isOpen du restaurant
  return restaurantInfo.value?.isOpen ?? true;
});

const getAvailableTimes = computed(() => {
  // Pour l'instant, générer des créneaux standards si le restaurant est ouvert
  if (!restaurantInfo.value?.isOpen) {
    return [];
  }

  const times: string[] = [];
  const currentTime = getCurrentTime(); // Minutes depuis minuit
  const selectedDateValue = selectedDate.value;
  
  // Générer des créneaux de 15 minutes de 11h à 22h (horaires standards)
  for (let hour = 11; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      
      // Vérifier si cette heure n'est pas déjà passée
      const timeInMinutes = hour * 60 + minute;
      
      // Si c'est aujourd'hui, vérifier que l'heure n'est pas passée
      if (selectedDateValue === getSwissDate().toISOString().split("T")[0]) {
        if (timeInMinutes > currentTime + 30) { // +30 minutes de marge
          times.push(timeString);
        }
      } else {
        // Si c'est demain ou plus tard, toutes les heures sont disponibles
        times.push(timeString);
      }
    }
  }

  return times;
});

const getAvailableDates = computed(() => {
  // Utiliser le fuseau horaire de la Suisse pour déterminer les dates
  const today = getSwissDate();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dates: Array<{ value: string; label: string }> = [];

  // Vérifier si aujourd'hui est encore valide (pas trop tard)
  const currentTime = getCurrentTime();
  const isTodayStillValid = currentTime < 21 * 60; // Avant 21h00

  if (isTodayStillValid) {
    dates.push({
      value: today.toISOString().split("T")[0],
      label: `${today.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })} - Aujourd'hui`,
    });
  }

  // Demain est toujours disponible
  dates.push({
    value: tomorrow.toISOString().split("T")[0],
    label: `${tomorrow.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })} - Demain`,
  });

  return dates;
});

// Fonction pour formater la date pour le payload
const formatDateForPayload = (date: string, time: string): string => {
  const dateObj = new Date(date);
  return `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()} ${time}`;
};

// Computed pour les features sélectionnées
const selectedFeatures = computed(() => {
  return store?.getters?.['features/selectedFeatures'] || []
})

// Computed pour le rabais
const discountAmount = computed(() => {
  if (discountType.value === 'percentage') {
    if (discountPercentage.value <= 0) return 0
    // Limiter le rabais en pourcentage à 100%
    const maxDiscount = Math.min(discountPercentage.value, 100)
    return (storeCartTotal.value * maxDiscount) / 100
  } else {
    if (discountFixed.value <= 0) return 0
    // Le rabais fixe ne peut pas dépasser le sous-total
    return Math.min(discountFixed.value, storeCartTotal.value)
  }
})

// Computed pour le total avec coupon
const couponDiscountAmount = computed(() => {
  if (!appliedCoupon.value) return 0
  const amount = appliedCoupon.value.discountAmount || 0
  return amount
})

// Fonction pour charger le montant minimum de commande
const loadRestaurantMinOrder = async () => {
  
  if (storeOrderType.value === 'delivery' && deliveryAddress.value.npa) {
    const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID)
    
    if (restaurantID) {
      try {
        const minOrder = await getRestaurantMinOrder(deliveryAddress.value.npa, deliveryAddress.value.localite, restaurantID)
        restaurantMinOrder.value = minOrder
      } catch (error) {
        restaurantMinOrder.value = 0
      }
    }
  } 
}

const disableMinOrder = () => {
  restaurantMinOrder.value = 0
}

const enableMinOrder = async () => {
  await loadRestaurantMinOrder()
}

// Computed pour le supplément de montant minimum (livraison uniquement)
const minOrderSupplement = computed(() => {
  if (storeOrderType.value !== 'delivery') return 0
  
  const subtotalAfterDiscount = storeCartTotal.value - discountAmount.value
  const totalAfterCoupon = subtotalAfterDiscount - couponDiscountAmount.value
  const remainingAmount = Math.max(0, restaurantMinOrder.value - totalAfterCoupon)
  
  return remainingAmount
})

// Computed pour le total final avec rabais, coupon, supplément minimum et divers
const finalTotalWithCoupon = computed(() => {
  const subtotalAfterDiscount = storeCartTotal.value - discountAmount.value
  const totalAfterCoupon = subtotalAfterDiscount - couponDiscountAmount.value
  const totalWithSupplement = totalAfterCoupon + minOrderSupplement.value
  const totalWithDivers = totalWithSupplement + diversAmount.value
  const finalTotal = Math.max(0, totalWithDivers) // Ne peut pas être négatif
  
  return finalTotal
})

// Computed pour le résumé avec rabais appliqué
const orderSummaryWithDiscount = computed(() => {
  const subtotalWithDiscount = storeCartTotal.value - discountAmount.value
  const subtotalWithDivers = subtotalWithDiscount + diversAmount.value
  const taxOnDiscountedSubtotal = (subtotalWithDivers * taxRate.value) / 100 // TVA incluant le montant divers
  const totalWithDiscount = subtotalWithDiscount // Le total ne comprend pas la TVA
  
  return {
    subtotal: storeCartTotal.value,
    tax: taxOnDiscountedSubtotal,
    total: totalWithDiscount
  }
})

// Computed pour le total final avec rabais
const finalTotal = computed(() => {
  return orderSummaryWithDiscount.value.total
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

// Fonction pour masquer les emails
const maskEmail = (email: string): string => {
  if (!email || email.trim() === '') return ''
  
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  
  // Masquer la partie locale (garder le premier et dernier caractère)
  let maskedLocal = localPart
  if (localPart.length > 2) {
    maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1)
  }
  
  // Masquer partiellement le domaine
  const [domainName, extension] = domain.split('.')
  let maskedDomain = domainName
  if (domainName && domainName.length > 2) {
    maskedDomain = domainName.charAt(0) + '*'.repeat(domainName.length - 2) + domainName.charAt(domainName.length - 1)
  }
  
  return `${maskedLocal}@${maskedDomain}.${extension}`
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
  return item.ingredients.some(ing => ing.quantity > 0)
}

const getCustomIngredients = (item: CartItem) => {
  return item.ingredients.filter(ing => ing.quantity > 0)
}

const hasRemovedIngredients = (item: CartItem): boolean => {
  return Boolean(item.removedIngredients && item.removedIngredients.length > 0)
}

const getRemovedIngredients = (item: CartItem) => {
  return item.removedIngredients || []
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
  const basicValidation = storeCart.value.length > 0 &&
    customerInfo.value.firstName.trim() !== '' &&
    customerInfo.value.lastName.trim() !== '' &&
    customerInfo.value.phone.trim() !== '' 
  
  // Validation supplémentaire pour la livraison programmée
  if (storeOrderType.value === 'click_collect' && deliveryPreference.value === 'ulterieur') {
    return basicValidation && 
           selectedDate.value !== '' && 
           selectedTime.value !== ''
  }
  
  // Validation supplémentaire pour la livraison à domicile
  if (storeOrderType.value === 'delivery') {
    const deliveryValidation = deliveryAddress.value.rue.trim() !== '' && 
      deliveryAddress.value.npa.trim() !== '' &&
      deliveryAddress.value.localite.trim() !== ''
    

    
    // Si c'est une livraison programmée, vérifier aussi la date et l'heure
    if (deliveryPreference.value === 'ulterieur') {
      return basicValidation && 
             deliveryValidation &&
             selectedDate.value !== '' && 
             selectedTime.value !== ''
    }
    
    return basicValidation && deliveryValidation
  }
  
  return basicValidation
})

// Charger les clients avec recherche
const loadCustomers = async (searchParams?: {
  searchFirstname?: string,
  searchLastname?: string,
  searchEmail?: string,
  searchTel?: string
}) => {
  try {
    const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID)
    
    if (restaurantID) {
      // Construire le paramètre de recherche selon les critères disponibles
      let searchQuery = ''
      if (searchParams?.searchFirstname) {
        searchQuery = searchParams.searchFirstname
      } else if (searchParams?.searchLastname) {
        searchQuery = searchParams.searchLastname
      } else if (searchParams?.searchEmail) {
        searchQuery = searchParams.searchEmail
      } else if (searchParams?.searchTel) {
        searchQuery = searchParams.searchTel
      }

      const response = await getAllCustomers(
        1, 
        50, 
        searchQuery || undefined
      )
  
      if (response.code === 200 && response.data && response.data.data) {
        allCustomers.value = response.data.data
      } else {
        allCustomers.value = []
      }
    } else {
      console.error('❌ RestaurantID non trouvé dans localStorage')
    }
  } catch (error) {
    allCustomers.value = []
  }
}

// Charger les adresses d'un utilisateur
const loadUserAddresses = async (userID: string) => {
  if (!userID) {
    userAddresses.value = []
    return
  }

  isLoadingAddresses.value = true
  try {
    const response = await getUserAddresses(userID)
    if (response.code === 200 && response?.data?.items) {
      userAddresses.value = response.data.items
    } else {
      userAddresses.value = []
    }
  } catch (error) {
    console.error('Erreur lors du chargement des adresses utilisateur:', error)
    userAddresses.value = []
  } finally {
    isLoadingAddresses.value = false
  }
}

// Gérer la sélection d'une adresse
const handleAddressSelection = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const addressId = target.value

  if (!addressId) {
    // Réinitialiser les champs pour une nouvelle adresse
    deliveryAddress.value = {
      rue: '',
      numeroRue: '',
      npa: '',
      localite: ''
    }
    selectedAddressId.value = ''
    selectedPostalCode.value = null
    return
  }

  const address = userAddresses.value.find(addr => addr.id === addressId)
  if (!address) return

  // Remplir les champs avec l'adresse sélectionnée
  deliveryAddress.value = {
    rue: address.rue || address.address || '',
    numeroRue: (address.numeroLocalite === '0' || address.numeroLocalite === null) ? '' : (address.numeroLocalite || address.numeroRue || ''),
    npa: address.codePostal || address.postal_code || '',
    localite: address.localite || address.city || ''
  }
  
  selectedAddressId.value = addressId
  selectedPostalCode.value = null
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

// Rechercher les clients via l'API
const searchCustomers = async () => {
  const firstName = customerInfo.value.firstName.trim()
  const lastName = customerInfo.value.lastName.trim()
  const phone = customerInfo.value.phone.trim()
  const email = customerInfo.value.email.trim()

  if (selectedCustomer.value) {
    customerSuggestions.value = []
    return
  }

  // Vérifier si on a au moins un critère de recherche valide
  const hasValidSearch = (firstName.length >= 2 || lastName.length >= 2 || phone.length >= 3 || email.length >= 3)
  
  if (!hasValidSearch) {
    customerSuggestions.value = []
    return
  }

  try {
    // Préparer les paramètres de recherche - priorité au prénom, puis nom, puis email, puis téléphone
    const searchParams: any = {}
    
    if (firstName.length >= 2) {
      searchParams.searchFirstname = firstName
    } else if (lastName.length >= 2) {
      searchParams.searchLastname = lastName
    } else if (email.length >= 3) {
      searchParams.searchEmail = email
    } else if (phone.length >= 3) {
      searchParams.searchTel = phone.replace(/\D/g, '') // Garder seulement les chiffres
    }

    // Appeler l'API avec les paramètres de recherche
    await loadCustomers(searchParams)
    
    // Limiter les résultats à 5 suggestions
    customerSuggestions.value = allCustomers.value
  } catch (error) {
    console.error('Erreur lors de la recherche de clients:', error)
    customerSuggestions.value = []
  }
}

// Sélectionner un client depuis les suggestions
const selectCustomer = (customer: any) => {
  selectedCustomer.value = customer
  customerInfo.value.id = customer.id
  customerInfo.value.firstName = customer.first_name || customer.firstName || ''
  customerInfo.value.lastName = customer.last_name || customer.lastName || ''
  customerInfo.value.phone = customer.phone_number || customer.phoneNumber || ''
  customerInfo.value.email = customer.email || ''
  customerSuggestions.value = []

  // Utiliser les adresses du client sélectionné (nouveau format: listeAdresses)
  if (customer.listeAdresses && customer.listeAdresses.length > 0) {
    userAddresses.value = customer.listeAdresses
  } else if (customer.user_addresses && customer.user_addresses.length > 0) {
    userAddresses.value = customer.user_addresses
  } else {
    userAddresses.value = []
  }
}

// Supprimer la sélection du client
const clearSelectedCustomer = () => {
  selectedCustomer.value = null
  customerInfo.value = { id: '', firstName: '', lastName: '', phone: '', email: '' }
  customerSuggestions.value = []

        // Vider les adresses et la sélection
      userAddresses.value = []
      selectedAddressId.value = ''
      selectedPostalCode.value = null
      deliveryAddress.value = { rue: '', numeroRue: '', npa: '', localite: '' }
}

// Sélectionner le client par défaut selon le restaurant
const selectDefaultClient = (restaurantID: string) => {
  const defaultClient = DEFAULT_CLIENTS[restaurantID as keyof typeof DEFAULT_CLIENTS]
  
  if (defaultClient) {
    // Créer un objet CustomerModel compatible
    const customerModel: CustomerModel = {
      id: defaultClient.id,
      email: defaultClient.email,
      firstName: defaultClient.firstName,
      lastName: defaultClient.lastName,
      phoneNumber: defaultClient.phoneNumber,
      address: defaultClient.address || '',
      city: defaultClient.city || '',
      codePostal: defaultClient.codePostal || '',
      batiment: defaultClient.batiment || '',
      rue: defaultClient.rue || '',
      user: null as any,
      civilite: defaultClient.civilite,
      npa: defaultClient.npa,
      localite: defaultClient.localite,
      numeroRue: defaultClient.numeroRue,
      remarqueCommande: [null, ''],
      promotions: false,
      newsletter: false,
      created_at: new Date().toISOString()
    }
    
    // Sélectionner le client
    selectCustomer(customerModel)
  }
}



// Fermer les suggestions
const closeSuggestions = () => {
  customerSuggestions.value = []
}

// Fermer les suggestions quand on clique ailleurs
// Watcher pour mettre à jour deliveryPreference quand le restaurant info change
watch(isRestaurantOpen, (newValue) => {
  deliveryPreference.value = newValue ? 'immediat' : 'ulterieur'
}, { immediate: false })

// Watcher pour sélectionner le client par défaut quand on passe en mode "sur place"
watch(storeOrderType, (newOrderType) => {
  if (newOrderType === 'dine_in' && restaurantInfo.value) {
    const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID)
    if (restaurantID && !selectedCustomer.value) {
      selectDefaultClient(restaurantID);
    }
  } else if (newOrderType !== 'dine_in' && selectedCustomer.value) {
    // Vérifier si le client sélectionné est un client par défaut
    const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID)
    if (restaurantID) {
      const defaultClient = DEFAULT_CLIENTS[restaurantID as keyof typeof DEFAULT_CLIENTS]
      if (defaultClient && selectedCustomer.value.id === defaultClient.id) {
        // Désélectionner le client par défaut si on change de type de commande
        clearSelectedCustomer()
      }
    }
  }
}, { immediate: false })

// Watcher pour s'assurer que le client par défaut est sélectionné après le chargement des données
watch([restaurantInfo, () => store.getters['orderType/selectedOrderType']], ([restaurant, orderType]) => {
  if (restaurant && orderType === 'dine_in' && !selectedCustomer.value) {
    const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID)
    if (restaurantID) {
      selectDefaultClient(restaurantID)
    }
  }
}, { immediate: false })

// Watcher pour afficher un message quand les prix du panier changent
watch(storeCart, (newCart, oldCart) => {
  if (oldCart && oldCart.length > 0 && newCart.length > 0) {
    const oldTotal = oldCart.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    const newTotal = newCart.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    
    if (oldTotal !== newTotal) {
      // toast.info(`Prix mis à jour selon le type de commande`)
    }
  }
}, { deep: true })


watch(storeCartTotal, (newSubtotal) => {
  if (discountType.value === 'fixed' && discountFixed.value > newSubtotal) {
    discountFixed.value = newSubtotal
  }
})

const updatePricesForOrderType = (newOrderType: string) => {
  if (storeCart.value.length > 0) {
    
    const updatedCart = storeCart.value.map(item => {
      let basePrice = 0
      if(newOrderType === 'delivery'){
        basePrice = Number(item.selectedSize?.priceLivraison) || 0
      } else {
        basePrice = Number(item.selectedSize?.price) || 0
      }
      
      // Recalculer le prix total
      const ingredientsPrice = (item.ingredients || []).reduce((total: number, ingredient: any) => {
        if (!ingredient.isDefault && ingredient.quantity > 0) {
          return total + (Number(ingredient.extra_cost_price) || 0) * ingredient.quantity
        }
        return total
      }, 0)

      const supplementsPrice = (item.supplements || []).reduce((total, supplement) => {
        const supQuantity = (supplement as any).quantity || 0
        if (supQuantity > 0) {
          return total + (Number(supplement.extra_cost_price) || 0)
        }
        return total
      }, 0)

      const totalPrice = basePrice + ingredientsPrice + supplementsPrice
      
      return {
        ...item,
        totalPrice: totalPrice
      }
    })
    
    store.commit('cart/SET_CART', updatedCart)
  }
}

// Watcher simple pour le type de commande
watch(selectedOrderType, (newOrderType, oldOrderType) => {
  if (newOrderType !== oldOrderType) {
    store.dispatch('orderType/setOrderType', newOrderType)
    updatePricesForOrderType(newOrderType)
  }
}, { immediate: false })

// Watcher pour logger les changements de rabais
watch([discountAmount, couponDiscountAmount, finalTotalWithCoupon], ([newDiscount, newCoupon, newTotal]) => {
 
})

// Watcher pour charger le montant minimum quand le code postal change
watch(() => deliveryAddress.value.npa, (newNpa) => {
  if (storeOrderType.value === 'delivery' && newNpa) {
    loadRestaurantMinOrder()
  }
}, { immediate: false })

// Watcher pour charger le montant minimum quand le type de commande change
watch(storeOrderType, (newOrderType) => {
  if (newOrderType === 'delivery' && deliveryAddress.value.npa) {
    loadRestaurantMinOrder()
  } else if (newOrderType !== 'delivery') {
    restaurantMinOrder.value = 0
  }
}, { immediate: false })

// Clients par défaut selon le restaurant
const DEFAULT_CLIENTS = {
  'fd9d1677-f994-473a-9939-908cf3145bd4': {
    id: '',
    email: 'client07morges@gmail.com',
    firstName: 'Client',
    lastName: 'Morges',
    phoneNumber: '218882300',
    address: 'Morges, 1110 - Place Saint-Louis 5',
    city: 'Morges',
    codePostal: '1110',
    batiment: '5',
    rue: 'Place Saint-Louis',
    civilite: 'monsieur',
    npa: '1110',
    localite: 'Morges',
    numeroRue: '5',
    type: 'customer'
  },
  '515a4836-3e47-47c5-9b87-1cf4feefe247': {
    id: '',
    email: 'client07penthaz@gmail.com',
    firstName: 'Client',
    lastName: 'Penthaz',
    phoneNumber: '218621313',
    address: null,
    city: 'Penthaz',
    codePostal: null,
    batiment: null,
    rue: 'Test',
    civilite: 'monsieur',
    npa: '1303',
    localite: 'Penthaz',
    numeroRue: '12',
    type: 'customer'
  }
}

// Charger les informations du restaurant
const loadRestaurantInfo = async () => {
  try {
    const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID)
    if (restaurantID) {
      const response = await detailRestaurant(restaurantID) as ApiResponse<RestaurantModel>
      if (response.code === 200 && response.data) {
        restaurantInfo.value = response.data
        
        // Sélectionner le client par défaut si on est en mode "sur place"
        if (storeOrderType.value === 'dine_in') {
          selectDefaultClient(restaurantID)
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des informations du restaurant:', error)
  }
}

// Charger les détails du restaurant pour le montant minimum
const loadRestaurantDetails = async () => {
  try {
    const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID)
    if (restaurantID) {
      const response = await getRestaurantDetails(restaurantID)
      if (response.code === 200 && response.data) {
        restaurantDetails.value = response.data;
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des détails du restaurant:', error)
  }
}


// Charger tous les codes postaux
const loadAllPostalCodes = async () => {
  try {
    const response = await getAllPostalCodes()
    
    if (response.code === 200 && response.data) {
      allPostalCodes.value = response.data
      
      
    }
  } catch (error) {
    console.error('Erreur lors du chargement des codes postaux:', error)
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

    // Extraire les features pour ce produit spécifique
    const productFeatures: string[] = []
    
    // Ajouter les ingrédients personnalisés comme features
    const customIngredients = item.ingredients.filter(ing => !ing.isDefault && ing.quantity > 0)
    customIngredients.forEach(ing => {
      productFeatures.push(`${ing.name} (${ing.quantity})`)
    })

    // Ajouter les suppléments comme features
    if (item.supplements && item.supplements.length > 0) {
      item.supplements.forEach(supp => {
        if (supp.quantity > 0) {
          productFeatures.push(`${supp.name}${supp.quantity > 1 ? ` (${supp.quantity})` : ''}`)
        }
      })
    }

    // Extraire les noms des ingrédients retirés
    const removedIngredientNames: string[] = []
    if (item.removedIngredients && item.removedIngredients.length > 0) {
      item.removedIngredients.forEach(removedIng => {
        removedIngredientNames.push(removedIng.name)
      })
    }

    // Calculer le prix total du produit (prix de base + ingrédients + suppléments) * quantité
    const basePrice = Number(item.selectedSize?.price || item.selectedSize?.priceLivraison || 0)
    
    // Calculer le prix des ingrédients personnalisés
    const ingredientsPrice = item.ingredients.reduce((total, ing) => {
      if (!ing.isDefault && ing.quantity > 0) {
        return total + (Number(ing.extra_cost_price) || 0) * ing.quantity
      }
      return total
    }, 0)
    
    // Calculer le prix des suppléments
    const supplementsPrice = item.supplements.reduce((total, supp) => {
      const supQuantity = (supp as any).quantity || 0
      if (supQuantity > 0) {
        return total + (Number(supp.extra_cost_price) || 0) * supQuantity
      }
      return total
    }, 0)
    
    // Prix unitaire du produit (prix de base + ingrédients + suppléments)
    const unitPrice = basePrice + ingredientsPrice + supplementsPrice
    
    // Prix total du produit (prix unitaire * quantité)
    const productPrice = unitPrice * item.quantity

    return {
      product_id: item.productId,
      specification_id: item.selectedSize.id,
      quantity: item.quantity,
      product_price: productPrice, // Prix total du produit (prix unitaire * quantité)
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
      feature: productFeatures, // Tableau de strings pour ce produit
      removedIngredients: removedIngredientNames // Tableau de strings pour ce produit
    }
  })
}

// Extraire toutes les features du panier
const extractFeaturesFromCart = (cart: CartItem[]): string[] => {
  const features: string[] = []

  // Ajouter les features du store Vuex (features globales)
  const storeFeatures = store?.getters?.['features/selectedFeatures'] || []
  features.push(...storeFeatures)

  // Ajouter les features additionnelles de chaque produit
  cart.forEach(item => {
    if (item.additionnal && item.additionnal.length > 0) {
      features.push(...item.additionnal)
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

    if (!customerInfo.value.phone) {
      toast.error('Veuiller remplir tous les champs!')
      return
    }

    // Extraire les features du panier
    const cartFeatures = extractFeaturesFromCart(storeCart.value)

    // ID du client
    const customerID = selectedCustomer.value?.id || customerInfo.value.id;

    // Fonction pour générer un email unique pour les commandes sans email valide
    const generateUniqueEmail = (): string => {
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 8)
      const restaurantSuffix = restaurantID === 'fd9d1677-f994-473a-9939-908cf3145bd4' ? 'morges' : 'penthaz'
      return `guest_${timestamp}_${randomId}@${restaurantSuffix}.dummy.com`
    }

    const renderEmail = (): string => {
      // Priorité 1: Email saisi manuellement (si valide)
      if (customerInfo.value?.email && isValidEmail(customerInfo.value.email)) {
        return customerInfo.value.email
      }
      
      // Priorité 2: Email du client sélectionné (si valide)
      if (selectedCustomer.value?.email && isValidEmail(selectedCustomer.value.email)) {
        return selectedCustomer.value.email
      }
      
      // Priorité 4: Email par défaut du restaurant (si valide)
      /* const defaultEmail = restaurantID === 'fd9d1677-f994-473a-9939-908cf3145bd4' 
        ? 'client07morges@gmail.com' 
        : 'client07penthaz@gmail.com'
      
      if (isValidEmail(defaultEmail)) {
        return defaultEmail
      } */
      
      // Priorité 5: Générer un email unique pour éviter les conflits
      const uniqueEmail = generateUniqueEmail()
      return uniqueEmail
    }

    // Préparer les données de commande selon le format de l'API
    const orderData = {
      coupon: appliedCoupon.value?.code || "",
      couponValue: appliedCoupon.value?.discountAmount?.toString() || "0",
      couponType: appliedCoupon.value?.type || "",
      codePostal: storeOrderType.value === 'delivery' 
        ? `${deliveryAddress.value.npa}`.trim()
        : restaurantInfo.value.codePostalID?.numeroPostal,
      deliveryLocality: storeOrderType.value === 'delivery' 
        ? ` ${deliveryAddress.value.localite}`.trim()
        : restaurantInfo.value.codePostalID?.ville,
      restaurantID: restaurantID,
      paniers: transformCartForAPI(storeCart.value), // Cette fonction inclut maintenant feature et removedIngredients pour chaque produit
      userID: selectedCustomer.value?.user?.id || "", // ID utilisateur si client sélectionné
      civilite: selectedCustomer.value?.civilite || "monsieur",
      guest_first_name: customerInfo.value.firstName,
      guest_last_name: customerInfo.value.lastName,
      guest_email: renderEmail(),
      guest_phone_number: selectedCustomer?.value?.phone_number || selectedCustomer?.value?.phoneNumber || customerInfo.value.phone,
      order_type: storeOrderType.value, // Utiliser le type depuis le store
      numberRue: storeOrderType.value === 'delivery' ? deliveryAddress.value.numeroRue : restaurantInfo.value.numeroRue || "",
      deliveryPreference: deliveryPreference.value,
      typeCustomer: clientType.value,
      SpecialInstructions: "",
      timeOrder: deliveryPreference.value === 'ulterieur' && selectedDate.value && selectedTime.value
        ? formatDateForPayload(selectedDate.value, selectedTime.value)
        : "",
      payment_method: selectedPaymentMethod.value,
      addressLivraison: storeOrderType.value === 'delivery' 
        ? `${deliveryAddress.value.rue} ${deliveryAddress.value.numeroRue}`.trim()
        : `${restaurantInfo.value.address}`,
      batiment: restaurantInfo.value.batiment || "",
      rue: storeOrderType.value === 'delivery' ? deliveryAddress.value.rue : restaurantInfo.value.address || "",
      npa: storeOrderType.value === 'delivery' ? deliveryAddress.value.npa : restaurantInfo.value.codePostalID?.numeroPostal || "",
      localite: storeOrderType.value === 'delivery' ? deliveryAddress.value.localite : restaurantInfo.value.codePostalID?.ville || "",
      societe: organisationInfo.value.societe || "",
      departement: organisationInfo.value.departement || "",
      newsletter: "0",
      discount: discountType.value === 'percentage'
        ? (discountPercentage.value > 0 ? discountPercentage.value.toString() : "0")
        : "0",
      discountFixed: discountType.value === 'fixed'
        ? (discountFixed.value > 0 ? discountFixed.value.toString() : "0")
        : "0",
      discountType: discountType.value,
      discountValue: discountType.value === 'percentage' ? String(discountPercentage.value) : String(discountFixed.value),
      discountAmount: discountAmount.value > 0 ? discountAmount.value.toString() : "0",
      divers: diversAmount.value > 0 ? diversAmount.value.toString() : "0",
      tvaAmount: formatPrice(storeCartTotal.value * 2.6 / 100) || "0",
      intructionOrder: [
        {
          demandeCouverts: false,
          quantityCouverts: "0",
          delaiRecuperation: "00:00",
          isTrancher: false,
          cuisson: "Normal",
        },
      ],
      additional_fees: [
        {
          type: storeOrderType.value,
          amount: minOrderSupplement.value
        }
      ],
      subtotal: storeCartTotal.value,
      total: finalTotalWithCoupon.value,
    }
    
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

      // Réinitialiser les préférences de livraison
      deliveryPreference.value = isRestaurantOpen.value ? 'immediat' : 'ulterieur'
      selectedDate.value = ''
      selectedTime.value = ''

      // Réinitialiser le rabais
      discountType.value = 'percentage'
      discountPercentage.value = 0
      discountFixed.value = 0

      // Réinitialiser le champ divers
      diversAmount.value = 0

      // Réinitialiser le coupon
      appliedCoupon.value = null
      couponCode.value = ''

      // Réinitialiser l'adresse de livraison
      deliveryAddress.value = { rue: '', numeroRue: '', npa: '', localite: '' }

      // Émettre l'événement de succès
      emit('place-order', { success: true, orderData: response.data })
    } else {
      toast.error(response.message || 'Erreur lors de la création de la commande')
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erreur lors de la création de la commande'
    toast.error(errorMessage)
  } finally {
    isProcessingOrder.value = false
  }
}

// Gestionnaires d'événements
const decreaseQuantity = (itemId: string) => {
  const item = storeCart.value.find(item => item.localProductId === itemId)
  if (item) {
    emit('update-quantity', itemId, item.quantity - 1)
  }
}

const increaseQuantity = (itemId: string) => {
  const item = storeCart.value.find(item => item.localProductId === itemId)
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

// Gestionnaire pour le changement de type de rabais
const handleDiscountTypeChange = () => {
  // Réinitialiser les valeurs lors du changement de type
  if (discountType.value === 'percentage') {
    discountFixed.value = 0
  } else {
    discountPercentage.value = 0
  }
}

// Gestionnaire pour le changement de rabais en pourcentage
const handleDiscountChange = () => {
  // S'assurer que la valeur est dans les limites
  if (discountPercentage.value < 0) {
    discountPercentage.value = 0
  } else if (discountPercentage.value > 100) {
    discountPercentage.value = 100
  }
  
}

// Gestionnaire pour le changement de rabais fixe
const handleFixedDiscountChange = () => {
  // S'assurer que la valeur n'est pas négative
  if (discountFixed.value < 0) {
    discountFixed.value = 0
  }
  
  // S'assurer que le rabais fixe ne dépasse pas le sous-total
  if (discountFixed.value > storeCartTotal.value) {
    discountFixed.value = storeCartTotal.value
  }
  
}

// Gestionnaire pour le changement de montant divers
const handleDiversChange = () => {
  // S'assurer que la valeur n'est pas négative
  if (diversAmount.value < 0) {
    diversAmount.value = 0
  }
}

// Fonction pour appliquer un coupon
const applyCouponCode = async () => {
  if (appliedCoupon.value) {
    toast.info('Un coupon est déjà appliqué')
    return
  }

  if (!couponCode.value.trim()) {
    toast.error('Veuillez entrer un code promo')
    return
  }

  isApplyingCoupon.value = true
  try {
    const response = await applyCoupon({
      coupon: couponCode.value.trim(),
      email: selectedCustomer.value?.email || customerInfo.value.email || '',
      amount: String(storeCartTotal.value)
    })

    if (response.code === 200) {
      const couponData = {
        ...response.data,
        code: couponCode.value.trim(),
        discountAmount: parseFloat(response.data.value) || 0
      }
      appliedCoupon.value = couponData
      couponCode.value = ''
      toast.success(response.message || 'Coupon appliqué avec succès')
    } else {
      toast.error(response.message || 'Code promo invalide')
    }
  } catch (error) {
    toast.error('Code promo invalide')
  } finally {
    isApplyingCoupon.value = false
  }
}

// Fonction pour supprimer un coupon
const removeCoupon = () => {
  appliedCoupon.value = null
  couponCode.value = ''
  toast.info('Coupon supprimé')
}

// Fonction pour rechercher des codes postaux
const searchPostalCodes = (query: string) => {
  
  if (!query.trim() || query.length < 2) {
    postalCodeSuggestions.value = []
    showPostalCodeSuggestions.value = false
    return
  }

  const results = allPostalCodes.value.filter(postalCode => {
    // Protection contre les propriétés undefined
    if (!postalCode) return false
    
    // Adapter selon la structure des données du nouvel endpoint
    // Convertir en chaîne de caractères pour éviter les erreurs
    const postalCodeStr = String(postalCode.code || postalCode.numeroPostal || postalCode.postal_code || '')
    const cityStr = String(postalCode.locality || postalCode.ville || postalCode.city || postalCode.localite || '')
    
    const matches = postalCodeStr.includes(query) || 
           cityStr.toLowerCase().includes(query.toLowerCase())
  
    
    return matches
  }).slice(0, 10) 
  postalCodeSuggestions.value = results
  showPostalCodeSuggestions.value = results.length > 0
}

// Fonction pour sélectionner un code postal
const selectPostalCode = (postalCode: any) => {
  selectedPostalCode.value = postalCode
  
  // Adapter selon la structure des données du nouvel endpoint
  // Convertir en chaîne de caractères pour éviter les erreurs
  const postalCodeStr = String(postalCode.code || postalCode.numeroPostal || postalCode.postal_code || '')
  const cityStr = String(postalCode.locality || postalCode.ville || postalCode.city || postalCode.localite || '')
  
  deliveryAddress.value.npa = postalCodeStr
  deliveryAddress.value.localite = cityStr
  showPostalCodeSuggestions.value = false
  postalCodeSuggestions.value = []
  
  // Charger le montant minimum de commande pour ce code postal
  if (storeOrderType.value === 'delivery') {
    loadRestaurantMinOrder()
  }
}

// Fonction pour gérer le changement du code postal
const handlePostalCodeChange = () => {
  // Réinitialiser la sélection si l'utilisateur modifie manuellement
  if (selectedPostalCode.value) {
    const postalCodeStr = String(selectedPostalCode.value.code || selectedPostalCode.value.numeroPostal || selectedPostalCode.value.postal_code || '')
    if (deliveryAddress.value.npa !== postalCodeStr) {
      selectedPostalCode.value = null
    }
  }
  
  // Rechercher des suggestions
  searchPostalCodes(deliveryAddress.value.npa)
}

// Gestionnaire pour le changement de date
const handleDateChange = () => {
  // Si une heure est sélectionnée, vérifier qu'elle est toujours valide
  if (selectedTime.value) {
    const availableTimes = getAvailableTimes.value;
    if (!availableTimes.includes(selectedTime.value)) {
      // L'heure sélectionnée n'est plus disponible, la réinitialiser
      selectedTime.value = '';
    }
  }
}

watch(storeOrderType, (newOrderType, oldOrderType) => {
  if (newOrderType !== oldOrderType) {
    storeCart.value.forEach((item, index) => {
     // console.log("order Type refresh")
    })
    
    // Forcer le recalcul de tous les prix du panier
    store.dispatch('cart/recalculateAllPrices')
  }
}, { immediate: false })


const cartItemsWithCorrectPrices = computed(() => {
  const orderType = storeOrderType.value  // Utiliser le computed réactif du store
  const isDelivery = orderType === 'delivery'
  if (!storeCart.value || storeCart.value.length === 0) {
    return []
  }

  return storeCart.value.map(item => {
    if (!item || !item.selectedSize) {
      return item
    }
    
    let basePrice = 0
    
    const originalPrice = item.selectedSize?.price || 0
    const originalPriceLivraison = item.selectedSize?.priceLivraison || 0
    
    if (isDelivery && originalPriceLivraison) {
      basePrice = Number(originalPriceLivraison) || 0
    } else {
      basePrice = Number(originalPrice) || 0
    }
    
    // Calculer le prix total avec les ingrédients et suppléments
    const ingredientsPrice = (item.ingredients || []).reduce((total: number, ingredient: any) => {
      if (!ingredient.isDefault && ingredient.quantity > 0) {
        return total + (Number(ingredient.extra_cost_price) || 0) * ingredient.quantity
      }
      return total
    }, 0)

    const supplementsPrice = (item.supplements || []).reduce((total, supplement) => {
      const supQuantity = (supplement as any).quantity || 0
      if (supQuantity > 0) {
        return total + (Number(supplement.extra_cost_price) || 0)
      }
      return total
    }, 0)

    const totalPrice = basePrice + ingredientsPrice + supplementsPrice
    const calculatedTotalPrice = totalPrice * item.quantity

    // Retourner l'item avec les prix calculés
    return {
      ...item,
      totalPrice: totalPrice,
      calculatedPrice: totalPrice,
      calculatedTotalPrice: calculatedTotalPrice
    }
  })
})



const validCartItems = computed(() => {
  return cartItemsWithCorrectPrices.value.filter(item => item && item.localProductId)
})




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

      &:disabled {
        background-color: #f8fafc;
        color: #64748b;
        cursor: not-allowed;
        opacity: 0.7;
      }

      &.invalid-email {
        border-color: #dc2626;
        box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
      }
    }

    .email-error {
      font-size: 11px;
      color: #dc2626;
      margin-top: 4px;
      font-weight: 500;
    }

    .postal-code-input-container {
      position: relative;

      .postal-code-suggestions {
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
        margin-top: 2px;

        .postal-code-suggestion {
          padding: 10px 12px;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;

          &:hover {
            background: #f8fafc;
          }

          &:last-child {
            border-bottom: none;
          }

          .postal-code-number {
            font-weight: 600;
            color: #1e293b;
            font-size: 14px;
          }

          .postal-code-city {
            color: #64748b;
            font-size: 12px;
          }
        }
      }
    }

    &.client-selected {
      border: 1px solid #388D35;
      box-shadow: 0 0 0 2px rgba(56, 141, 53, 0.1);
    }

    .phone-input-container {
      display: flex;
      align-items: center;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: white;
      transition: border-color 0.2s ease;

      &:focus-within {
        border-color: #388D35;
        box-shadow: 0 0 0 2px rgba(56, 141, 53, 0.1);
      }

      &:has(.client-selected) {
        border-color: #388D35;
        box-shadow: 0 0 0 2px rgba(56, 141, 53, 0.1);
      }

      .country-prefix {
        padding: 8px 12px 8px 12px;
        background: #f8fafc;
        border-right: 1px solid #e2e8f0;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        border-radius: 6px 0 0 6px;
        white-space: nowrap;
      }

      .phone-input {
        border: none;
        border-radius: 0 6px 6px 0;
        flex: 1;
        
        &:focus {
          border: none;
          box-shadow: none;
        }
      }
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

            &.removed-ingredient {
              background: #fef2f2;
              color: #dc2626;
            }
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

      &.discount-value {
        color: #dc2626;
      }

      &.supplement-value {
        color: #f59e0b;
      }

      &.divers-value {
        color: #8b5cf6;
      }
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

.coupon-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;

  .coupon-title {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1rem 0;
  }

  .min-order-info {
    margin-bottom: 1rem;
    padding: 10px 12px;
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 6px;

    .min-order-message {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #92400e;

      .min-order-icon {
        font-size: 14px;
      }

      .min-order-text {
        flex: 1;

        strong {
          font-weight: 600;
        }

        .min-order-warning {
          color: #dc2626;
          font-weight: 500;
        }
      }
    }
  }

  .min-order-controls {
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;

    .btn-disable-min-order {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #fee2e2;
      border: 1px solid #fca5a5;
      border-radius: 6px;
      color: #dc2626;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #fecaca;
        border-color: #f87171;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }

      .btn-icon {
        font-size: 14px;
      }

      .btn-text {
        white-space: nowrap;
      }
    }

    .btn-enable-min-order {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #dcfce7;
      border: 1px solid #86efac;
      border-radius: 6px;
      color: #166534;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #bbf7d0;
        border-color: #4ade80;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }

      .btn-icon {
        font-size: 14px;
      }

      .btn-text {
        white-space: nowrap;
      }
    }
  }

  .applied-coupon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 1rem;

    .coupon-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .coupon-code {
        font-size: 14px;
        font-weight: 600;
        color: #388D35;
      }

      .coupon-discount {
        font-size: 12px;
        color: #388D35;
        font-weight: 500;
      }
    }

    .remove-coupon-btn {
      background: #dc2626;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 12px;
      padding: 6px 10px;
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

  .coupon-form {
    .coupon-input-group {
      display: flex;
      gap: 8px;
    }

    .coupon-input {
      flex: 1;
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

      &:disabled {
        background-color: #f8fafc;
        color: #64748b;
        cursor: not-allowed;
        opacity: 0.7;
      }
    }

    .apply-coupon-btn {
      background: #388D35;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 12px;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-weight: 500;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;

      &:hover:not(:disabled) {
        background: #2f7d32;
        transform: translateY(-1px);
      }

      &:disabled {
        background: #94a3b8;
        cursor: not-allowed;
        transform: none;
      }

      i {
        font-size: 10px;
      }
    }
  }
}

.discount-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;

  .form-group {
    margin-bottom: 1rem;

    &:last-child {
    margin-bottom: 0;
    }
  }

  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
  }

  .discount-type-selector {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;
  }

  .discount-type-option {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #374151;

    input[type="radio"] {
      accent-color: #388D35;
      margin: 0;
    }

    span {
      font-weight: 500;
    }

    &:hover {
      color: #388D35;
    }
  }

  .discount-input-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .discount-input {
    flex: 1;
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

  .discount-symbol {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    min-width: 20px;
  }
}

.divers-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;

  .form-group {
    margin-bottom: 0;
  }

  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
  }

  .discount-input-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .discount-input {
    flex: 1;
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

  .discount-symbol {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    min-width: 20px;
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

// Styles pour les options de livraison
.delivery-preference-section {
  margin-bottom: 1rem;

  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
  }

  .delivery-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 1rem;
  }

  .delivery-option {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #388D35;
      background: #f8fafc;
    }

    input[type="radio"] {
      margin-top: 2px;
      accent-color: #388D35;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .delivery-option-label {
      display: flex;
      flex-direction: column;
      gap: 2px;
      cursor: pointer;
      flex: 1;

      .delivery-option-title {
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
      }

      .delivery-option-subtitle {
        font-size: 12px;
        color: #64748b;
      }
    }

    &:has(input:checked) {
      border-color: #388D35;
      background: #f0fdf4;
      
      .delivery-option-title {
        color: #388D35;
      }
    }

    &:has(input:disabled) {
      opacity: 0.6;
      cursor: not-allowed;
      
      &:hover {
        border-color: #e2e8f0;
        background: white;
      }
      
      .delivery-option-label {
        cursor: not-allowed;
      }
    }
  }

  .scheduled-delivery {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;

    .form-group {
      margin-bottom: 1rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .time-info {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 4px;

      .time-info-text {
        font-size: 0.75rem;
        color: #92400e;
        font-weight: 500;
      }
    }
  }

  .delivery-address-section {
    margin-top: 1rem;
    padding: 1rem;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;

    .delivery-address-title {
      font-size: 14px;
      font-weight: 600;
      color: #388D35;
      margin: 0 0 1rem 0;
    }

    .form-group {
      margin-bottom: 1rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>