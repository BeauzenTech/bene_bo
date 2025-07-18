import { Module } from 'vuex'
import { RootState } from '../index'
import { ProductSize, CartItem } from './additional-features-modal'

interface SpecializedModalsState {
  // Modal des salades
  isSaladModalOpen: boolean
  saladProduct: CartItem | null
  saladSelectedSize: ProductSize | null

  // Modal des pâtes
  isPastaModalOpen: boolean
  pastaProduct: CartItem | null
  pastaSelectedSize: ProductSize | null
}

const specializedModals: Module<SpecializedModalsState, RootState> = {
  namespaced: true,
  
  state: (): SpecializedModalsState => ({
    // États initiaux
    isSaladModalOpen: false,
    saladProduct: null,
    saladSelectedSize: null,

    isPastaModalOpen: false,
    pastaProduct: null,
    pastaSelectedSize: null
  }),
  
  mutations: {
    // Mutations pour les salades
    OPEN_SALAD_MODAL(state, { product, selectedSize }: { product: CartItem; selectedSize: ProductSize }) {
      state.isSaladModalOpen = true
      state.saladProduct = product
      state.saladSelectedSize = selectedSize
    },
    
    CLOSE_SALAD_MODAL(state) {
      state.isSaladModalOpen = false
      state.saladProduct = null
      state.saladSelectedSize = null
    },
    
    // Mutations pour les pâtes
    OPEN_PASTA_MODAL(state, { product, selectedSize }: { product: CartItem; selectedSize: ProductSize }) {
      state.isPastaModalOpen = true
      state.pastaProduct = product
      state.pastaSelectedSize = selectedSize
    },
    
    CLOSE_PASTA_MODAL(state) {
      state.isPastaModalOpen = false
      state.pastaProduct = null
      state.pastaSelectedSize = null
    }
  },
  
  actions: {
    // Actions pour les salades
    openSaladModal({ commit }, { product, selectedSize }: { product: CartItem; selectedSize: ProductSize }) {
      commit('OPEN_SALAD_MODAL', { product, selectedSize })
    },
    
    closeSaladModal({ commit }) {
      commit('CLOSE_SALAD_MODAL')
    },
    
    // Actions pour les pâtes
    openPastaModal({ commit }, { product, selectedSize }: { product: CartItem; selectedSize: ProductSize }) {
      commit('OPEN_PASTA_MODAL', { product, selectedSize })
    },
    
    closePastaModal({ commit }) {
      commit('CLOSE_PASTA_MODAL')
    }
  },
  
  getters: {
    // Getters pour les salades
    isSaladModalOpen: (state) => state.isSaladModalOpen,
    saladProduct: (state) => state.saladProduct,
    saladSelectedSize: (state) => state.saladSelectedSize,
    
    // Getters pour les pâtes
    isPastaModalOpen: (state) => state.isPastaModalOpen,
    pastaProduct: (state) => state.pastaProduct,
    pastaSelectedSize: (state) => state.pastaSelectedSize
  }
}

export default specializedModals 