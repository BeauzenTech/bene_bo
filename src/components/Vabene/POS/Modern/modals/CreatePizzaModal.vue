<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Créer votre pizza personnalisée</h2>
        <button @click="closeModal" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Corps de la modale en deux colonnes -->
      <div class="modal-body two-columns">
        <!-- Colonne gauche : Sélections -->
        <div class="modal-left">
          <!-- Sélection de la taille -->
          <div class="size-section">
            <label v-for="size in availableSizes" :key="size.id" class="size-option"
              :class="{ selected: selectedSize?.id === size.id }">
              <input type="radio" :value="size.id" v-model="selectedSizeId" @change="selectSize(size)" />
              <span>{{ size.name }} - {{ formatPrice(parseFloat(size.price)) }}</span>
            </label>
          </div>

          <!-- Ingrédients -->
          <div class="ingredients-section">
            <h4>Ingrédients</h4>
            <!-- Champ de recherche -->
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input type="text" v-model="searchQuery" placeholder="Rechercher un ingrédient..." class="search-input" />
              <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="ingredients-list">
              <div v-for="(ingredient, index) in filteredIngredients" :key="ingredient.id" class="ingredient-card"
                :class="{ selected: ingredient.selected }" @click="toggleIngredient(index)">
                <img :src="ingredient.image" :alt="ingredient.name" class="ingredient-img" />
                <span class="ingredient-name">{{ ingredient.name }}</span>
                <span class="ingredient-price">+{{ formatPrice(ingredient.price) }}</span>
                <button class="ingredient-toggle" @click.stop="toggleIngredient(index)">
                  <i :class="ingredient.selected ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Quantité -->
          <div class="quantity-section">
            <label>Quantité :</label>
            <div class="quantity-controls">
              <button @click="decrementQuantity" :disabled="quantity <= 1" class="quantity-btn">-</button>
              <span class="quantity-display">{{ quantity }}</span>
              <button @click="incrementQuantity" class="quantity-btn">+</button>
            </div>
          </div>
        </div>

        <!-- Colonne droite : Résumé -->
        <div class="modal-right">
          <div class="summary-section">
            <h4>Résumé de votre pizza</h4>
            <div class="summary-line"><strong>Taille :</strong> {{ selectedSize?.name }}</div>
            <div class="summary-line"><strong>Ingrédients :</strong></div>
            <ul class="summary-ingredients">
              <li v-for="ingredient in selectedIngredients" :key="ingredient.id">
                {{ ingredient.name }} <span v-if="ingredient.price > 0">(+{{ formatPrice(ingredient.price) }})</span>
              </li>
              <li v-if="selectedIngredients.length === 0" class="no-ingredients">Aucun ingrédient sélectionné</li>
            </ul>
            <div class="summary-line"><strong>Quantité :</strong> {{ quantity }}</div>
            <div class="summary-total">
              <span class="price-label">Total :</span>
              <span class="price-value">{{ formatPrice(calculateTotal()) }}</span>
            </div>
            <button @click="handleAddToCart" class="add-to-cart-btn">
              <i class="fas fa-shopping-cart"></i>
              Ajouter au panier
            </button>
            <button @click="closeModal" class="cancel-btn">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ProductSize, CartIngredient, AddToCartEvent } from '../types'
import CustomPizzaImage from '@/assets/images/products/pate.png'
import { useStore } from 'vuex'
import { INGREDIENTS_WITH_PRICING } from '../ingredients'
import { ProductModel } from '@/models/product.model'

const store = useStore()

// IDs des produits pizza (doivent correspondre aux valeurs du frontend React)
const PIZZA_PRODUCT_IDS = {
  CLASSIC: '5a6956b0-2b55-4a46-87a1-57c491cb5b80',
  GLUTEN_FREE: '01b30afb-c735-4dba-bb73-121d1cc7fab2'
} as const

interface LocalIngredient {
  id: string
  name: string
  price: number
  image: string
  selected: boolean
}

const props = defineProps<{
  visible: boolean
  sizes: ProductSize[]
  ingredients: Array<{ id: string, name: string, price: number, image: string, selected: boolean }>
  productId: string
  product: ProductModel | null
}>()

const emit = defineEmits<{
  close: []
  'add-to-cart': [event: AddToCartEvent]
}>()

console.log('Product:', props.product)

// État local - SIMPLE ET DIRECT
const selectedSizeId = ref('')
const selectedSize = ref<ProductSize | null>(null)
const quantity = ref(1)
const localIngredients = ref<LocalIngredient[]>([])

// Computed pour les ingrédients sélectionnés
const selectedIngredients = computed(() => {
  return localIngredients.value.filter(ingredient => ingredient.selected)
})

