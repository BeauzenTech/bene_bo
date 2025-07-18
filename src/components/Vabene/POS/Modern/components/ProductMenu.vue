<template>
  <div class="product-menu">
    <!-- En-tête avec titre de la catégorie -->
    <div class="menu-header">
      <h2 class="menu-title">{{ getCategoryTitle(category) }} Menu</h2>
    </div>

    <!-- Grille des produits -->
    <div class="product-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="product-card"
      >
        <!-- Image du produit -->
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
          <div v-if="product.isPopular" class="popular-badge">
            <i class="fas fa-fire"></i>
          </div>
        </div>

        <!-- Informations du produit -->
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          
          <!-- Prix et contrôles -->
          <div class="product-footer">
            <div class="product-price">
              <span class="currency">$</span>
              <span class="price">{{ getBasePrice(product) }}</span>
            </div>
            
            <!-- Contrôles de quantité -->
            <div class="quantity-controls">
              <button 
                class="quantity-btn decrease"
                @click="decreaseQuantity(product.id)"
                :disabled="getProductQuantity(product.id) === 0"
              >
                <i class="fas fa-minus"></i>
              </button>
              
              <span class="quantity">{{ getProductQuantity(product.id) }}</span>
              
              <button 
                class="quantity-btn increase"
                @click="increaseQuantity(product)"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loader ou message vide -->
    <div v-if="filteredProducts.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-search"></i>
      </div>
      <h3>Aucun produit trouvé</h3>
      <p>Essayez de changer de catégorie ou de recherche</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Product, AddToCartEvent, ProductSize } from '../types'

interface Props {
  category: string
  searchQuery: string
}

const props = defineProps<Props>()

defineEmits<{
  'add-to-cart': [event: AddToCartEvent]
}>()

// État local
const products = ref<Product[]>([])
const productQuantities = ref<Record<string, number>>({})

// Données mockées pour la démo (en production, ceci viendrait d'une API)
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pasta Bolognese',
    description: 'Delicious beef lasagna with double chili Delicious beef',
    image: '/images/pasta-bolognese.jpg',
    category: 'lunch',
    sizes: [
      { id: 's1', name: 'Small', price: '45.5', priceLivraison: '47.5' },
      { id: 'm1', name: 'Medium', price: '50.5', priceLivraison: '52.5' },
      { id: 'l1', name: 'Large', price: '55.5', priceLivraison: '57.5' }
    ],
    ingredients: [],
    supplements: [],
    isAvailable: true,
    isPopular: true
  },
  {
    id: '2',
    name: 'Spicy Fried Chicken',
    description: 'Delicious beef lasagna with double chili Delicious beef',
    image: '/images/spicy-chicken.jpg',
    category: 'lunch',
    sizes: [
      { id: 's2', name: 'Small', price: '40.7', priceLivraison: '42.7' },
      { id: 'm2', name: 'Medium', price: '45.7', priceLivraison: '47.7' },
      { id: 'l2', name: 'Large', price: '50.7', priceLivraison: '52.7' }
    ],
    ingredients: [],
    supplements: [],
    isAvailable: true
  },
  {
    id: '3',
    name: 'Grilled Steak',
    description: 'Delicious beef lasagna with double chili Delicious beef',
    image: '/images/grilled-steak.jpg',
    category: 'lunch',
    sizes: [
      { id: 's3', name: 'Small', price: '75.0', priceLivraison: '77.0' },
      { id: 'm3', name: 'Medium', price: '80.0', priceLivraison: '82.0' },
      { id: 'l3', name: 'Large', price: '85.0', priceLivraison: '87.0' }
    ],
    ingredients: [],
    supplements: [],
    isAvailable: true
  },
  {
    id: '4',
    name: 'Fish And Chips',
    description: 'Delicious beef lasagna with double chili Delicious beef',
    image: '/images/fish-chips.jpg',
    category: 'lunch',
    sizes: [
      { id: 's4', name: 'Small', price: '85.4', priceLivraison: '87.4' },
      { id: 'm4', name: 'Medium', price: '90.4', priceLivraison: '92.4' },
      { id: 'l4', name: 'Large', price: '95.4', priceLivraison: '97.4' }
    ],
    ingredients: [],
    supplements: [],
    isAvailable: true
  },
  {
    id: '5',
    name: 'Beef Bourguignon',
    description: 'Delicious beef lasagna with double chili Delicious beef',
    image: '/images/beef-bourguignon.jpg',
    category: 'lunch',
    sizes: [
      { id: 's5', name: 'Small', price: '70.5', priceLivraison: '72.5' },
      { id: 'm5', name: 'Medium', price: '75.5', priceLivraison: '77.5' },
      { id: 'l5', name: 'Large', price: '80.5', priceLivraison: '82.5' }
    ],
    ingredients: [],
    supplements: [],
    isAvailable: true
  },
  {
    id: '6',
    name: 'Spaghetti Carbonara',
    description: 'Delicious beef lasagna with double chili Delicious beef',
    image: '/images/spaghetti-carbonara.jpg',
    category: 'lunch',
    sizes: [
      { id: 's6', name: 'Small', price: '30.3', priceLivraison: '32.3' },
      { id: 'm6', name: 'Medium', price: '35.3', priceLivraison: '37.3' },
      { id: 'l6', name: 'Large', price: '40.3', priceLivraison: '42.3' }
    ],
    ingredients: [],
    supplements: [],
    isAvailable: true
  },
  {
    id: '7',
    name: 'Ratatouille',
    description: 'Delicious beef lasagna with double chili Delicious beef',
    image: '/images/ratatouille.jpg',
    category: 'lunch',
    sizes: [
      { id: 's7', name: 'Small', price: '21.7', priceLivraison: '23.7' },
      { id: 'm7', name: 'Medium', price: '26.7', priceLivraison: '28.7' },
      { id: 'l7', name: 'Large', price: '31.7', priceLivraison: '33.7' }
    ],
    ingredients: [],
    supplements: [],
    isAvailable: true
  },
  {
    id: '8',
    name: 'Kimchi Jjigae',
    description: 'Delicious beef lasagna with double chili Delicious beef',
    image: '/images/kimchi-jjigae.jpg',
    category: 'lunch',
    sizes: [
      { id: 's8', name: 'Small', price: '40.7', priceLivraison: '42.7' },
      { id: 'm8', name: 'Medium', price: '45.7', priceLivraison: '47.7' },
      { id: 'l8', name: 'Large', price: '50.7', priceLivraison: '52.7' }
    ],
    ingredients: [],
    supplements: [],
    isAvailable: true
  },
  {
    id: '9',
    name: 'Tofu Scramble',
    description: 'Delicious beef lasagna with double chili Delicious beef',
    image: '/images/tofu-scramble.jpg',
    category: 'lunch',
    sizes: [
      { id: 's9', name: 'Small', price: '80.6', priceLivraison: '82.6' },
      { id: 'm9', name: 'Medium', price: '85.6', priceLivraison: '87.6' },
      { id: 'l9', name: 'Large', price: '90.6', priceLivraison: '92.6' }
    ],
    ingredients: [],
    supplements: [],
    isAvailable: true
  }
]

