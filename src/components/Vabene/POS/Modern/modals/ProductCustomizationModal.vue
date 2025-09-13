<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- En-tête de la modale -->
      <div class="modal-header">
        <h2 class="modal-title">Personnaliser votre produit</h2>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenu principal -->
      <div class="modal-content">
        <!-- Image et informations du produit -->
        <div class="product-section">
          <div class="product-image">
            <img :src="product?.image || '/images/default-product.jpg'" :alt="product?.name" />
          </div>

          <div class="product-info">
            <h3 class="product-name">{{ product?.name }}</h3>
            <p v-if="product?.description" class="product-description">{{ product.description }}</p>

            <!-- Sélection de taille -->
            <div v-if="product?.sizes && product.sizes.length > 1" class="size-selection">
              <h4 class="selection-title">Choisir la taille</h4>
              <div class="size-options">
                <button v-for="size in product.sizes" :key="size.id"
                  :class="['size-btn', { active: selectedSize?.id === size.id }]" @click="selectSize(size)">
                  <span class="size-name">{{ size.name }}</span>
                  <span class="size-price">{{ formatPrice(getSizePrice(size)) }} CHF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Personnalisation des ingrédients (pour pizzas et plats) -->
        <div v-if="showIngredients" class="ingredients-section">
          <h4 class="selection-title">Personnaliser les ingrédients</h4>

          <!-- Information sur le fonctionnement -->
          <div class="ingredients-info">
            <div class="info-item">
              <i class="fas fa-check-circle" style="color: #388D35;"></i>
              <span>Les ingrédients marqués "Inclus" viennent avec le produit</span>
            </div>
            <div class="info-item">
              <i class="fas fa-plus" style="color: #388D35;"></i>
              <span>Mode Ajouter : ajoutez des ingrédients supplémentaires</span>
            </div>
            <div class="info-item">
              <i class="fas fa-minus" style="color: #ef4444;"></i>
              <span>Mode Retirer : retirez même les ingrédients inclus</span>
            </div>
          </div>

          <!-- Mode de personnalisation -->
          <div class="customize-mode">
            <button :class="['mode-btn', { active: customizeMode === 'add' }]" @click="customizeMode = 'add'">
              <i class="fas fa-plus"></i>
              Ajouter
            </button>
            <button :class="['mode-btn', { active: customizeMode === 'remove' }]" @click="customizeMode = 'remove'">
              <i class="fas fa-minus"></i>
              Retirer
            </button>
          </div>

          <!-- Liste des ingrédients -->
          <div class="ingredients-grid">
            <div v-for="ingredient in availableIngredients" :key="ingredient.id" 
              :class="['ingredient-item', { 
                'default-ingredient': ingredient.isDefault,
                'removed-default': ingredient.isDefault && getIngredientQuantity(ingredient.id) === 0,
                'selected': getIngredientQuantity(ingredient.id) > 0
              }]"
              @click="toggleIngredient(ingredient)">
              
              <!-- Badge pour ingrédient par défaut -->
              <div v-if="ingredient.isDefault" class="default-badge">
                <i class="fas fa-check-circle"></i>
                <span>Inclus</span>
              </div>

              <div class="ingredient-image">
                <img :src="ingredient.image || '/images/ingredients/default.png'" :alt="ingredient.name" />
                <!-- Overlay pour ingrédient retiré -->
                <div v-if="ingredient.isDefault && getIngredientQuantity(ingredient.id) === 0" class="removed-overlay">
                  <i class="fas fa-times"></i>
                </div>
              </div>

              <div class="ingredient-info">
                <span class="ingredient-name">{{ ingredient.name }}</span>
                <span v-if="ingredient.price > 0 && !ingredient.isDefault" class="ingredient-price">+{{ formatPrice(ingredient.price) }} CHF</span>
                <span v-else-if="ingredient.isDefault" class="ingredient-price default-price">Inclus</span>
              </div>

              <div class="ingredient-controls">
                <button v-if="getIngredientQuantity(ingredient.id) > 0" class="qty-btn decrease"
                  @click.stop="decreaseIngredient(ingredient.id)">
                  <i class="fas fa-minus"></i>
                </button>

                <span v-if="getIngredientQuantity(ingredient.id) > 0" class="quantity">
                  {{ getIngredientQuantity(ingredient.id) }}
                </span>

                <button class="qty-btn increase" @click.stop="increaseIngredient(ingredient.id)">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes spéciales -->
        <div class="notes-section">
          <h4 class="selection-title">Instructions spéciales</h4>
          <textarea v-model="notes" placeholder="Ajouter des instructions spéciales pour votre commande..."
            class="notes-input" rows="3"></textarea>
        </div>

        <!-- Résumé des modifications -->
        <div v-if="hasModifications" class="modifications-summary">
          <h4 class="selection-title">Vos modifications</h4>
          <div class="modifications-list">
            <div v-for="ingredient in modifiedIngredients" :key="ingredient.id" class="modification-item">
              <span class="modification-name">{{ ingredient.name }}</span>
              <span class="modification-detail">x{{ ingredient.quantity }}</span>
              <span class="modification-price">+{{ formatPrice(ingredient.price * ingredient.quantity) }} CHF</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer avec quantité et prix -->
      <div class="modal-footer">
        <div class="quantity-section">
          <span class="quantity-label">Quantité:</span>
          <div class="quantity-controls">
            <button class="qty-btn" @click="decreaseQuantity" :disabled="quantity <= 1">
              <i class="fas fa-minus"></i>
            </button>
            <span class="quantity-display">{{ quantity }}</span>
            <button class="qty-btn" @click="increaseQuantity">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <div class="price-section">
          <div class="price-breakdown">
            <span class="price-label">Prix unitaire:</span>
            <span class="unit-price">{{ formatPrice(unitPrice) }} CHF</span>
          </div>
          <div class="total-price">
            <span class="total-label">Total:</span>
            <span class="total-amount">{{ formatPrice(totalPrice) }} CHF</span>
          </div>
        </div>

        <button class="add-to-cart-btn" @click="addToCart" :disabled="!canAddToCart">
          <i class="fas fa-shopping-cart"></i>
          Ajouter au panier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import type { Product, ProductSize, Ingredient, AddToCartEvent } from '../types'

