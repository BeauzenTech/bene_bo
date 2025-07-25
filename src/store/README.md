# Documentation des Stores Vuex - VaBene CRM Dashboard

Cette documentation décrit l'implémentation des stores Vuex convertis depuis les stores Zustand de l'application NextJS VaBene.

## 📁 Structure des fichiers

```
src/store/
├── index.ts                           # Store principal Vuex
├── modules/                           # Modules Vuex
│   ├── additional-features-modal.ts   # Gestion des modales de fonctionnalités supplémentaires
│   ├── features.ts                    # Gestion des fonctionnalités sélectionnées
│   ├── specialized-modals.ts          # Gestion des modales spécialisées (salades, pâtes)
│   └── cart.ts                        # Gestion du panier d'achat
├── plugins/
│   └── persistence.ts                 # Plugin de persistance par cookies
└── usage-examples.ts                  # Exemples d'utilisation dans les composants
```

## 🔧 Installation et Configuration

### 1. Installation des dépendances

Assurez-vous que Vuex est installé dans votre projet Vue 3 :

```bash
npm install vuex@next
```

### 2. Configuration dans main.ts

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

const app = createApp(App)
app.use(store)
app.mount('#app')
```

## 📦 Modules disponibles

### 1. **Cart Store** (`cart`)
Gère le panier d'achat avec toutes les fonctionnalités de l'application e-commerce.

**État :**
- `cart`: Array des articles dans le panier
- `total`: Total du panier
- `minOrderSupplement`: Supplément minimum de commande

**Principales actions :**
- `addToCart(item, typeOfDelivery)`: Ajouter un article au panier
- `removeFromCart(item)`: Supprimer un article du panier
- `clearCart()`: Vider le panier
- `incrementQuantity(itemId)`: Augmenter la quantité
- `decrementQuantity(itemId)`: Diminuer la quantité
- `addIngredient(itemId, ingredient)`: Ajouter un ingrédient
- `addSupplement(itemId, supplement)`: Ajouter un supplément

**Getters utiles :**
- `cartCount`: Nombre total d'articles
- `cartTotal`: Prix total du panier
- `isEmpty`: Vrai si le panier est vide
- `getItemById(itemId)`: Récupérer un article par son ID

### 2. **Features Store** (`features`)
Gère la sélection des fonctionnalités (wifi, parking, etc.).

**État :**
- `selectedFeatures`: Array des fonctionnalités sélectionnées

**Actions :**
- `toggleFeature(feature)`: Basculer une fonctionnalité
- `setSelectedFeatures(features)`: Définir les fonctionnalités
- `clearFeatures()`: Effacer toutes les sélections

### 3. **Specialized Modals Store** (`specializedModals`)
Gère l'état des modales spécialisées pour salades et pâtes.

**État des salades :**
- `isSaladModalOpen`: Modal salade ouverte
- `saladProduct`: Produit salade sélectionné
- `saladSelectedSize`: Taille sélectionnée pour la salade

**État des pâtes :**
- `isPastaModalOpen`: Modal pâtes ouverte
- `pastaProduct`: Produit pâtes sélectionné
- `pastaSelectedSize`: Taille sélectionnée pour les pâtes

### 4. **Additional Features Modal Store** (`additionalFeaturesModal`)
Gère la modal des fonctionnalités supplémentaires.

**État :**
- `product`: Produit avec taille sélectionnée
- `isOpen`: État de la modal

## 🍪 Persistance par Cookies

Le système de persistance utilise les cookies pour sauvegarder :
- **Cart** : Contenu du panier et total
- **Features** : Fonctionnalités sélectionnées

### Configuration de persistance

```typescript
// Durée : 7 jours
// SameSite: Lax
// Path: /
```

### Chargement automatique

Les données sont automatiquement chargées depuis les cookies au démarrage de l'application.

## 💡 Utilisation dans les composants

### Exemple basique avec Composition API

```vue
<template>
  <div>
    <p>Articles dans le panier : {{ cartCount }}</p>
    <button @click="addExampleItem">Ajouter un article</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const cartCount = computed(() => store.getters['cart/cartCount'])

const addExampleItem = () => {
  const item = {
    id: '1',
    name: 'Pizza Margherita',
    selectedSize: { id: 's1', name: 'Moyenne', price: '12.50', priceLivraison: '14.50' },
    Ingredients: [],
    supplements: [],
    quantity: 1
  }
  store.dispatch('cart/addToCart', { item, typeOfDelivery: 'click_collect' })
}
</script>
```

## 🔄 Migration depuis Zustand

### Principales différences :

1. **Structure** : État séparé en modules namespaced
2. **Mutations** : Toutes les modifications d'état passent par des mutations
3. **Actions** : Logique asynchrone dans les actions
4. **Getters** : Calculs dérivés réactifs
5. **Persistance** : Plugin centralisé au lieu de middleware Zustand

### Correspondances :

| Zustand | Vuex |
|---------|------|
| `create()` | `Module` |
| `set()` | `commit()` |
| `get()` | `getters` |
| `persist()` | Plugin personnalisé |

## 🚀 Avantages de cette implémentation

1. **Type Safety** : TypeScript intégré pour tous les modules
2. **Persistance** : Sauvegarde automatique dans les cookies
3. **Modularité** : Chaque store est un module séparé
4. **Réactivité** : Intégration native avec Vue 3
5. **DevTools** : Support complet des Vue DevTools
6. **SSR Ready** : Compatible avec le rendu côté serveur

## 🛠️ Maintenance

### Ajouter un nouveau module :

1. Créer le fichier dans `modules/`
2. L'importer dans `index.ts`
3. L'ajouter à la configuration des modules
4. Optionnellement l'ajouter au plugin de persistance

### Debugging :

Utilisez les Vue DevTools pour :
- Inspecter l'état
- Suivre les mutations
- Rejouer les actions
- Explorer l'historique des changements

## 📝 Notes importantes

- ⚠️ **Mutations synchrones uniquement** : Les mutations doivent être synchrones
- 🔄 **Actions pour l'asynchrone** : Utilisez les actions pour la logique asynchrone
- 🍪 **Persistance automatique** : Les données importantes sont sauvegardées automatiquement
- 🎯 **Namespacing** : Tous les modules utilisent des namespaces pour éviter les conflits

Cette implémentation reproduit fidèlement le comportement des stores Zustand originaux tout en tirant parti des avantages de Vuex et de l'écosystème Vue.js. 