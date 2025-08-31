@<template>
  <div class="product-menu">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Chargement des produits...</p>
    </div>

    <!-- Products grid -->
    <div v-else class="products-grid">
      <!-- Regular products -->
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <!-- Product image -->
        <div class="product-image">
          <img :src="getProductImage(product)" :alt="product.name" class="product-img" />
          <!-- Gluten-free badge -->
          <div v-if="product.type && product.type.toLowerCase().includes('gluten')" class="gluten-badge">
            🌾
            <span>Sans gluten</span>
          </div>
        </div>

        <!-- Product info -->
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <div v-if="product.description" class="product-description">
            {{ htmlToText(product.description) }}
          </div>

          <!-- Customize button for special products -->
          <div v-if="shouldShowCustomizeButton(product)" class="customize-section">
            <button @click="handleCustomize(product)" class="customize-btn">
              
              <span>{{ getCustomizeButtonText(product) }}</span>
            </button>
          </div>

          <!-- Debug temporaire -->
          <!--  <div v-if="getSpecializedCategoryType(product) === 'salad'"
            style="font-size: 9px; color: blue; margin: 2px 0;">
            🥗 Salade détectée - Exception: {{ (product as any).exception }}
          </div> -->



          <!-- Size selection -->
          <div v-if="hasMultipleSizes(product)" class="size-selection">
            <div class="size-grid">
              <button v-for="size in getSortedProductSizes(product)" :key="size.id"
                @click="handleSizeSelection(product, size)" :class="[
                  'size-btn',
                  { 'selected': getSelectedSize(product)?.id === size.id }
                ]">
                <span class="size-name">{{ size.size }}</span>
              </button>
            </div>
          </div>

          <!-- Price and add to cart -->
          <div class="product-actions">
            <div class="price-section">
              <span class="price">{{ formatPrice(productPrices[product.id] || 0) }}</span>
              <span v-if="currentOrderType === 'delivery'" class="delivery-price-indicator">
               Prix de Livraison*
              </span>
            </div>
            <div class="action-buttons">
              <!-- Add to cart button -->
              <button @click="handleAddToCart(product)" class="add-to-cart-btn">
                
                <span>Ajouter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredProducts.length === 0 && !isPizzaCategory" class="empty-state">
        <span class="empty-icon">🔍</span>
        <h3>Aucun produit trouvé</h3>
        <p>Essayez de changer votre recherche ou la catégorie sélectionnée.</p>
      </div>
    </div>
    <AdditionalFeaturesModal
      v-if="showAdditionalModal"
      :visible="showAdditionalModal"
      :product="additionalModalProduct"
      :selectedSize="additionalModalSize"
      @close="handleAdditionalModalClose"
      @add-to-cart="handleAdditionalAddToCart"
    />
    <CreatePizzaModal
      v-if="showCreatePizzaModal"
      :visible="showCreatePizzaModal"
      :sizes="createPizzaSizes"
      :ingredients="createPizzaIngredients"
      :productId="currentPizzaProductId"
      :product="currentPizzaProduct"
      :initial-selected-size="currentPizzaSelectedSize"
      @close="handleCreatePizzaClose"
      @add-to-cart="handleCreatePizzaAddToCart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import type { Product, ProductSize, AddToCartEvent, CartIngredient, CartSupplement } from '../types'
import type { ProductModel } from '@/models/product.model'
import type { ProductSizesModel } from '@/models/productSizes.model'
import htmlToText from '@/utils/html-to-text';
import AdditionalFeaturesModal from '../modals/AdditionalFeaturesModal.vue'
import CreatePizzaModal from '../modals/CreatePizzaModal.vue'
import { INGREDIENTS_WITH_PRICING } from '../ingredients'

// Props
const props = defineProps<{
  category: string
  searchQuery: string
  products: ProductModel[]
  isLoading: boolean
}>()

// Events
const emit = defineEmits<{
  'add-to-cart': [event: AddToCartEvent]
  'customize-product': [data: { product: Product; selectedSize: ProductSize | null }]
}>()

// Store
const store = useStore()

// État local pour les tailles sélectionnées par produit
const selectedSizes = ref<{ [productId: string]: ProductSize }>({})

