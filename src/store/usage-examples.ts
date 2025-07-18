// Exemples d'utilisation des stores Vuex dans les composants Vue

// ===========================================
// EXEMPLE 1: Utilisation du cart store
// ===========================================

/*
Dans un composant Vue, voici comment utiliser le store cart:

<template>
  <div>
    <h2>Panier ({{ cartCount }} articles)</h2>
    <div v-for="item in cart" :key="item.localProductId">
      <p>{{ item.name }} - {{ item.quantity }}x {{ item.totalPrice }}€</p>
      <button @click="incrementQuantity(item.localProductId)">+</button>
      <button @click="decrementQuantity(item.localProductId)">-</button>
      <button @click="removeFromCart(item)">Supprimer</button>
    </div>
    <p>Total: {{ cartTotal }}€</p>
    <button @click="clearCart">Vider le panier</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// Getters réactifs
const cart = computed(() => store.getters['cart/cart'])
const cartCount = computed(() => store.getters['cart/cartCount'])
const cartTotal = computed(() => store.getters['cart/cartTotal'])
const isEmpty = computed(() => store.getters['cart/isEmpty'])

// Actions
const addToCart = (item: any, typeOfDelivery = 'click_collect') => {
  store.dispatch('cart/addToCart', { item, typeOfDelivery })
}

const removeFromCart = (item: any) => {
  store.dispatch('cart/removeFromCart', item)
}

const clearCart = () => {
  store.dispatch('cart/clearCart')
}

const incrementQuantity = (itemId: string) => {
  store.dispatch('cart/incrementQuantity', itemId)
}

const decrementQuantity = (itemId: string) => {
  store.dispatch('cart/decrementQuantity', itemId)
}

// Gestion des ingrédients
const addIngredient = (itemId: string, ingredient: any) => {
  store.dispatch('cart/addIngredient', { itemId, ingredient })
}

const removeIngredient = (itemId: string, ingredient: any) => {
  store.dispatch('cart/removeIngredient', { itemId, ingredient })
}

// Gestion des suppléments
const addSupplement = (itemId: string, supplement: any) => {
  store.dispatch('cart/addSupplement', { itemId, supplement })
}

const removeSupplement = (itemId: string, supplement: any) => {
  store.dispatch('cart/removeSupplement', { itemId, supplement })
}
</script>
*/

// ===========================================
// EXEMPLE 2: Utilisation du features store
// ===========================================

/*
<template>
  <div>
    <h2>Fonctionnalités sélectionnées</h2>
    <div v-for="feature in availableFeatures" :key="feature">
      <label>
        <input 
          type="checkbox" 
          :checked="isFeatureSelected(feature)"
          @change="toggleFeature(feature)"
        />
        {{ feature }}
      </label>
    </div>
    <button @click="clearFeatures">Tout désélectionner</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const availableFeatures = ref(['wifi', 'parking', 'terrasse', 'climatisation'])

// Getters réactifs
const selectedFeatures = computed(() => store.getters['features/selectedFeatures'])

// Fonction pour vérifier si une fonctionnalité est sélectionnée
const isFeatureSelected = (feature: string) => {
  return store.getters['features/isFeatureSelected'](feature)
}

// Actions
const toggleFeature = (feature: string) => {
  store.dispatch('features/toggleFeature', feature)
}

const clearFeatures = () => {
  store.dispatch('features/clearFeatures')
}

const setSelectedFeatures = (features: string[]) => {
  store.dispatch('features/setSelectedFeatures', features)
}
</script>
*/

// ===========================================
// EXEMPLE 3: Utilisation du specialized-modals store
// ===========================================