// Computed
const filteredProducts = computed(() => {
  let filtered = products.value.filter(product => product.category === props.category)
  
  if (props.searchQuery) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(props.searchQuery.toLowerCase())
    )
  }
  
  return filtered
})

// Méthodes
const getCategoryTitle = (category: string): string => {
  const titles: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    soup: 'Soup',
    desserts: 'Desserts',
    sidedish: 'Side Dish',
    appetizer: 'Appetizer',
    beverages: 'Beverages'
  }
  return titles[category] || 'Menu'
}

const getBasePrice = (product: Product): string => {
  if (product.sizes.length > 0) {
    return product.sizes[0].price
  }
  return '0.00'
}

const getProductQuantity = (productId: string): number => {
  return productQuantities.value[productId] || 0
}

const increaseQuantity = (product: Product) => {
  const currentQuantity = getProductQuantity(product.id)
  productQuantities.value[product.id] = currentQuantity + 1
  
  // Si c'est la première fois qu'on ajoute ce produit, l'ajouter au panier
  if (currentQuantity === 0) {
    addToCart(product)
  }
}

const decreaseQuantity = (productId: string) => {
  const currentQuantity = getProductQuantity(productId)
  if (currentQuantity > 0) {
    productQuantities.value[productId] = currentQuantity - 1
  }
}

const addToCart = (product: Product) => {
  // Pour la simplicité, on utilise la première taille disponible
  const defaultSize = product.sizes[0]
  
  const event: AddToCartEvent = {
    product,
    size: defaultSize,
    quantity: 1,
    ingredients: [],
    supplements: [],
    notes: ''
  }
  
  // Émettre l'événement vers le parent
  // emit('add-to-cart', event)
}

// Lifecycle
onMounted(() => {
  products.value = mockProducts
})
</script>

<style lang="scss" scoped>
.product-menu {
  .menu-header {
    margin-bottom: 2rem;
    
    .menu-title {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .product-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      border-color: #3b82f6;
    }
  }

  .product-image {
    position: relative;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .popular-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #ef4444;
      color: white;
      padding: 6px 8px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .product-card:hover .product-image img {
    transform: scale(1.05);
  }

  .product-info {
    padding: 1.5rem;

    .product-name {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
      line-height: 1.3;
    }

    .product-description {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 1.5rem 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .product-price {
        display: flex;
        align-items: baseline;
        gap: 2px;

        .currency {
          font-size: 16px;
          font-weight: 600;
          color: #3b82f6;
        }

        .price {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #f8fafc;
        border-radius: 12px;
        padding: 8px;

        .quantity-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          background: white;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;

          &:hover:not(:disabled) {
            background: #3b82f6;
            color: white;
            transform: scale(1.1);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          &.increase {
            background: #3b82f6;
            color: white;

            &:hover {
              background: #2563eb;
            }
          }
        }

        .quantity {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          min-width: 20px;
          text-align: center;
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #64748b;

    .empty-icon {
      font-size: 48px;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    h3 {
      font-size: 20px;
      margin: 0 0 8px 0;
      color: #1e293b;
    }

    p {
      margin: 0;
      font-size: 14px;
    }
  }
}

@media (max-width: 768px) {
  .product-menu {
    .product-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .product-card {
      .product-image {
        height: 160px;
      }

      .product-info {
        padding: 1rem;

        .product-name {
          font-size: 16px;
        }

        .product-description {
          font-size: 13px;
        }

        .product-footer {
          .product-price {
            .price {
              font-size: 18px;
            }
          }

          .quantity-controls {
            gap: 8px;
            padding: 6px;

            .quantity-btn {
              width: 28px;
              height: 28px;
            }

            .quantity {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .product-menu {
    .product-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 