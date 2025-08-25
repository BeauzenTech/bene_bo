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
          <div class="phone-input-container">
            <span class="country-prefix">+41</span>
            <input v-model="customerInfo.phone" type="tel" placeholder="Numéro de téléphone"
              :class="['form-input', 'phone-input', { 'client-selected': selectedCustomer }]" @input="handleCustomerSearch" />
          </div>
        </div>
        <div class="form-group">
          <label>Type de commande</label>
          <select v-model="storeOrderType" class="form-select">
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
              <div v-if="selectedDate === getGMT2Date().toISOString().split('T')[0] && getAvailableTimes.length === 0"
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
                {{ address.rue }} {{ address.numeroLocalite }}, {{ address.localite }}
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
                  :key="postalCode.id" 
                  class="postal-code-suggestion"
                  @click="selectPostalCode(postalCode)"
                >
                  <span class="postal-code-number">{{ postalCode.numeroPostal }}</span>
                  <span class="postal-code-city">{{ postalCode.ville }}</span>
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
          <span class="item-count">{{ storeCart.length }} article(s)</span>
        </div>

        <div class="cart-items">
          <div v-for="item in storeCart" :key="item.localProductId" class="cart-item">
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
          <div v-if="storeCart.length === 0" class="empty-cart">
            <div class="empty-icon">
              🛒
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
                Montant minimum de commande : <strong>{{ formatPrice(restaurantMinOrder) }} CHF</strong>
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


        <div class="summary-lines">
          <div class="summary-row">
            <span class="label">Sous-total</span>
            <span class="value">{{ formatPrice(orderSummaryWithDiscount.subtotal) }} CHF</span>
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

          <div class="summary-row">
            <span class="label">TVA ({{ taxRate }}%)</span>
            <span class="value">{{ formatPrice(orderSummaryWithDiscount.tax) }} CHF</span>
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
import { createPOSOrder, detailRestaurant, getUserAddresses, applyCoupon, getRestaurantDetails, getAllPostalCodes } from '@/service/api'
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

// État pour les coupons
const couponCode = ref<string>('')
const appliedCoupon = ref<any>(null)
const isApplyingCoupon = ref<boolean>(false)

// État pour le montant minimum de commande
const restaurantMinOrder = ref<number>(0)
const restaurantDetails = ref<any>(null)

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

// Fonctions utilitaires pour la gestion des dates et horaires
const getGMT2Date = (date?: Date) => {
  const now = date || new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000; // UTC en millisecondes
  return new Date(utc + 2 * 3600000); // GMT+2 en millisecondes (2 heures = 2 * 3600000 ms)
};

// Utilitaires pour la gestion des horaires
const getCurrentTime = () => {
  // Utiliser GMT+2 (UTC+2)
  const gmt2 = getGMT2Date();
  return gmt2.getHours() * 60 + gmt2.getMinutes(); // Minutes depuis minuit en GMT+2
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
      if (selectedDateValue === getGMT2Date().toISOString().split("T")[0]) {
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
  // Utiliser GMT+2 (UTC+2) pour déterminer les dates
  const today = getGMT2Date();
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
  return (props.orderSummary.subtotal * discountPercentage.value) / 100
  } else {
    if (discountFixed.value <= 0) return 0
    // Le rabais fixe ne peut pas dépasser le sous-total
    return Math.min(discountFixed.value, props.orderSummary.subtotal)
  }
})

// Computed pour le total avec coupon
const couponDiscountAmount = computed(() => {
  if (!appliedCoupon.value) return 0
  const amount = appliedCoupon.value.discountAmount || 0
  console.log('Calcul du coupon:', amount)
  return amount
})

// Computed pour le supplément de montant minimum (livraison uniquement)
const minOrderSupplement = computed(() => {
  if (storeOrderType.value !== 'delivery') return 0
  
  const subtotalAfterDiscount = props.orderSummary.subtotal - discountAmount.value
  const totalAfterCoupon = subtotalAfterDiscount - couponDiscountAmount.value
  const remainingAmount = Math.max(0, restaurantMinOrder.value - totalAfterCoupon)
  
  console.log('Calcul du supplément minimum:', {
    restaurantMinOrder: restaurantMinOrder.value,
    subtotalAfterDiscount,
    totalAfterCoupon,
    remainingAmount
  })
  
  return remainingAmount
})

// Computed pour le total final avec rabais, coupon et supplément minimum
const finalTotalWithCoupon = computed(() => {
  const subtotalAfterDiscount = props.orderSummary.subtotal - discountAmount.value
  const totalAfterCoupon = subtotalAfterDiscount - couponDiscountAmount.value
  const totalWithSupplement = totalAfterCoupon + minOrderSupplement.value
  const finalTotal = Math.max(0, totalWithSupplement) // Ne peut pas être négatif
  
  console.log('Calcul du total final:', {
    subtotal: props.orderSummary.subtotal,
    discountAmount: discountAmount.value,
    couponAmount: couponDiscountAmount.value,
    subtotalAfterDiscount,
    totalAfterCoupon,
    minOrderSupplement: minOrderSupplement.value,
    totalWithSupplement,
    finalTotal
  })
  
  return finalTotal
})