/*
<template>
  <div>
    <!-- Modal des salades -->
    <div v-if="isSaladModalOpen" class="modal">
      <h3>Personnaliser la salade</h3>
      <p>Produit: {{ saladProduct?.name }}</p>
      <p>Taille: {{ saladSelectedSize?.name }}</p>
      <button @click="closeSaladModal">Fermer</button>
    </div>
    
    <!-- Modal des pâtes -->
    <div v-if="isPastaModalOpen" class="modal">
      <h3>Personnaliser les pâtes</h3>
      <p>Produit: {{ pastaProduct?.name }}</p>
      <p>Taille: {{ pastaSelectedSize?.name }}</p>
      <button @click="closePastaModal">Fermer</button>
    </div>
    
    <!-- Boutons pour ouvrir les modales -->
    <button @click="openSaladModalExample">Ouvrir modal salade</button>
    <button @click="openPastaModalExample">Ouvrir modal pâtes</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// Getters réactifs pour les salades
const isSaladModalOpen = computed(() => store.getters['specializedModals/isSaladModalOpen'])
const saladProduct = computed(() => store.getters['specializedModals/saladProduct'])
const saladSelectedSize = computed(() => store.getters['specializedModals/saladSelectedSize'])

// Getters réactifs pour les pâtes
const isPastaModalOpen = computed(() => store.getters['specializedModals/isPastaModalOpen'])
const pastaProduct = computed(() => store.getters['specializedModals/pastaProduct'])
const pastaSelectedSize = computed(() => store.getters['specializedModals/pastaSelectedSize'])

// Actions pour les salades
const openSaladModal = (product: any, selectedSize: any) => {
  store.dispatch('specializedModals/openSaladModal', { product, selectedSize })
}

const closeSaladModal = () => {
  store.dispatch('specializedModals/closeSaladModal')
}

// Actions pour les pâtes
const openPastaModal = (product: any, selectedSize: any) => {
  store.dispatch('specializedModals/openPastaModal', { product, selectedSize })
}

const closePastaModal = () => {
  store.dispatch('specializedModals/closePastaModal')
}

// Exemples d'ouverture de modales
const openSaladModalExample = () => {
  const exampleProduct = { id: '1', name: 'Salade César', Ingredients: [], supplements: [] }
  const exampleSize = { id: 's1', name: 'Grande', price: '12.50', priceLivraison: '14.50' }
  openSaladModal(exampleProduct, exampleSize)
}

const openPastaModalExample = () => {
  const exampleProduct = { id: '2', name: 'Pâtes Carbonara', Ingredients: [], supplements: [] }
  const exampleSize = { id: 's2', name: 'Moyenne', price: '11.00', priceLivraison: '13.00' }
  openPastaModal(exampleProduct, exampleSize)
}
</script>
*/

// ===========================================
// EXEMPLE 4: Utilisation du additional-features-modal store
// ===========================================

/*
<template>
  <div>
    <div v-if="isOpen" class="modal">
      <h3>Fonctionnalités supplémentaires</h3>
      <p>Produit: {{ product?.name }}</p>
      <p>Taille sélectionnée: {{ product?.selectedSize?.name }}</p>
      <button @click="closeModal">Fermer</button>
    </div>
    
    <button @click="openModalExample">Ouvrir modal fonctionnalités</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// Getters réactifs
const isOpen = computed(() => store.getters['additionalFeaturesModal/isOpen'])
const product = computed(() => store.getters['additionalFeaturesModal/product'])

// Actions
const openModal = (product: any, selectedSize: any) => {
  store.dispatch('additionalFeaturesModal/openModal', { product, selectedSize })
}

const closeModal = () => {
  store.dispatch('additionalFeaturesModal/closeModal')
}

const setProduct = (product: any) => {
  store.dispatch('additionalFeaturesModal/setProduct', product)
}

const setIsOpen = (isOpen: boolean) => {
  store.dispatch('additionalFeaturesModal/setIsOpen', isOpen)
}

// Exemple d'ouverture de modal
const openModalExample = () => {
  const exampleProduct = { id: '3', name: 'Pizza Margherita', Ingredients: [], supplements: [] }
  const exampleSize = { id: 's3', name: 'Familiale', price: '18.50', priceLivraison: '20.50' }
  openModal(exampleProduct, exampleSize)
}
</script>
*/

// ===========================================
// EXEMPLE 5: Configuration du store dans main.ts
// ===========================================

/*
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

const app = createApp(App)
app.use(store)
app.mount('#app')
*/

// ===========================================
// TYPES TYPESCRIPT pour une meilleure intégration
// ===========================================

export interface StoreTypes {
  cart: {
    cart: any[]
    total: number
    cartCount: number
    cartTotal: number
    isEmpty: boolean
  }
  features: {
    selectedFeatures: string[]
  }
  specializedModals: {
    isSaladModalOpen: boolean
    saladProduct: any
    saladSelectedSize: any
    isPastaModalOpen: boolean
    pastaProduct: any
    pastaSelectedSize: any
  }
  additionalFeaturesModal: {
    product: any
    isOpen: boolean
  }
} 