import { createStore } from 'vuex'
import additionalFeaturesModal from './modules/additional-features-modal'
import features from './modules/features'
import specializedModals from './modules/specialized-modals'
import cart from './modules/cart'
import orderType from './modules/order-type'
import { persistencePlugin } from './plugins/persistence'

export interface RootState {
  // Types des modules seront définis dans leurs fichiers respectifs
}

export default createStore<RootState>({
  modules: {
    additionalFeaturesModal,
    features,
    specializedModals,
    cart,
    orderType
  },
  plugins: [persistencePlugin]
})