// IDs des catégories spécialisées
const SPECIALIZED_CATEGORY_IDS = {
  PASTA: "0f142654-3109-4dcb-89d3-6b89b8eca35e",
  SALAD: "aa5474aa-578e-4d0a-81b1-de15166a8766",
  PIZZA: "fddfda10-5cac-428b-9cb1-d6237258348c"
} as const

const PIZZA_CATEGORY_IDS = [
  "fddfda10-5cac-428b-9cb1-d6237258348c",
  "2e1e5ee6-1081-45db-85c7-421498475cd9"
]

const CATS_IDS_DONT_SHOW_SIZE: string[] = [
  // L'ID de la catégorie Pizza était ici, empêchant l'affichage des tailles.
  // Supprimé pour correspondre à la logique du site web.
  // Ajoutez d'autres catégories si nécessaire
];

// Computed
const filteredProducts = computed(() => {
  let filtered = props.products || []

  // Filtrer par catégorie
  if (props.category) {
    filtered = filtered.filter(product =>
      product.categorieID?.id === props.category
    )
  }

  // Filtrer par recherche
  if (props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase().trim()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    )
  }

  return filtered
})

const isPizzaCategory = computed(() => {
  return PIZZA_CATEGORY_IDS.includes(props.category) ||
    props.searchQuery.toLowerCase().includes('pizza')
})

// Tailles de pizza disponibles
const classicPizzaSizes = ref([
  { id: 'classic-small', size: 'Petite', price: '14.00' },
  { id: 'classic-medium', size: 'Normale', price: '16.00' },
  { id: 'classic-large', size: 'Grande', price: '28.00' }
])


const glutenFreePizzaSizes = ref([
  { id: 'gluten-free-medium', size: 'Normale', price: '18.00' }
])

// Fonctions de détection du type de produit
const getSpecializedCategoryType = (product: ProductModel): 'pasta' | 'salad' | 'pizza' | 'none' => {
  const categoryId = product.categorieID?.id

  if (!categoryId) return 'none'

  // CRUCIAL : Vérifier la clé exception comme dans le site web
  if ((product as any).exception) return 'none'

  switch (categoryId) {
    case SPECIALIZED_CATEGORY_IDS.PASTA:
      return 'pasta'
    case SPECIALIZED_CATEGORY_IDS.SALAD:
      return 'salad'
    case SPECIALIZED_CATEGORY_IDS.PIZZA:
      return 'pizza'
    default:
      // Vérification par type de produit
      if (product.type === 'Pizza') return 'pizza'
      return 'none'
  }
}

const requiresSpecializedModal = (product: ProductModel): boolean => {
  return getSpecializedCategoryType(product) !== 'none'
}

const requiresCustomization = (product: ProductModel): boolean => {
  return requiresSpecializedModal(product) ||
    (product.additionnal && product.additionnal.length > 0) ||
    product.type === 'Pizza'
}

const shouldShowCustomizeButton = (product: ProductModel): boolean => {
  return PIZZA_CATEGORY_IDS.includes(product.categorieID?.id);
}

const getCustomizeButtonText = (product: ProductModel): string => {
  const categoryType = getSpecializedCategoryType(product)

  switch (categoryType) {
    case 'pizza':
      return 'Personnaliser'
    case 'pasta':
      return 'Ajouter parmesan'
    case 'salad':
      return 'Ajouter sauces'
    default:
      return 'Personnaliser'
  }
}

const getSortedProductSizes = (product: ProductModel): ProductSizesModel[] => {
  if (!product.productSizes) return [];

  return [...product.productSizes].sort((a, b) => {
    const order = ["Petite", "Normale", "Grande"];
    const secondOrder = ["33cl", "0.5l", "1.5l"];
    const thirdOrder = ["24cm", "33cm", "40cm"];

    const compareInOrder = (orderArr: string[]) => {
      const aIndex = orderArr.indexOf(a.size);
      const bIndex = orderArr.indexOf(b.size);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    };

    return compareInOrder(order) || compareInOrder(secondOrder) || compareInOrder(thirdOrder) || a.size.localeCompare(b.size);
  });
};

// Fonctions utilitaires
const getProductImage = (product: ProductModel): string => {
  return product.image_urls?.[0] || '/imgs/products/default-product.png'
}


