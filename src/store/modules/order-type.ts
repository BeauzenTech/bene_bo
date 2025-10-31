import { Module } from 'vuex'
import { RootState } from '../index'

export type OrderType = 'dine_in' | 'click_collect' | 'delivery'

interface OrderTypeState {
  selectedOrderType: OrderType
}

const orderType: Module<OrderTypeState, RootState> = {
  namespaced: true,
  
  state: (): OrderTypeState => ({
    selectedOrderType: 'dine_in'
  }),
  
  mutations: {
    SET_ORDER_TYPE(state, orderType: OrderType) {
      state.selectedOrderType = orderType
    }
  },
  
  actions: {
    setOrderType({ commit, dispatch }, orderType: OrderType) {
      commit('SET_ORDER_TYPE', orderType)
      // Sauvegarder dans le localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('orderType', orderType)
      }
      // Recalculer les prix du panier si le type change
      dispatch('cart/recalculateAllPrices', null, { root: true })
    },
    
    loadFromStorage({ commit }) {
      if (typeof localStorage !== 'undefined') {
        const savedOrderType = localStorage.getItem('orderType') as OrderType
        if (savedOrderType && ['dine_in', 'click_collect', 'delivery'].includes(savedOrderType)) {
          commit('SET_ORDER_TYPE', savedOrderType)
        }
      }
    }
  },
  
  getters: {
    selectedOrderType: (state) => state.selectedOrderType,
    isDelivery: (state) => state.selectedOrderType === 'delivery',
    isClickCollect: (state) => state.selectedOrderType === 'click_collect',
    isDineIn: (state) => state.selectedOrderType === 'dine_in'
  }
}

export default orderType 