// Ajout du champ de recherche
const searchQuery = ref('')

// Computed pour filtrer les ingrédients selon la recherche
const filteredIngredients = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return localIngredients.value

  return localIngredients.value.filter(ingredient =>
    ingredient.name.toLowerCase().includes(query)
  )
})

// Computed pour les tailles disponibles
const availableSizes = computed(() => {
  if (props.product?.productSizes) {
    return props.product.productSizes
      .filter(size => size.id) // Filtrer les tailles avec un ID valide
      .map(size => ({
        id: size.id!,
        name: size.size,
        price: size.price,
        size: size.size,
        priceLivraison: size.priceLivraison || size.price
      }))
      .sort((a, b) => {
        // Ordre des tailles de pizza
        const order = ["Petite", "Normale", "Grande"]
        const aIndex = order.indexOf(a.size)
        const bIndex = order.indexOf(b.size)
        
        // Si les deux tailles sont dans l'ordre défini
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex
        }
        
        // Si une seule taille est dans l'ordre défini, elle vient en premier
        if (aIndex !== -1) return -1
        if (bIndex !== -1) return 1
        
        // Sinon tri alphabétique
        return a.size.localeCompare(b.size)
      })
  }
  return props.sizes || []
})

// Initialiser quand la modale s'ouvre
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    // Réinitialiser la taille avec les vraies tailles du produit
    const firstSize = availableSizes.value[0]
    selectedSize.value = firstSize || null
    selectedSizeId.value = firstSize?.id || ''
    quantity.value = 1

    // Créer une copie locale des ingrédients
    localIngredients.value = props.ingredients.map(ing => ({
      id: ing.id,
      name: ing.name,
      price: ing.price,
      image: ing.image,
      selected: ing.selected || false
    }))
  }
}, { immediate: true })

// Fonctions
const selectSize = (size: ProductSize) => {
  selectedSize.value = size
  selectedSizeId.value = size.id
}

const toggleIngredient = (index: number) => {
  console.log('Toggle ingredient called for index:', index)
  console.log('Before toggle:', localIngredients.value[index].selected)

  // Modification directe de l'élément dans le tableau
  localIngredients.value[index].selected = !localIngredients.value[index].selected

  console.log('After toggle:', localIngredients.value[index].selected)
  console.log('Current localIngredients:', localIngredients.value.map(i => ({ name: i.name, selected: i.selected })))
}

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

const formatPrice = (price: number): string => `${price.toFixed(2)} CHF`

const calculateTotal = (): number => {
  if (!selectedSize.value) return 0
  const basePrice = parseFloat(selectedSize.value.price) || 0
  const ingredientsTotal = selectedIngredients.value.reduce((sum, ing) => sum + ing.price, 0)
  return (basePrice + ingredientsTotal) * quantity.value
}

const closeModal = () => emit('close')

// Image générique pour la pizza personnalisée (importée pour être empaquetée)
const CUSTOM_PIZZA_IMAGE = CustomPizzaImage

const handleAddToCart = () => {
  if (!selectedSize.value) return

  // Déterminer le nom selon l'ID du produit reçu
  const pizzaName = props.productId === PIZZA_PRODUCT_IDS.GLUTEN_FREE ? 'Votre pizza sans gluten' : 'Votre pizza'

  const productIdToUse = props.productId || PIZZA_PRODUCT_IDS.CLASSIC

  // Ajouter les ingrédients personnalisés au store features
  selectedIngredients.value.forEach(ingredient => {
    const featureName = ingredient.name
    store.dispatch('features/toggleFeature', featureName)
  })

  // Mapping des tailles vers la notation en cm
  const sizeMap: Record<string, string> = {
    'Petite': '24cm',
    'Normale': '33cm',
    'Grande': '40cm'
  }

  const sizeInCm = selectedSize.value?.name ? sizeMap[selectedSize.value.name] || selectedSize.value.name : ''

  // Combiner les ingrédients sélectionnés + les ingrédients par défaut
  const allCartIngredients: CartIngredient[] = []

  // Ajouter les ingrédients par défaut automatiquement
  INGREDIENTS_WITH_PRICING.forEach(ing => {
    if (ing.isDefault) {
      allCartIngredients.push({
        id: ing.id,
        name: ing.name,
        extra_cost_price: 0, // Ingrédients par défaut gratuits
        quantity: 1,
        isDefault: true,
        size: sizeInCm
      })
    }
  })

  // Ajouter les ingrédients sélectionnés manuellement
  selectedIngredients.value.forEach(ing => {
    const ingredientInfo = INGREDIENTS_WITH_PRICING.find(i => i.id === ing.id)

    // Ne pas dupliquer les ingrédients par défaut
    if (!ingredientInfo?.isDefault) {
      allCartIngredients.push({
        id: ing.id,
        name: ing.name,
        extra_cost_price: ing.price,
        quantity: 1,
        isDefault: false,
        size: sizeInCm
      })
    }
  })

  const cartIngredients = allCartIngredients

  const event: AddToCartEvent = {
    product: {
      id: productIdToUse,
      name: pizzaName,
      description: '',
      image: CUSTOM_PIZZA_IMAGE,
      category: 'pizza',
      sizes: availableSizes.value,
      ingredients: [],
      supplements: [],
      isAvailable: true
    },
    size: selectedSize.value,
    quantity: quantity.value,
    ingredients: cartIngredients,
    supplements: [],
    notes: '',
    specification_id: props.product?.id
  }
  emit('add-to-cart', event)
  closeModal()
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 12px 12px 0 0;

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
  }
}

