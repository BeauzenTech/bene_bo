import { Store } from 'vuex'

// Interface pour les modules qui supportent la persistance
interface PersistableModule {
  namespaced: true
  actions: {
    loadFromCookies?: (context: any) => void
  }
}

// Utilitaires pour la gestion des cookies
const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof document === 'undefined') return null
    const value = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1]
    return value ? decodeURIComponent(value) : null
  },
  
  setItem: (name: string, value: string): void => {
    if (typeof document === 'undefined') return
    const expires = new Date()
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000) // 1 semaine
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
  },
  
  removeItem: (name: string): void => {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
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

export const cookiePersistencePlugin = (store: Store<any>) => {
  // Charger les données initiales depuis les cookies
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
      cookieStorage.setItem('cart', JSON.stringify(dataToSave))
    }
    
    if (mutation.type.startsWith('features/')) {
      const featuresState = state.features
      const dataToSave = {
        state: {
          selectedFeatures: featuresState.selectedFeatures
        }
      }
      cookieStorage.setItem('features-store', JSON.stringify(dataToSave))
    }
  })

  // Charger les données initiales après l'initialisation du store
  if (typeof window !== 'undefined') {
    // Attendre que le DOM soit prêt
    setTimeout(() => {
      // Charger les données pour chaque module qui le supporte
      store.dispatch('cart/loadFromCookies').catch(console.error)
      store.dispatch('features/loadFromCookies').catch(console.error)
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
          
          cookieStorage.setItem(moduleConfig.key, JSON.stringify(dataToSave))
        }
      })
    })
    
    // Charger les données initiales
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        Object.keys(config).forEach(moduleName => {
          store.dispatch(`${moduleName}/loadFromCookies`).catch(console.error)
        })
      }, 100)
    }
  }
}

export { cookieStorage } 