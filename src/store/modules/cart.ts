import { Module } from 'vuex'
import { RootState } from '../index'
import { CartItem, ProductSize } from '@/components/Vabene/POS/Modern/types'

export interface ItemIngredient {
  id: string
  name: string
  quantity: number
  isDefault: boolean
  extra_cost_price: number
}

export interface ItemSupplement {
  id: string
  name: string
  quantity: number
  extra_cost_price: number
}

interface CartState {
  cart: CartItem[]
  minOrderSupplement?: number
}

// Utilitaires pour générer un ID local de produit
const generateLocalProductId = (item: CartItem): string => {
  const baseId = `${item.id}_${item.selectedSize?.id || 'no-size'}`
  const ingredientsHash = (item.ingredients || [])
    .filter(ing => !ing.isDefault && ing.quantity > 0)
    .map(ing => `${ing.id}_${ing.quantity}`)
    .sort()
    .join('_')
  const supplementsHash = (item.supplements || [])
    .filter(sup => sup.quantity > 0)
    .map(sup => `${sup.id}_${sup.quantity}`)
    .sort()
    .join('_')
  
  return `${baseId}_${ingredientsHash}_${supplementsHash}`
}

const cart: Module<CartState, RootState> = {
  namespaced: true,
  
  state: (): CartState => ({
    cart: [],
  }),
  
  mutations: {
    SET_CART(state, cart: CartItem[]) {
      state.cart = cart
    },
    
    ADD_TO_CART(state, { item, totalPrice }: { item: CartItem; totalPrice: number }) {
      const existingItemIndex = state.cart.findIndex(
        (i) => i.localProductId === item.localProductId
      )

      if (existingItemIndex !== -1) {
        state.cart[existingItemIndex].quantity += 1
        state.cart[existingItemIndex].totalPrice = totalPrice * state.cart[existingItemIndex].quantity
      } else {
        state.cart.push({
          ...item,
          quantity: item.quantity || 1,
          totalPrice: totalPrice,
          localProductId: generateLocalProductId(item)
        })
      }
    },
    
    REMOVE_FROM_CART(state, item: CartItem) {
      state.cart = state.cart.filter(
        (i) => i.localProductId !== item.localProductId
      )
    },
    
    CLEAR_CART(state) {
      state.cart = []
    },
    
    INCREMENT_QUANTITY(state, { itemId, totalPrice }: { itemId: string; totalPrice: number }) {
      const item = state.cart.find(item => item.localProductId === itemId)
      if (item) {
        item.quantity += 1
        item.totalPrice = totalPrice * item.quantity
      }
    },
    
    DECREMENT_QUANTITY(state, { itemId, totalPrice }: { itemId: string; totalPrice: number }) {
      const item = state.cart.find(item => item.localProductId === itemId)
      if (item) {
        item.quantity = Math.max(1, item.quantity - 1)
        item.totalPrice = totalPrice * item.quantity
      }
    },
    
    UPDATE_QUANTITY(state, { itemId, quantity, totalPrice }: { itemId: string; quantity: number; totalPrice: number }) {
      const item = state.cart.find(item => item.localProductId === itemId)
      if (item) {
        item.quantity = Math.max(1, quantity)
        item.totalPrice = totalPrice * item.quantity
      }
    },
    
    UPDATE_ITEM_INGREDIENTS(state, { itemId, ingredients, totalPrice }: { itemId: string; ingredients: ItemIngredient[]; totalPrice: number }) {
      const item = state.cart.find(item => item.localProductId === itemId)
      if (item) {
        item.ingredients = ingredients
        item.totalPrice = totalPrice * item.quantity
      }
    },
    
    UPDATE_ITEM_SUPPLEMENTS(state, { itemId, supplements, totalPrice }: { itemId: string; supplements: ItemSupplement[]; totalPrice: number }) {
      const item = state.cart.find(item => item.localProductId === itemId)
      if (item) {
        item.supplements = supplements
        item.totalPrice = totalPrice * item.quantity
      }
    }
  },
  
  actions: {
    // Fonction pour calculer le prix total d'un item
    calculateItemTotalPrice({ rootGetters }, { item }: { item: CartItem }) {
      if (!item.selectedSize) return 0

      // Récupérer le type de commande actuel depuis le store orderType
      const currentOrderType = rootGetters['orderType/selectedOrderType'] || 'dine_in'
      const isDelivery = currentOrderType === 'delivery'

      let basePrice = 0
      
      if (isDelivery) {
        basePrice = Number(item.selectedSize.priceLivraison) || Number(item.selectedSize.price) || 0
      } else {
       
        basePrice = Number(item.selectedSize.price) || 0
      }

      // Coût des ingrédients ajoutés (non par défaut)
      // Support pour les deux formats : Ingredients (store) et ingredients (POS moderne)
      const ingredients = (item as any).Ingredients || (item as any).ingredients || []
      const ingredientsPrice = ingredients.reduce((total: number, ingredient: any) => {
        if (!ingredient.isDefault && ingredient.quantity > 0) {
          return total + (Number(ingredient.extra_cost_price) || 0) * ingredient.quantity
        }
        return total
      }, 0)

      // Coût des suppléments
      const supplementsPrice = (item.supplements || []).reduce((total, supplement) => {
        const supQuantity = (supplement as ItemSupplement).quantity || 0
        if (supQuantity > 0) {
          return total + (Number(supplement.extra_cost_price) || 0)
        }
        return total
      }, 0)

      const totalPrice = basePrice + ingredientsPrice + supplementsPrice

      
      return totalPrice
    },
    
    async addToCart({ commit, dispatch }, { item }: { item: CartItem }) {
      // IMPORTANT: Ne pas modifier les prix originaux de la taille
      // Garder les prix originaux (price et priceLivraison) intacts
      const originalSize = {
        ...item.selectedSize,
        // S'assurer que les prix originaux sont préservés
        price: item.selectedSize.price,
        priceLivraison: item.selectedSize.priceLivraison
      }
      
      
      // Créer un nouvel item avec la taille originale
      const itemWithOriginalSize = {
        ...item,
        selectedSize: originalSize
      }
      
      // Calculer le prix avec le type de commande actuel
      const totalPrice = await dispatch('calculateItemTotalPrice', { item: itemWithOriginalSize })
      
      
      commit('ADD_TO_CART', { item: itemWithOriginalSize, totalPrice })
      dispatch('saveToStorage')
    },
    
    removeFromCart({ commit, dispatch }, item: CartItem) {
      commit('REMOVE_FROM_CART', item)
      dispatch('saveToStorage')
    },
    
    clearCart({ commit }) {
      commit('CLEAR_CART')
      // Supprimer du stockage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('cart')
      }
    },
    
    async incrementQuantity({ commit, dispatch, getters }, itemId: string) {
      const item = getters.getItemById(itemId)
      if (item) {
        const totalPrice = await dispatch('calculateItemTotalPrice', { item })
        commit('INCREMENT_QUANTITY', { itemId, totalPrice })
        dispatch('saveToStorage')
      }
    },
    
    async decrementQuantity({ commit, dispatch, getters }, itemId: string) {
      const item = getters.getItemById(itemId)
      if (item) {
        const totalPrice = await dispatch('calculateItemTotalPrice', { item })
        commit('DECREMENT_QUANTITY', { itemId, totalPrice })
        dispatch('saveToStorage')
      }
    },
    
    async updateQuantity({ commit, dispatch, getters }, { itemId, quantity }: { itemId: string; quantity: number }) {
      const item = getters.getItemById(itemId)
      if (item && quantity > 0) {
        const totalPrice = await dispatch('calculateItemTotalPrice', { item })
        commit('UPDATE_QUANTITY', { itemId, quantity, totalPrice })
        dispatch('saveToStorage')
      } else if (item && quantity <= 0) {
        commit('REMOVE_FROM_CART', item)
        dispatch('saveToStorage')
      }
    },
    
    // Nouvelle action pour recalculer tous les prix du panier
    async recalculateAllPrices({ commit, dispatch, getters }) {
      const updatedCart: CartItem[] = []
      
      for (const item of getters.cart) {
        const totalPrice = await dispatch('calculateItemTotalPrice', { item })
        updatedCart.push({
          ...item,
          totalPrice: totalPrice
        })
      }
      
      commit('SET_CART', updatedCart)
      dispatch('saveToStorage')
    },
    
    addIngredient({ commit, dispatch, getters }, { itemId, ingredient }: { itemId: string; ingredient: ItemIngredient }) {
      const item = getters.getItemById(itemId)
      if (item) {
        const updatedIngredients = item.ingredients.some((i: ItemIngredient) => i.name === ingredient.name)
          ? item.ingredients.map((i: ItemIngredient) =>
              i.name === ingredient.name ? { ...i, quantity: ingredient.quantity } : i
            )
          : [...item.ingredients, ingredient]
        
        const updatedItem = { ...item, ingredients: updatedIngredients }
        const totalPrice = dispatch('calculateItemTotalPrice', { item: updatedItem })
        commit('UPDATE_ITEM_INGREDIENTS', { itemId, ingredients: updatedIngredients, totalPrice })
      }
    },
    
    removeIngredient({ commit, dispatch, getters }, { itemId, ingredient }: { itemId: string; ingredient: ItemIngredient }) {
      const item = getters.getItemById(itemId)
      if (item) {
        const updatedIngredients = ingredient.quantity <= 0
          ? item.ingredients.filter((i: ItemIngredient) => i.name !== ingredient.name)
          : item.ingredients.map((i: ItemIngredient) =>
              i.name === ingredient.name ? { ...i, quantity: ingredient.quantity } : i
            )
        
        const updatedItem = { ...item, ingredients: updatedIngredients }
        const totalPrice = dispatch('calculateItemTotalPrice', { item: updatedItem })
        commit('UPDATE_ITEM_INGREDIENTS', { itemId, ingredients: updatedIngredients, totalPrice })
      }
    },
    
    clearIngredients({ commit, dispatch, getters }, itemId: string) {
      const item = getters.getItemById(itemId)
      if (item) {
        const updatedIngredients = item.ingredients.filter((i: ItemIngredient) => i.isDefault)
        const updatedItem = { ...item, ingredients: updatedIngredients }
        const totalPrice = dispatch('calculateItemTotalPrice', { item: updatedItem })
        commit('UPDATE_ITEM_INGREDIENTS', { itemId, ingredients: updatedIngredients, totalPrice })
      }
    },
    
    addSupplement({ commit, dispatch, getters }, { itemId, supplement }: { itemId: string; supplement: ItemSupplement }) {
      const item = getters.getItemById(itemId)
      if (item) {
        const currentSupplements = item.supplements || []
        const updatedSupplements = currentSupplements.some((s: ItemSupplement) => s.name === supplement.name)
          ? currentSupplements.map((s: ItemSupplement) =>
              s.name === supplement.name ? { ...s, quantity: supplement.quantity } : s
            )
          : [...currentSupplements, supplement]
        
        const updatedItem = { ...item, supplements: updatedSupplements }
        const totalPrice = dispatch('calculateItemTotalPrice', { item: updatedItem })
        commit('UPDATE_ITEM_SUPPLEMENTS', { itemId, supplements: updatedSupplements, totalPrice })
      }
    },
    
    removeSupplement({ commit, dispatch, getters }, { itemId, supplement }: { itemId: string; supplement: ItemSupplement }) {
      const item = getters.getItemById(itemId)
      if (item) {
        const currentSupplements = item.supplements || []
        const updatedSupplements = supplement.quantity <= 0
          ? currentSupplements.filter((s: ItemSupplement) => s.name !== supplement.name)
          : currentSupplements.map((s: ItemSupplement) =>
              s.name === supplement.name ? { ...s, quantity: supplement.quantity } : s
            )
        
        const updatedItem = { ...item, supplements: updatedSupplements }
        const totalPrice = dispatch('calculateItemTotalPrice', { item: updatedItem })
        commit('UPDATE_ITEM_SUPPLEMENTS', { itemId, supplements: updatedSupplements, totalPrice })
      }
    },
    
    clearSupplements({ commit, dispatch, getters }, itemId: string) {
      const item = getters.getItemById(itemId)
      if (item) {
        const updatedItem = { ...item, supplements: [] }
        const totalPrice = dispatch('calculateItemTotalPrice', { item: updatedItem })
        commit('UPDATE_ITEM_SUPPLEMENTS', { itemId, supplements: [], totalPrice })
      }
    },
    
    // Action pour charger depuis le stockage local
    loadFromStorage({ commit }) {
      if (typeof localStorage === 'undefined') return
      
      const value = localStorage.getItem('cart')
      
      if (value) {
        try {
          const parsed = JSON.parse(value)
          if (parsed.state && Array.isArray(parsed.state.cart)) {
            commit('SET_CART', parsed.state.cart)
            // Ne pas mettre à jour le total manuellement, laisser le getter cartTotal faire le calcul
          }
        } catch (error) {
          console.error('Erreur lors du chargement du panier depuis le stockage local:', error)
        }
      }
    },
    
    // Action pour sauvegarder dans le stockage local
    saveToStorage({ state }) {
      if (typeof localStorage === 'undefined') return
      
      try {
        const cartData = {
          state: {
            cart: state.cart
          }
        }
        const value = JSON.stringify(cartData)
        localStorage.setItem('cart', value)
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier dans le stockage local:', error)
      }
    }
  },
  
  getters: {
    cart: (state) => state.cart,
    cartCount: (state) => state.cart.reduce((count, item) => count + item.quantity, 0),
    cartTotal: (state) => state.cart.reduce((total, item) => total + (item.totalPrice || 0), 0),
    getItemById: (state) => (itemId: string) => state.cart.find(item => item.localProductId === itemId),
    isEmpty: (state) => state.cart.length === 0
  }
}

export default cart 