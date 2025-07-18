import { Module } from 'vuex'
import { RootState } from '../index'

interface FeaturesState {
  selectedFeatures: string[]
}

const features: Module<FeaturesState, RootState> = {
  namespaced: true,
  
  state: (): FeaturesState => ({
    selectedFeatures: []
  }),
  
  mutations: {
    SET_SELECTED_FEATURES(state, features: string[]) {
      state.selectedFeatures = features
    },
    
    TOGGLE_FEATURE(state, feature: string) {
      const isSelected = state.selectedFeatures.includes(feature)
      
      if (isSelected) {
        state.selectedFeatures = state.selectedFeatures.filter(f => f !== feature)
      } else {
        state.selectedFeatures = [...state.selectedFeatures, feature]
      }
    },
    
    CLEAR_FEATURES(state) {
      state.selectedFeatures = []
    }
  },
  
  actions: {
    setSelectedFeatures({ commit }, features: string[]) {
      commit('SET_SELECTED_FEATURES', features)
    },
    
    toggleFeature({ commit }, feature: string) {
      commit('TOGGLE_FEATURE', feature)
    },
    
    clearFeatures({ commit }) {
      commit('CLEAR_FEATURES')
    },
    
    // Action pour charger depuis les cookies
    loadFromCookies({ commit }) {
      if (typeof document === 'undefined') return
      
      const value = document.cookie
        .split('; ')
        .find((row) => row.startsWith('features-store='))
        ?.split('=')[1]
      
      if (value) {
        try {
          const parsed = JSON.parse(decodeURIComponent(value))
          if (parsed.state && Array.isArray(parsed.state.selectedFeatures)) {
            commit('SET_SELECTED_FEATURES', parsed.state.selectedFeatures)
          }
        } catch (error) {
          console.error('Erreur lors du chargement des features depuis les cookies:', error)
        }
      }
    }
  },
  
  getters: {
    selectedFeatures: (state) => state.selectedFeatures,
    isFeatureSelected: (state) => (feature: string) => state.selectedFeatures.includes(feature)
  }
}

export default features 