const store = useStore()

interface Props {
  product: Product | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  'add-to-cart': [event: AddToCartEvent]
}>()

// État local
const isOpen = ref(true)
const selectedSize = ref<ProductSize | null>(null)
const customizeMode = ref<'add' | 'remove'>('add')
const notes = ref('')
const quantity = ref(1)
const selectedIngredients = ref<Record<string, number>>({})

// Données calculées
const showIngredients = computed(() => {

  return props.product?.type === 'Pizza' ||
    props.product?.ingredients && props.product.ingredients.length > 0
})

const availableIngredients = computed(() => {
  if (!props.product?.ingredients) return []
  return props.product.ingredients.filter(ing => ing.isAvailable)
})

const modifiedIngredients = computed(() => {

  return availableIngredients.value
    .filter(ing => selectedIngredients.value[ing.id] > 0)
    .map(ing => ({
      ...ing,
      quantity: selectedIngredients.value[ing.id]
    }))
})

const hasModifications = computed(() => {
  return modifiedIngredients.value.length > 0 || notes.value.trim() !== ''
})

const unitPrice = computed(() => {
  if (!selectedSize.value) return 0

  // Utiliser le prix de livraison si le type de commande est 'delivery'
  const isDelivery = store.getters['orderType/isDelivery']
  const basePrice = isDelivery && selectedSize.value.priceLivraison 
    ? parseFloat(selectedSize.value.priceLivraison) 
    : parseFloat(selectedSize.value.price)
  
  const ingredientsPrice = modifiedIngredients.value.reduce((sum, ing) => {
    return sum + (ing.price * ing.quantity)
  }, 0)

  return basePrice + ingredientsPrice
})

const totalPrice = computed(() => {
  return unitPrice.value * quantity.value
})

