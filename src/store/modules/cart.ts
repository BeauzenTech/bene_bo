import { Module } from 'vuex'
import { RootState } from '../index'
import { CartItem, ProductSize } from './additional-features-modal'

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
  total: number
  minOrderSupplement?: number
}

// Utilitaires pour générer un ID local de produit
const generateLocalProductId = (item: CartItem): string => {
  const baseId = `${item.id}_${item.selectedSize?.id || 'no-size'}`
  const ingredientsHash = (item.Ingredients || [])
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
    total: 0
  }),
  
  mutations: {
    SET_CART(state, cart: CartItem[]) {
      state.cart = cart
    },
    
    SET_TOTAL(state, total: number) {
      state.total = total
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
          totalPrice,
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
      state.total = 0
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
    
    UPDATE_ITEM_INGREDIENTS(state, { itemId, ingredients, totalPrice }: { itemId: string; ingredients: ItemIngredient[]; totalPrice: number }) {
      const item = state.cart.find(item => item.localProductId === itemId)
      if (item) {
        item.Ingredients = ingredients
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
    calculateItemTotalPrice(_context, { item, typeOfDelivery = 'click_collect' }: { item: CartItem; typeOfDelivery?: string }) {
      if (!item.selectedSize) return 0

      // Prix de base selon le type de livraison
      const basePrice = typeOfDelivery === 'delivery'
        ? Number(item.selectedSize.priceLivraison)
        : Number(item.selectedSize.price)

      // Coût des ingrédients ajoutés (non par défaut)
      const ingredientsPrice = (item.Ingredients || []).reduce((total, ingredient) => {
        if (!ingredient.isDefault && ingredient.quantity > 0) {
          return total + ingredient.extra_cost_price * ingredient.quantity
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

      return basePrice + ingredientsPrice + supplementsPrice
    },
    
    addToCart({ commit, dispatch }, { item, typeOfDelivery }: { item: CartItem; typeOfDelivery?: string }) {
      const totalPrice = dispatch('calculateItemTotalPrice', { item, typeOfDelivery })
      commit('ADD_TO_CART', { item, totalPrice })
      dispatch('loadFromCookies')
    },
    
    removeFromCart({ commit, dispatch }, item: CartItem) {
      commit('REMOVE_FROM_CART', item)
      dispatch('loadFromCookies')
    },
    
    clearCart({ commit }) {
      commit('CLEAR_CART')
      // Supprimer des cookies
      if (typeof document !== 'undefined') {
        document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
      }
    },
    
    incrementQuantity({ commit, dispatch, getters }, itemId: string) {
      const item = getters.getItemById(itemId)
      if (item) {
        const totalPrice = dispatch('calculateItemTotalPrice', { item })
        commit('INCREMENT_QUANTITY', { itemId, totalPrice })
      }
    },
    
    decrementQuantity({ commit, dispatch, getters }, itemId: string) {
      const item = getters.getItemById(itemId)
      if (item) {
        const totalPrice = dispatch('calculateItemTotalPrice', { item })
        commit('DECREMENT_QUANTITY', { itemId, totalPrice })
      }
    },
    
    addIngredient({ commit, dispatch, getters }, { itemId, ingredient }: { itemId: string; ingredient: ItemIngredient }) {
      const item = getters.getItemById(itemId)
      if (item) {
        const updatedIngredients = item.Ingredients.some((i: ItemIngredient) => i.name === ingredient.name)
          ? item.Ingredients.map((i: ItemIngredient) =>
              i.name === ingredient.name ? { ...i, quantity: ingredient.quantity } : i
            )
          : [...item.Ingredients, ingredient]
        
        const updatedItem = { ...item, Ingredients: updatedIngredients }
        const totalPrice = dispatch('calculateItemTotalPrice', { item: updatedItem })
        commit('UPDATE_ITEM_INGREDIENTS', { itemId, ingredients: updatedIngredients, totalPrice })
      }
    },
    
    removeIngredient({ commit, dispatch, getters }, { itemId, ingredient }: { itemId: string; ingredient: ItemIngredient }) {
      const item = getters.getItemById(itemId)
      if (item) {
        const updatedIngredients = ingredient.quantity <= 0
          ? item.Ingredients.filter((i: ItemIngredient) => i.name !== ingredient.name)
          : item.Ingredients.map((i: ItemIngredient) =>
              i.name === ingredient.name ? { ...i, quantity: ingredient.quantity } : i
            )
        
        const updatedItem = { ...item, Ingredients: updatedIngredients }
        const totalPrice = dispatch('calculateItemTotalPrice', { item: updatedItem })
        commit('UPDATE_ITEM_INGREDIENTS', { itemId, ingredients: updatedIngredients, totalPrice })
      }
    },
    
    clearIngredients({ commit, dispatch, getters }, itemId: string) {
      const item = getters.getItemById(itemId)
      if (item) {
        const updatedIngredients = item.Ingredients.filter((i: ItemIngredient) => i.isDefault)
        const updatedItem = { ...item, Ingredients: updatedIngredients }
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
    
    // Action pour charger depuis les cookies
    loadFromCookies({ commit }) {
      if (typeof document === 'undefined') return
      
      const value = document.cookie
        .split('; ')
        .find((row) => row.startsWith('cart='))
        ?.split('=')[1]
      
      if (value) {
        try {
          const parsed = JSON.parse(decodeURIComponent(value))
          if (parsed.state && Array.isArray(parsed.state.cart)) {
            commit('SET_CART', parsed.state.cart)
            commit('SET_TOTAL', parsed.state.total || 0)
          }
        } catch (error) {
          console.error('Erreur lors du chargement du panier depuis les cookies:', error)
        }
      }
    }
  },
  
  getters: {
    cart: (state) => state.cart,
    total: (state) => state.total,
    cartCount: (state) => state.cart.reduce((count, item) => count + item.quantity, 0),
    cartTotal: (state) => state.cart.reduce((total, item) => total + (item.totalPrice || 0), 0),
    getItemById: (state) => (itemId: string) => state.cart.find(item => item.localProductId === itemId),
    isEmpty: (state) => state.cart.length === 0
  }
}

export default cart 