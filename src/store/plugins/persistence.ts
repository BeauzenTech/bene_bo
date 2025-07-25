import { Store } from 'vuex'

// Interface pour les modules qui supportent la persistance
interface PersistableModule {
  namespaced: true
  actions: {
    loadFromCookies?: (context: any) => void
  }
}

// Utilitaires pour la gestion du stockage
const storage = {
  getItem: (name: string): string | null => {
    if (typeof localStorage === 'undefined') return null
    return localStorage.getItem(name)
  },

  setItem: (name: string, value: string): void => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(name, value)
  },

  removeItem: (name: string): void => {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(name)
  }
}

// Configuration de persistance pour chaque module
const persistenceConfig = {
  cart: {
    key: 'cart',
    statePaths: ['cart', 'total']
  },
  features: {
    key: 'features-store',
    statePaths: ['selectedFeatures']
  }
}

export const persistencePlugin = (store: Store<any>) => {
  // Charger les données initiales depuis le stockage
  store.subscribe((mutation, state) => {
    // Sauvegarder automatiquement certains modules lors des mutations
    if (mutation.type.startsWith('cart/')) {
      const cartState = state.cart
      const dataToSave = {
        state: {
          cart: cartState.cart,
          total: cartState.total
        }
      }
      storage.setItem('cart', JSON.stringify(dataToSave))
    }

    if (mutation.type.startsWith('features/')) {
      const featuresState = state.features
      const dataToSave = {
        state: {
          selectedFeatures: featuresState.selectedFeatures
        }
      }
      storage.setItem('features-store', JSON.stringify(dataToSave))
    }
  })

  // Charger les données initiales après l'initialisation du store
  if (typeof window !== 'undefined') {
    // Attendre que le DOM soit prêt
    setTimeout(() => {
      // Charger les données pour chaque module qui le supporte
      store.dispatch('cart/loadFromStorage').catch(console.error)
      store.dispatch('features/loadFromStorage').catch(console.error)
    }, 100)
  }
}

// Plugin alternatif avec configuration plus granulaire
export const createPersistencePlugin = (config: Record<string, any>) => {
  return (store: Store<any>) => {
    // Logique de persistance personnalisée basée sur la configuration
    Object.keys(config).forEach(moduleName => {
      const moduleConfig = config[moduleName]
      
      store.subscribe((mutation, state) => {
        if (mutation.type.startsWith(`${moduleName}/`)) {
          const moduleState = state[moduleName]
          const dataToSave: any = { state: {} }
          
          // Sauvegarder uniquement les chemins d'état spécifiés
          moduleConfig.statePaths.forEach((path: string) => {
            if (moduleState[path] !== undefined) {
              dataToSave.state[path] = moduleState[path]
            }
          })
          
          storage.setItem(moduleConfig.key, JSON.stringify(dataToSave))
        }
      })
    })
    
    // Charger les données initiales
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        Object.keys(config).forEach(moduleName => {
          store.dispatch(`${moduleName}/loadFromStorage`).catch(console.error)
        })
      }, 100)
    }
  }
}

export { storage } 