const canAddToCart = computed(() => {
  return props.product && selectedSize.value && quantity.value > 0
})

// Watchers
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    // Sélectionner la taille par défaut
    if (newProduct.sizes && newProduct.sizes.length > 0) {
      selectedSize.value = newProduct.sizes.find(s => s.name === 'Normale') || newProduct.sizes[0]
    }

    // Initialiser les ingrédients par défaut
    if (newProduct.ingredients) {
      const defaultIngredients: Record<string, number> = {}
      newProduct.ingredients.forEach(ing => {
        if (ing.isDefault) {
          defaultIngredients[ing.id] = 1
        }
      })
      selectedIngredients.value = defaultIngredients
    }
  }
}, { immediate: true })

// Méthodes
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

const getSizePrice = (size: ProductSize): number => {
  const isDelivery = store.getters['orderType/isDelivery']
  return isDelivery && size.priceLivraison 
    ? parseFloat(size.priceLivraison) 
    : parseFloat(size.price)
}

const selectSize = (size: ProductSize) => {
  selectedSize.value = size
}

const getIngredientQuantity = (ingredientId: string): number => {
  return selectedIngredients.value[ingredientId] || 0
}

const toggleIngredient = (ingredient: Ingredient) => {
  const currentQty = selectedIngredients.value[ingredient.id] || 0

  if (customizeMode.value === 'add') {
    // Mode ajouter : ajouter l'ingrédient s'il n'est pas déjà présent
    selectedIngredients.value[ingredient.id] = currentQty > 0 ? currentQty : 1
  } else {
    // Mode retirer : retirer l'ingrédient (même les ingrédients par défaut)
    selectedIngredients.value[ingredient.id] = 0
  }
}

const increaseIngredient = (ingredientId: string) => {
  const currentQty = selectedIngredients.value[ingredientId] || 0
  selectedIngredients.value[ingredientId] = currentQty + 1
}

const decreaseIngredient = (ingredientId: string) => {
  const currentQty = selectedIngredients.value[ingredientId] || 0
  if (currentQty > 0) {
    selectedIngredients.value[ingredientId] = currentQty - 1
  }
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const closeModal = () => {
  isOpen.value = false
  emit('close')
}

const addToCart = () => {
  if (!props.product || !selectedSize.value) return



  // ❌ ANCIEN CODE QUI MODIFIAIT LES PRIX :
  // const isDelivery = store.getters['orderType/isDelivery']
  // const correctPrice = isDelivery && selectedSize.value.priceLivraison 
  //   ? parseFloat(selectedSize.value.priceLivraison) || 0
  //   : parseFloat(selectedSize.value.price) || 0
  // const sizeWithCorrectPrice = {
  //   ...selectedSize.value,
  //   price: correctPrice.toString()  // ← PROBLÈME : Écrasait le prix original !
  // }

  // ✅ NOUVEAU CODE : Préserver les prix originaux
  // Le store cart se chargera de calculer le bon prix selon le type de commande
  const sizeWithOriginalPrices = {
    ...selectedSize.value,
    // Garder les prix originaux intacts
    price: selectedSize.value.price,
    priceLivraison: selectedSize.value.priceLivraison
  }



  const cartIngredients = modifiedIngredients.value.map(ing => ({
    id: ing.id,
    name: ing.name,
    extra_cost_price: ing.price,
    quantity: ing.quantity,
    isDefault: ing.isDefault,
    size: selectedSize.value?.name || 'Normale',
    type: 'ingredient'
  }))

  const addToCartEvent: AddToCartEvent = {
    product: props.product,
    size: sizeWithOriginalPrices,  // ← Utiliser les prix originaux
    quantity: quantity.value,
    ingredients: cartIngredients,
    supplements: [],
    notes: notes.value
  }

  emit('add-to-cart', addToCartEvent)
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

.modal-container {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;

  .modal-title {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: #f8fafc;
    border-radius: 50%;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background: #ef4444;
      color: white;
    }
  }
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.product-section {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;

  .product-image {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .product-info {
    flex: 1;

    .product-name {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .product-description {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }
  }
}

.size-selection {
  margin-bottom: 1.5rem;

  .size-options {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .size-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #388D35;
      }

      &.active {
        background: #388D35;
        border-color: #388D35;
        color: white;
      }

      .size-name {
        font-size: 12px;
        font-weight: 500;
      }

      .size-price {
        font-size: 14px;
        font-weight: 600;
        margin-top: 2px;
      }
    }
  }
}

.selection-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.ingredients-info {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 1rem;

  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #64748b;
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }

    i {
      width: 12px;
      text-align: center;
    }
  }
}