.modal-body {
  padding: 1.5rem;
}

.modal-body.two-columns {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
}

.modal-left {
  flex: 2;
  min-width: 0;
}

.modal-right {
  flex: 1;
  min-width: 220px;
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.summary-section {
  width: 100%;
}

.summary-line {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.summary-ingredients {
  margin: 0 0 1rem 0;
  padding: 0 0 0 1.2em;
  font-size: 0.95rem;

  .no-ingredients {
    color: #64748b;
    font-style: italic;
  }
}

.summary-total {
  font-size: 1.2rem;
  font-weight: 700;
  color: #388D35;
  margin: 1rem 0;
}

.add-to-cart-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #388D35;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 1rem;
  margin-bottom: 0.5rem;

  &:hover {
    background: #2d7a2a;
  }
}

.cancel-btn {
  width: 100%;
  padding: 0.5rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
}

.size-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  .size-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;

    &.selected {
      background-color: #388D35;
      color: white;
      border-color: #388D35;
    }

    &:hover:not(.selected) {
      border-color: #388D35;
      background: #f0fdf4;
    }

    input {
      display: none;
    }
  }
}

.ingredients-section {
  margin-bottom: 1.5rem;

  h4 {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: #374151;
  }

  .search-box {
    position: relative;
    margin-bottom: 1rem;

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: 0.9rem;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 2.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      background: white;

      &:focus {
        outline: none;
        border-color: #388D35;
        box-shadow: 0 0 0 3px rgba(56, 141, 53, 0.1);
      }

      &::placeholder {
        color: #94a3b8;
      }
    }

    .clear-search {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;

      &:hover {
        background: #f1f5f9;
        color: #1e293b;
      }
    }
  }

  .ingredients-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    padding: 0.5rem;
    max-height: 370px;
    overflow-y: auto;
    background: #f6f8fa;
    border-radius: 12px;
  }

  .ingredient-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 0.5rem 0.75rem 0.5rem;
    border-radius: 12px;
    background-color: white;
    width: 110px;
    min-width: 100px;
    max-width: 120px;
    min-height: 150px;
    max-height: 150px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
    border: 2px solid transparent;
    cursor: pointer;

    &:hover {
      box-shadow: 0 4px 16px rgba(56, 141, 53, 0.10);
      background: #f0fdf4;
      border-color: #b6e7c9;
      transform: translateY(-2px);
    }

    &.selected {
      border: 2px solid #388D35;
      background: #e6fbe9;
      box-shadow: 0 4px 16px rgba(56, 141, 53, 0.15);
      transform: translateY(-2px);
    }

    .ingredient-img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 0.5rem;
      background: white;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }

    .ingredient-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.85rem;
      text-align: center;
      margin-bottom: 0.25rem;
      line-height: 1.2;
    }

    .ingredient-price {
      color: #388D35;
      font-weight: 600;
      font-size: 0.95rem;
      text-align: center;
      margin-bottom: 0.25rem;
    }

    .ingredient-toggle {
      background: none;
      border: none;
      color: #388D35;
      font-size: 1.5rem;
      cursor: pointer;
      margin-top: 0.25rem;
      transition: color 0.2s;

      &:hover {
        color: #2d7a2a;
      }
    }
  }
}

@media (max-width: 900px) {
  .ingredients-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-body.two-columns {
    flex-direction: column;
  }
}

.quantity-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  label {
    font-weight: 500;
    color: #1e293b;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .quantity-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #374151;
      transition: all 0.2s ease;
      font-weight: 600;

      &:hover:not(:disabled) {
        border-color: #388D35;
        color: #388D35;
        background: #f9fafb;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .quantity-display {
      min-width: 40px;
      text-align: center;
      font-weight: 600;
      color: #1e293b;
      font-size: 1.1rem;
    }
  }
}
</style>