// Computed pour le résumé avec rabais appliqué
const orderSummaryWithDiscount = computed(() => {
  const subtotalWithDiscount = props.orderSummary.subtotal - discountAmount.value
  const taxOnDiscountedSubtotal = (subtotalWithDiscount * taxRate.value) / 100 // TVA (affichage informatif uniquement)
  const totalWithDiscount = subtotalWithDiscount // Le total ne comprend pas la TVA
  
  return {
    subtotal: props.orderSummary.subtotal,
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
      deliveryAddress.value.numeroRue.trim() !== '' &&
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

// Charger tous les clients du restaurant
const loadCustomers = async () => {
  try {
    const restaurantID = localStorage.getItem(UserGeneralKey.USER_RESTAURANT_ID)
    if (restaurantID) {
      const response = await getCustomers(1, restaurantID)
      if (response.code === 200 && response.data?.items) {
        allCustomers.value = response.data.items
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error)
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
      console.log(`✅ ${userAddresses.value.length} adresses chargées pour l'utilisateur`)
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
    rue: address.rue || '',
    numeroRue: address.numeroLocalite || '',
    npa: address.codePostal || '',
    localite: address.localite || ''
  }
  
  selectedAddressId.value = addressId
  selectedPostalCode.value = null
  console.log('Adresse sélectionnée:', address)
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

  // Charger les adresses de l'utilisateur sélectionné
  if (customer.user?.id) {
    loadUserAddresses(customer.user.id)
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
    console.log('Client par défaut sélectionné:', customerModel.firstName, customerModel.lastName, customerModel.id)
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
      console.log(`💰 Prix du panier mis à jour: ${oldTotal} → ${newTotal} CHF`)
      // toast.info(`Prix mis à jour selon le type de commande`)
    }
  }
}, { deep: true })

onMounted(() => {
  loadRestaurantInfo()
  loadRestaurantDetails()
  loadAllPostalCodes()
  loadCustomers()
  
  // Charger le type de commande depuis le store
  store.dispatch('orderType/loadFromStorage')

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
        console.log('Restaurant info loaded:', restaurantInfo.value)
        
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
        restaurantDetails.value = response.data
        restaurantMinOrder.value = parseFloat(response.data.codePostalID?.minimumCommandeAmount || '0')
        console.log('Restaurant details loaded:', response.data)
        console.log('Montant minimum de commande:', restaurantMinOrder.value)
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
      console.log(`${allPostalCodes.value.length} codes postaux chargés`)
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
    const cartFeatures = extractFeaturesFromCart(storeCart.value)

    // ID du client
    const customerID = selectedCustomer.value?.id || customerInfo.value.id;
    console.log('Customer ID:', customerID)

    // Préparer les données de commande selon le format de l'API
    const orderData = {
      coupon: appliedCoupon.value?.code || "",
      couponValue: appliedCoupon.value?.discountAmount?.toString() || "0",
      couponType: appliedCoupon.value?.type || "",
      codePostal: restaurantInfo.value.codePostalID?.numeroPostal || "",
      deliveryLocality: restaurantInfo.value.codePostalID?.ville || "",
      restaurantID: restaurantID,
      paniers: transformCartForAPI(storeCart.value),
      userID: selectedCustomer.value?.user?.id || "", // ID utilisateur si client sélectionné
      guest_first_name: customerInfo.value.firstName,
      civilite: selectedCustomer.value?.civilite || "monsieur",
      guest_last_name: customerInfo.value.lastName,
      guest_email: selectedCustomer.value?.email || restaurantID === 'fd9d1677-f994-473a-9939-908cf3145bd4' ? 'client07morges@gmail.com' : 'client07penthaz@gmail.com',
      guest_phone_number: customerInfo.value.phone,
      feature: cartFeatures, // L'API attend un array, pas un string
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
        ? `${deliveryAddress.value.rue} ${deliveryAddress.value.numeroRue}, ${deliveryAddress.value.localite}`.trim()
        : `${restaurantInfo.value.address} ${restaurantInfo.value.numeroRue}`.trim(),
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
    console.log("Supplements:", storeCart.value.map(item => item.supplements))
    console.log("Coupon dans le payload:", {
      coupon: orderData.coupon,
      couponValue: orderData.couponValue,
      couponType: orderData.couponType
    })

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
    console.error('Erreur lors de la création de la commande:', error)
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
      amount: String(props.orderSummary.subtotal)
    })

    if (response.code === 200) {
      const couponData = {
        ...response.data,
        code: couponCode.value.trim(),
        discountAmount: parseFloat(response.data.value) || 0
      }
      appliedCoupon.value = couponData
      couponCode.value = ''
      console.log('Coupon appliqué:', couponData)
      console.log('Montant du coupon:', couponData.discountAmount)
      toast.success(response.message || 'Coupon appliqué avec succès')
    } else {
      toast.error(response.message || 'Code promo invalide')
    }
  } catch (error) {
    console.error('Erreur lors de l\'application du coupon:', error)
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

  const results = allPostalCodes.value.filter(postalCode => 
    postalCode.numeroPostal.includes(query) || 
    postalCode.ville.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10) // Limiter à 10 résultats

  postalCodeSuggestions.value = results
  showPostalCodeSuggestions.value = results.length > 0
}

// Fonction pour sélectionner un code postal
const selectPostalCode = (postalCode: any) => {
  selectedPostalCode.value = postalCode
  deliveryAddress.value.npa = postalCode.numeroPostal
  deliveryAddress.value.localite = postalCode.ville
  showPostalCodeSuggestions.value = false
  postalCodeSuggestions.value = []
  
  console.log('Code postal sélectionné:', postalCode)
}

// Fonction pour gérer le changement du code postal
const handlePostalCodeChange = () => {
  // Réinitialiser la sélection si l'utilisateur modifie manuellement
  if (selectedPostalCode.value && deliveryAddress.value.npa !== selectedPostalCode.value.numeroPostal) {
    selectedPostalCode.value = null
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