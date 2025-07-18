import { Module } from 'vuex'
import { RootState } from '../index'

export interface ProductSize {
  id: string
  name: string
  price: string
  priceLivraison: string
}

export interface CartItem {
  id: string
  name: string
  selectedSize?: ProductSize
  quantity: number
  localProductId?: string
  totalPrice?: number
  Ingredients: any[]
  supplements?: any[]
}

interface AdditionalFeaturesModalState {
  product: (CartItem & { selectedSize: ProductSize }) | null
  isOpen: boolean
}

const additionalFeaturesModal: Module<AdditionalFeaturesModalState, RootState> = {
  namespaced: true,
  
  state: (): AdditionalFeaturesModalState => ({
    product: null,
    isOpen: false
  }),
  
  mutations: {
    SET_PRODUCT(state, product: CartItem & { selectedSize: ProductSize }) {
      state.product = product
    },
    
    SET_IS_OPEN(state, isOpen: boolean) {
      state.isOpen = isOpen
    },
    
    OPEN_MODAL(state, { product, selectedSize }: { product: CartItem; selectedSize: ProductSize }) {
      state.product = { ...product, selectedSize }
      state.isOpen = true
    },
    
    CLOSE_MODAL(state) {
      state.product = null
      state.isOpen = false
    }
  },
  
  actions: {
    setProduct({ commit }, product: CartItem & { selectedSize: ProductSize }) {
      commit('SET_PRODUCT', product)
    },
    
    setIsOpen({ commit }, isOpen: boolean) {
      commit('SET_IS_OPEN', isOpen)
    },
    
    openModal({ commit }, { product, selectedSize }: { product: CartItem; selectedSize: ProductSize }) {
      commit('OPEN_MODAL', { product, selectedSize })
    },
    
    closeModal({ commit }) {
      commit('CLOSE_MODAL')
    }
  },
  
  getters: {
    product: (state) => state.product,
    isOpen: (state) => state.isOpen
  }
}

export default additionalFeaturesModal 