.customize-mode {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;

  .mode-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      border-color: #388D35;
    }

    &.active {
      background: #388D35;
      border-color: #388D35;
      color: white;
    }
  }
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 1.5rem;

  .ingredient-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid #f1f5f9;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      border-color: #388D35;
      background: #f8fafc;
    }

    &.default-ingredient {
      border-color: #388D35;
      background: #f0f9f0;
    }

    &.removed-default {
      border-color: #ef4444;
      background: #fef2f2;
      opacity: 0.7;
    }

    &.selected {
      border-color: #388D35;
      background: #f0f9f0;
    }

    .default-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: #388D35;
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 2px;
      z-index: 2;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      i {
        font-size: 8px;
      }
    }

    .ingredient-image {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      overflow: hidden;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .removed-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(239, 68, 68, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        border-radius: 6px;
      }
    }

    .ingredient-info {
      flex: 1;

      .ingredient-name {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: #1e293b;
        line-height: 1.2;
      }

      .ingredient-price {
        display: block;
        font-size: 11px;
        color: #388D35;
        font-weight: 500;

        &.default-price {
          color: #388D35;
          font-weight: 600;
        }
      }
    }

    .ingredient-controls {
      display: flex;
      align-items: center;
      gap: 6px;

      .qty-btn {
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 4px;
        background: #f8fafc;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        transition: all 0.2s ease;

        &:hover {
          background: #388D35;
          color: white;
        }

        &.increase {
          background: #388D35;
          color: white;
        }
      }

      .quantity {
        font-size: 12px;
        font-weight: 600;
        color: #1e293b;
        min-width: 16px;
        text-align: center;
      }
    }
  }
}

.notes-section {
  margin-bottom: 1.5rem;

  .notes-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    resize: none;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #388D35;
      box-shadow: 0 0 0 2px rgba(56, 141, 53, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
}

.modifications-summary {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;

  .modifications-list {
    .modification-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;

      .modification-name {
        font-size: 13px;
        color: #0369a1;
        font-weight: 500;
      }

      .modification-detail {
        font-size: 12px;
        color: #64748b;
      }

      .modification-price {
        font-size: 13px;
        color: #388D35;
        font-weight: 600;
      }
    }
  }
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;

  .quantity-section {
    display: flex;
    align-items: center;
    gap: 12px;

    .quantity-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      background: white;
      border-radius: 6px;
      padding: 4px;

      .qty-btn {
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 4px;
        background: #f8fafc;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: #388D35;
          color: white;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .quantity-display {
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
        min-width: 20px;
        text-align: center;
      }
    }
  }

  .price-section {
    text-align: right;

    .price-breakdown {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 4px;

      .unit-price {
        font-weight: 500;
        color: #1e293b;
      }
    }

    .total-price {
      .total-label {
        font-size: 14px;
        color: #374151;
      }

      .total-amount {
        font-size: 18px;
        font-weight: 700;
        color: #388D35;
        margin-left: 8px;
      }
    }
  }

  .add-to-cart-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #388D35;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: #2f7d32;
      transform: translateY(-1px);
    }

    &:disabled {
      background: #94a3b8;
      cursor: not-allowed;
      transform: none;
    }
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .product-section {
    flex-direction: column;
    text-align: center;

    .product-image {
      align-self: center;
    }
  }

  .ingredients-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;

    .price-section {
      text-align: center;
    }

    .add-to-cart-btn {
      justify-content: center;
    }
  }
}
</style>