const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} CHF`
}

const hasMultipleSizes = (product: ProductModel): boolean => {
  return product.productSizes && product.productSizes.length > 1 &&
    !CATS_IDS_DONT_SHOW_SIZE.includes(product.categorieID?.id)
}

const getSelectedSize = (product: ProductModel): ProductSize | null => {
  const selected = selectedSizes.value[product.id]
  if (selected) {
    return selected
  }

  // Taille par défaut
  if (product.productSizes && product.productSizes.length > 0) {
    const defaultSize = product.productSizes.find(s => s.size === 'Normale') || product.productSizes[0]
    const transformedSize = transformProductSize(defaultSize)
    
    
    return transformedSize
  }

  return null
}

// Computed pour forcer la réactivité des prix
const currentOrderType = computed(() => store.getters['orderType/selectedOrderType'] || 'dine_in')

// Computed pour forcer la réactivité des prix de tous les produits
const productPrices = computed(() => {
  // Ce computed se recalcule automatiquement quand currentOrderType ou props.products changent
  const orderType = currentOrderType.value
  
  const prices: Record<string, number> = {}
  
  props.products.forEach(product => {
    const selectedSize = getSelectedSize(product)
    if (selectedSize) {
      // Utiliser le bon prix selon le type de commande actuel
      const basePrice = orderType === 'delivery' && selectedSize.priceLivraison
        ? Number(selectedSize.priceLivraison) || 0
        : Number(selectedSize.price) || 0
      
      // IMPORTANT: Ne pas ajouter le coût des ingrédients dans l'affichage du menu
      // Les ingrédients ne sont pas encore sélectionnés, on affiche juste le prix de base
      prices[product.id] = basePrice
      
    } else if (product.productSizes && product.productSizes.length > 0) {
      // Prix par défaut si pas de taille sélectionnée
      const defaultSize = transformProductSize(product.productSizes[0])
      const basePrice = orderType === 'delivery' && defaultSize.priceLivraison
        ? Number(defaultSize.priceLivraison) || 0
        : Number(defaultSize.price) || 0
      
      prices[product.id] = basePrice
    } else {
      prices[product.id] = 0
    }
  })
  
  return prices
})

// Watcher pour forcer le recalcul des prix quand le type de commande change
watch(currentOrderType, (newOrderType, oldOrderType) => {
  
}, { immediate: false })

// Watcher supplémentaire pour forcer la réactivité du computed productPrices
watch(currentOrderType, () => {
  // Forcer le recalcul du computed en touchant une propriété
  // Le computed se recalculera automatiquement grâce à la réactivité de Vue
}, { immediate: false })



const transformProductSize = (size: ProductSizesModel): ProductSize => {
  return {
    id: size.id || '',
    name: size.size,
    size: size.size,
    // IMPORTANT: Préserver les prix originaux
    price: size.price,
    priceLivraison: size.priceLivraison,
    created_at: new Date().toISOString()
  }
}

const transformProduct = (product: ProductModel): Product => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    image: getProductImage(product),
    category: product.categorieID?.id || '',
    sizes: product.productSizes?.map(transformProductSize) || [],
    ingredients: product.Ingredients?.map(ing => ({
      id: ing.id,
      name: ing.name,
      price: parseFloat(ing.extra_cost_price?.toString() || '0'),
      isDefault: ing.isDefault,
      isAvailable: ing.isAvailable,
      image: ing.imageUrl
    })) || [],
    supplements: [],
    isAvailable: product.isAvailable,
    isPopular: product.isVedette,
    type: product.type,
    withoutGluten: product.isSelected, // Assuming this field represents gluten-free
    additionnal: product.additionnal
  }
}

// Gestionnaires d'événements
const handleSizeSelection = (product: ProductModel, size: ProductSizesModel) => {
  selectedSizes.value[product.id] = transformProductSize(size)
}

const handleCustomize = (product: ProductModel) => {
  const transformedProduct = transformProduct(product)
  const selectedSize = getSelectedSize(product)
  

  
  // Émettre un objet contenant le produit et la taille sélectionnée (prix originaux)
  emit('customize-product', {
    product: transformedProduct,
    selectedSize: selectedSize
  })
}

const handleQuickAdd = (product: ProductModel) => {

  const transformedProduct = transformProduct(product)
  const selectedSize = getSelectedSize(product)

  if (selectedSize) {
    
    
    // IMPORTANT: Ne pas modifier le prix, garder les données originales
    // Le prix sera calculé dynamiquement dans le store cart selon le type de commande
    
    
    // Créer l'événement AddToCartEvent avec les prix originaux
    const addToCartEvent: AddToCartEvent = {
      product: transformedProduct,
      size: selectedSize, // Prix originaux préservés
      quantity: 1,
      ingredients: [],
      supplements: [],
      notes: ''
    }
   
    
    emit('add-to-cart', addToCartEvent)
  }
}

const showAdditionalModal = ref(false)
const additionalModalProduct = ref<any>(null)
const additionalModalSize = ref<any>(null)

const showCreatePizzaModal = ref(false)
// Tailles de pizza récupérées dynamiquement des produits pizza existants
const createPizzaSizes = ref<ProductSize[]>([])
const createPizzaIngredients = ref(INGREDIENTS_WITH_PRICING.map(ing => ({
  id: ing.id,
  name: ing.name,
  price: ing.pricing['33cm'] || 0,
  image: ing.imageUrl,
  selected: !!ing.isDefault
})))

// Ajouter ref pour l'ID du produit Pizza sélectionné
const currentPizzaProductId = ref('')

// Produit Pizza sélectionné
const currentPizzaProduct = ref<ProductModel | null>(null)

// Taille sélectionnée pour la pizza personnalisée
const currentPizzaSelectedSize = ref<ProductSize | null>(null)


function handleAddToCart(product: ProductModel) {
  const specializedType = getSpecializedCategoryType(product);
  const isGlutenFreePizza = product.name.toLowerCase().includes('gluten');
  const selectedSize = getSelectedSize(product)


  // Détection stricte par id de catégorie pour la pizza personnalisée
  if (product.categorieID?.id === 'fd4a2c4e-49ef-48a5-9937-6f3a51122f9e') {
    showCreatePizzaModal.value = true
    currentPizzaProductId.value = product.id // stocker l'id du produit cliqué (classic ou sans gluten)
    currentPizzaSelectedSize.value = selectedSize // stocker la taille sélectionnée
    
    // Reset ingrédients sélectionnés à chaque ouverture
    createPizzaIngredients.value = INGREDIENTS_WITH_PRICING.map(ing => ({
      id: ing.id,
      name: ing.name,
      price: ing.pricing['33cm'] || 0,
      image: ing.imageUrl,
      selected: !!ing.isDefault
    }))
    currentPizzaProduct.value = product
    return
  }

  // Si le produit a des options additionnelles
  if (product.additionnal && product.additionnal.length > 0) {
    additionalModalProduct.value = transformProduct(product)
    additionalModalSize.value = selectedSize
    showAdditionalModal.value = true
    return
  }

  if (specializedType === 'pizza' && !isGlutenFreePizza) {
    handleCustomize(product);
  } else if (specializedType === 'pasta' || specializedType === 'salad') {
    // Pour les pastas et salades, vérifier s'ils ont des options additionnelles
    if (product.additionnal && product.additionnal.length > 0) {
      handleCustomize(product);
    } else {
      handleQuickAdd(product);
    }
  } else {
    handleQuickAdd(product);
  }
}

function handleAdditionalModalClose() {
  showAdditionalModal.value = false
  additionalModalProduct.value = null
  additionalModalSize.value = null
}

function handleAdditionalAddToCart(event: any) {
 
  
  emit('add-to-cart', {
    product: event.product,
    size: event.size,
    quantity: event.quantity,
    ingredients: event.product.ingredients?.filter(ing => ing.isDefault).map(ing => ({
      id: ing.id,
      name: ing.name,
      extra_cost_price: ing.price,
      quantity: 1,
      isDefault: ing.isDefault
    })) || [],
    supplements: [],
    additionnal: event.additionnal,
    notes: event.notes || ''
  })
  handleAdditionalModalClose()
}

function handleCreatePizzaAddToCart(event: AddToCartEvent) {

  
  emit('add-to-cart', event)
  showCreatePizzaModal.value = false
}
function handleCreatePizzaClose() {
  showCreatePizzaModal.value = false
  currentPizzaSelectedSize.value = null
}

const getSizeInCm = (size: string): string => {
  const sizeMap: { [key: string]: string } = {
    'Petite': '24cm',
    'Normale': '33cm',
    'Grande': '40cm'
  }
  return sizeMap[size] || '33cm'
}

// Extraire les tailles de pizza des produits existants
const extractPizzaSizesFromProducts = (products: ProductModel[]) => {
  // Chercher un produit pizza avec des tailles
  const pizzaProduct = products.find(product => 
    PIZZA_CATEGORY_IDS.includes(product.categorieID?.id) && 
    product.productSizes && 
    product.productSizes.length > 0
  )
  
  if (pizzaProduct && pizzaProduct.productSizes) {
    createPizzaSizes.value = pizzaProduct.productSizes.map(transformProductSize)
  }
}

// Watcher pour forcer la réactivité quand les produits changent
watch(() => props.products, (newProducts) => {
  if (newProducts) {
    // Extraire les tailles de pizza
    extractPizzaSizesFromProducts(newProducts)
    
    // Initialiser les tailles sélectionnées
    newProducts.forEach(product => {
      if (!selectedSizes.value[product.id] && product.productSizes && product.productSizes.length > 0) {
        const defaultSize = product.productSizes.find(s => s.size === 'Normale') || product.productSizes[0]
        selectedSizes.value[product.id] = transformProductSize(defaultSize)
      }
    })
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.product-menu {
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #388D35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding-bottom: 1rem;
}

.pizza-creation-section {
  grid-column: 1 / -1;
  /* Span across all columns */
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .pizza-creation-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
    text-align: center;
  }

  .pizza-types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .pizza-creation-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-5px);
    }

    .pizza-creation-image {
      width: 100%;
      height: 180px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f0f9eb;

      .pizza-creation-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .gluten-free-badge-creation {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #22c55e;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    }

    .pizza-creation-info {
      padding: 1rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .pizza-creation-name {
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.5rem;
      }

      .pizza-creation-description {
        color: #64748b;
        font-size: 0.875rem;
        margin-bottom: 1rem;
        line-height: 1.4;
      }

      .pizza-size-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .pizza-size-btn {
        padding: 0.5rem 1rem;
        background: #388D35;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover {
          background: #2d7a2a;
        }
      }
    }
  }
}

.product-card {
  background: white;
  border-radius: 10px;
  padding: 0.75rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }
}

.product-image {
  position: relative;
  width: 100%;
  height: 160px;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .product-img {
    width: 80%;
    height: 80%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover .product-img {
    transform: scale(1.05);
  }

  .gluten-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #22c55e;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
  line-height: 1.3;
}

.product-description {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
  flex-shrink: 0;
}

.customize-section {
  margin: 0.25rem 0;

  .customize-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.4rem 0.6rem;
    background: transparent;
    border: 1px solid #388D35;
    border-radius: 6px;
    color: #388D35;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    justify-content: center;

    &:hover {
      background: #388D35;
      color: white;
    }
  }
}

.size-selection {
  .size-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
    gap: 0.5rem;
  }

  .size-btn {
    padding: 0.5rem 0.25rem;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.75rem;
    text-align: center;

    &:hover {
      border-color: #388D35;
      color: #388D35;
    }

    &.selected {
      border-color: #388D35;
      background: #388D35;
      color: white;
    }

    .size-name {
      font-weight: 500;
    }
  }
}

.product-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #388D35;
  }

  .delivery-price-indicator {
    font-size: 0.65rem;
    color: #64748b;
    font-weight: 500;
  }
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;

  .quick-add-btn {
    width: 40px;
    height: 40px;
    border: 1px solid #388D35;
    background: white;
    color: #388D35;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover:not(:disabled) {
      background: #388D35;
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .add-to-cart-btn {
    flex: 1;
    padding: 0.75rem 1rem;
    background: #388D35;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    font-size: 14px;

    &:hover:not(:disabled) {
      background: #2d7a2a;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #9ca3af;
    }
  }
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;

  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
    color: #374151;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .pizza-creation-section {
    .pizza-types-grid {
      grid-template-columns: 1fr;
    }
  }

  .product-card {
    padding: 0.75rem;
  }

  .product-image {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  .empty-icon {
    font-size: 3rem;
    display: block;
    text-align: center;
    margin-bottom: 1rem;
  }
}
</style>