<template>
  <div v-if="product" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- En-tête -->
      <div class="modal-header">
        <h2 class="modal-title">Personnaliser votre produit</h2>
        <button @click="closeModal" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Corps de la modale -->
      <div class="modal-body">
        <!-- Section produit -->
        <div class="product-section">
          <div class="product-image">
            <img :src="product.image || '/images/default-product.jpg'" :alt="product.name" />
          </div>
          <div class="product-details">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ getProductDescription() }}</p>
            <div class="product-price">{{ formatPrice(basePrice) }}</div>
          </div>
        </div>

        <!-- Sélection de la taille -->
        <div class="size-selection">
          <label v-for="size in sortedSizes" :key="size.id" class="size-option"
            :class="{ 'selected': selectedSize?.id === size.id }">
            <input type="radio" :value="size.id" v-model="selectedSizeId" @change="selectSize(size)" />
            <span>{{ size.name }}</span>
          </label>
        </div>

        <!-- Sections d'ingrédients -->
        <div class="ingredients-container">
          <div v-for="(group, groupName) in groupedIngredients" :key="groupName" class="ingredient-group">
            <h4 class="group-title">{{ groupName }}</h4>
            <div class="ingredients-grid">
              <div v-for="ingredient in group" :key="ingredient.id" class="ingredient-card">
                <div class="ingredient-card-image">
                  <img :src="ingredient.imageUrl" :alt="ingredient.name" />
                </div>
                <span class="ingredient-name">{{ ingredient.name }}</span>
                <div class="ingredient-controls">
                  <button @click="decrementIngredient(ingredient)" :disabled="getIngredientQuantity(ingredient.id) <= 0"
                    style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; color: white; font-size: .6rem; font-weight: 600; cursor: pointer;">
                    ➖
                  </button>
                  <span>{{ getIngredientQuantity(ingredient.id) }}</span>
                  <button @click="incrementIngredient(ingredient)"
                    style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; color: white; font-size: .6rem; font-weight: 600; cursor: pointer;">
                    ➕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pied de page -->
      <div class="modal-footer">
        <div class="quantity-selector">
          <span>Quantité:</span>
          <div class="quantity-controls">
            <button @click="quantity--" :disabled="quantity <= 1">➖</button>
            <span>{{ quantity }}</span>
            <button @click="quantity++">➕</button>
          </div>
        </div>
        <button class="add-to-cart-btn" @click="handleAddToCart">
          Ajouter au panier - {{ formatPrice(totalPrice) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Product, ProductSize, AddToCartEvent, CartIngredient } from '../types';
import { INGREDIENTS_WITH_PRICING, IngredientWithPricing } from '../ingredients';

// Props
const props = defineProps<{
  product: Product | null;
}>();

// Events
const emit = defineEmits<{
  close: [];
  'add-to-cart': [event: AddToCartEvent];
}>();

// État local
const selectedSizeId = ref<string>('');
const selectedSize = ref<ProductSize | null>(null);
const quantity = ref(1);
const customIngredients = ref<Record<string, number>>({});

// Fonctions utilitaires
const formatPrice = (price: number): string => `${price.toFixed(2)} CHF`;

const getProductDescription = (): string => {
  if (!props.product?.description) return '';
  return props.product.description.replace(/<[^>]*>/g, '').trim();
};

// Logique des tailles
const sortedSizes = computed(() => {
  if (!props.product?.sizes) return [];
  return [...props.product.sizes].sort((a, b) => {
    const order = ["Petite", "Normale", "Grande"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });
});

const selectSize = (size: ProductSize) => {
  selectedSize.value = size;
  selectedSizeId.value = size.id;
};

// Logique des ingrédients
const groupedIngredients = computed(() => {
  const groups: Record<string, IngredientWithPricing[]> = {};
  INGREDIENTS_WITH_PRICING
    .filter(ing => ing.type !== 'base') // Exclure les ingrédients de base
    .forEach(ing => {
      if (!groups[ing.type]) {
        groups[ing.type] = [];
      }
      groups[ing.type].push(ing);
    });
  return groups;
});

const getIngredientQuantity = (ingredientId: string): number => {
  return customIngredients.value[ingredientId] || 0;
};

const incrementIngredient = (ingredient: IngredientWithPricing) => {
  const currentQty = getIngredientQuantity(ingredient.id);
  customIngredients.value[ingredient.id] = (currentQty || 0) + 1;
};

const decrementIngredient = (ingredient: IngredientWithPricing) => {
  const currentQty = getIngredientQuantity(ingredient.id);
  if (currentQty > 0) {
    customIngredients.value[ingredient.id] = currentQty - 1;
  }
};

// Logique des prix
const basePrice = computed(() => {
  return selectedSize.value ? parseFloat(selectedSize.value.price) : 0;
});

const ingredientsPrice = computed(() => {
  let price = 0;
  if (selectedSize.value) {
    const sizeMap: Record<string, '24cm' | '33cm' | '40cm'> = {
      'Petite': '24cm',
      'Normale': '33cm',
      'Grande': '40cm'
    };
    const currentSize = sizeMap[selectedSize.value.name];

    for (const ingId in customIngredients.value) {
      const quantity = customIngredients.value[ingId];
      if (quantity > 0) {
        const ingredient = INGREDIENTS_WITH_PRICING.find(i => i.id === ingId);
        if (ingredient && !ingredient.isDefault) {
          price += (ingredient.pricing[currentSize] || 0) * quantity;
        }
      }
    }
  }
  return price;
});

const totalPrice = computed(() => {
  return (basePrice.value + ingredientsPrice.value) * quantity.value;
});

// Actions
const closeModal = () => emit('close');

const handleAddToCart = () => {
  if (!props.product || !selectedSize.value) return;

  const finalIngredients: CartIngredient[] = Object.entries(customIngredients.value)
    .filter(([, quantity]) => quantity > 0)
    .map(([id, quantity]) => {
      const ingredientInfo = INGREDIENTS_WITH_PRICING.find(i => i.id === id)!;
      const originalIngredient = props.product!.ingredients.find(i => i.id === id);

      // Mapping des tailles vers la notation en cm
      const sizeMap: Record<string, '24cm' | '33cm' | '40cm'> = {
        'Petite': '24cm',
        'Normale': '33cm',
        'Grande': '40cm'
      };
      const currentSizeInCm = sizeMap[selectedSize.value!.name] || '33cm';
      
      return {
        id: ingredientInfo.id,
        name: ingredientInfo.name,
        extra_cost_price: ingredientInfo.pricing[currentSizeInCm] || 0,
        quantity,
        isDefault: originalIngredient?.isDefault || ingredientInfo.isDefault || false,
        size: currentSizeInCm
      };
    });

  const event: AddToCartEvent = {
    product: props.product,
    size: selectedSize.value,
    quantity: quantity.value,
    ingredients: finalIngredients,
    supplements: [],
    notes: ''
  };

  emit('add-to-cart', event);
  closeModal();
};

// Watchers
watch(() => props.product, (newProduct) => {
  if (newProduct?.sizes) {
    const defaultSize = newProduct.sizes.find(s => s.name === 'Normale') || newProduct.sizes[0];
    if (defaultSize) {
      selectSize(defaultSize);
    }
  }

  // Initialiser avec les ingrédients par défaut du produit
  const defaultIngredients: Record<string, number> = {};
  if (newProduct?.ingredients) {
    newProduct.ingredients.forEach(ing => {
      if (ing.isDefault) {
        defaultIngredients[ing.id] = 1;
      }
    });
  }
  customIngredients.value = defaultIngredients;
}, { immediate: true });
</script>

<style lang="scss" scoped>
/* Styles globaux pour la modale */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

/* Section produit */
.product-section {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  .product-image img {
    width: 150px;
    height: 150px;
    border-radius: 8px;
    object-fit: cover;
  }

  .product-details {
    .product-name {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    .product-description {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .product-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #388D35;
    }
  }
}

/* Sélection de taille */
.size-selection {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .size-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 20px;
    cursor: pointer;

    &.selected {
      background-color: #388D35;
      color: white;
      border-color: #388D35;
    }

    input {
      display: none;
    }
  }
}

/* Actions des ingrédients */
.ingredient-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .action-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: 1px solid #388D35;
    background-color: white;
    color: #388D35;
    font-weight: 500;
    cursor: pointer;

    &.add {
      background-color: #388D35;
      color: white;
    }
  }
}

/* Grille d'ingrédients */
.ingredients-container {
  .ingredient-group {
    margin-bottom: 1.5rem;

    .group-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      text-transform: capitalize;
    }

    .ingredients-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
    }
  }
}

.ingredient-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;

  .ingredient-card-image img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  .ingredient-name {
    font-weight: 500;
  }

  .ingredient-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    button {
      width: 24px;
      height: 24px;
      border: 1px solid #ccc;
      border-radius: 50%;
      background: white;
      cursor: pointer;
    }
  }
}

/* Pied de page */
.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 1rem;

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      button {
        width: 30px;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    }
  }

  .add-to-cart-btn {
    padding: 0.75rem 1.5rem;
    background-color: #388D35;
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
}
</style>