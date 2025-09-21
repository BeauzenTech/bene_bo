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

        <!-- Information sur le fonctionnement -->
        <div class="ingredients-info">
          <div class="info-item">
            <i class="fas fa-check-circle" style="color: #388D35;"></i>
            <span>Les ingrédients marqués "Inclus" viennent avec la pizza</span>
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
        <!-- <div class="customize-mode">
          <button :class="['mode-btn', { active: customizeMode === 'add' }]" @click="customizeMode = 'add'">
            <i class="fas fa-plus"></i>
            Ajouter
          </button>
          <button :class="['mode-btn', { active: customizeMode === 'remove' }]" @click="customizeMode = 'remove'">
            <i class="fas fa-minus"></i>
            Retirer
          </button>
        </div> -->

        <!-- Sections d'ingrédients -->
        <div class="ingredients-container">
          <div v-for="(group, groupName) in groupedIngredients" :key="groupName" class="ingredient-group">
            <h4 class="group-title">{{ groupName }}</h4>
            <div class="ingredients-grid">
              <div v-for="ingredient in group" :key="ingredient.id" 
                :class="['ingredient-card', { 
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

                <div class="ingredient-card-image">
                  <img :src="ingredient.imageUrl || ingredient.image || '/images/ingredients/default.png'" :alt="ingredient.name" />
                  <!-- Overlay pour ingrédient retiré -->
                  <div v-if="ingredient.isDefault && getIngredientQuantity(ingredient.id) === 0" class="removed-overlay">
                    <i class="fas fa-times"></i>
                  </div>
                </div>
                <span class="ingredient-name">{{ ingredient.name }}</span>
                <span v-if="ingredient.isDefault" class="ingredient-price default-price">Inclus</span>
                
                <!-- Contrôles pour les ingrédients de base (croix de retrait) -->
                <div v-if="ingredient.isDefault" class="ingredient-base-controls">
                  <button @click.stop="removeBaseIngredient(ingredient)" 
                    @mousedown.stop
                    @mouseup.stop
                    class="remove-base-btn"
                    title="Retirer cet ingrédient"
                    style="z-index: 1000; position: relative;">
                    x
                  </button>
                </div>
                
                <!-- Contrôles pour les autres ingrédients (quantité) -->
                <div v-else class="ingredient-controls">
                  <button @click.stop="decrementIngredient(ingredient)" :disabled="getIngredientQuantity(ingredient.id) <= 0"
                    style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; color: white; font-size: .6rem; font-weight: 600; cursor: pointer;">
                    ➖
                  </button>
                  <span>{{ getIngredientQuantity(ingredient.id) }}</span>
                  <button @click.stop="incrementIngredient(ingredient)"
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
          <!-- <span>Quantité:</span>
          <div class="quantity-controls">
            <button @click="quantity--" :disabled="quantity <= 1">➖</button>
            <span>{{ quantity }}</span>
            <button @click="quantity++">➕</button>
          </div> -->
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
import { useStore } from 'vuex';
import type { Product, ProductSize, AddToCartEvent, CartIngredient } from '../types';
import { INGREDIENTS_WITH_PRICING, IngredientWithPricing } from '../ingredients';

const store = useStore();

// Props
const props = defineProps<{
  product: Product | null;
  initialSelectedSize?: ProductSize | null;
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
const customizeMode = ref<'add' | 'remove'>('add');
const removedBaseIngredients = ref<Set<string>>(new Set());

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
const baseIngredients = computed(() => {
  // Récupérer les ingrédients de base depuis ingredientsBaseNames
  const product = props.product as any;
  if (product?.ingredientsBaseNames && product.ingredientsBaseNames.length > 0) {
    
    // Créer des objets ingrédients à partir des noms
    const baseIngs = product.ingredientsBaseNames.map((name: string, index: number) => ({
      id: `base-${index}`,
      name: name,
      isDefault: true,
      isAvailable: true,
      price: 0,
      type: 'Base',
      image: '/images/ingredients/default.png',
      imageUrl: '/images/ingredients/default.png'
    }));
    
    return baseIngs;
  }
  return [];
});

const groupedIngredients = computed(() => {
  const groups: Record<string, any[]> = {};
  
  // Si on a des ingrédients de base depuis la base de données, on les affiche dans le groupe "Base"
  if (baseIngredients.value.length > 0) {
    const nonRemovedBaseIngredients = baseIngredients.value.filter(ing => !removedBaseIngredients.value.has(ing.id));

    if (nonRemovedBaseIngredients.length > 0) {
      groups['Base'] = nonRemovedBaseIngredients;
    }
  }
  
  // TOUJOURS ajouter les autres ingrédients de INGREDIENTS_WITH_PRICING (sauf les "Base")
  // Que ce soit avec ou sans ingrédients de base spécifiques
  INGREDIENTS_WITH_PRICING
    .filter(ing => ing.isAvailable && ing.type !== 'Base')
    .forEach(ing => {
      if (!groups[ing.type]) {
        groups[ing.type] = [];
      }
      groups[ing.type].push(ing);
    });
  
  return groups;
});

const getIngredientQuantity = (ingredientId: string): number => {
  // Pour les ingrédients de base, la quantité par défaut est 1
  if (ingredientId.startsWith('base-')) {
    return customIngredients.value[ingredientId] || 1;
  }
  // Pour les autres ingrédients, la quantité par défaut est 0
  return customIngredients.value[ingredientId] || 0;
};

const incrementIngredient = (ingredient: any) => {
  const currentQty = getIngredientQuantity(ingredient.id);
  customIngredients.value[ingredient.id] = (currentQty || 0) + 1;
};

const decrementIngredient = (ingredient: any) => {
  const currentQty = getIngredientQuantity(ingredient.id);
  if (currentQty > 0) {
    customIngredients.value[ingredient.id] = currentQty - 1;
  }
};

const toggleIngredient = (ingredient: any) => {
  const currentQty = getIngredientQuantity(ingredient.id);

  if (customizeMode.value === 'add') {
    // Mode ajouter : ajouter l'ingrédient s'il n'est pas déjà présent
    if (ingredient.isDefault) {
      // Pour les ingrédients de base, on ajoute 1 à la quantité par défaut
      customIngredients.value[ingredient.id] = currentQty + 1;
    } else {
      // Pour les autres ingrédients, on ajoute 1
      customIngredients.value[ingredient.id] = currentQty > 0 ? currentQty + 1 : 1;
    }
  } else {
    // Mode retirer : retirer l'ingrédient (même les ingrédients par défaut)
    if (ingredient.isDefault) {
      // Pour les ingrédients de base, on peut les retirer complètement
      customIngredients.value[ingredient.id] = 0;
    } else {
      // Pour les autres ingrédients, on les retire
      customIngredients.value[ingredient.id] = 0;
    }
  }
};

const removeBaseIngredient = (ingredient: any) => {
  
  // Ajouter l'ID de l'ingrédient à la liste des ingrédients retirés
  if (ingredient.isDefault) {
    removedBaseIngredients.value.add(ingredient.id);
    
    // Supprimer complètement l'ingrédient de customIngredients au lieu de mettre à 0
    delete customIngredients.value[ingredient.id];
  }
  
};

// Logique des prix
const basePrice = computed(() => {
  if (!selectedSize.value) return 0;
  
  // Utiliser le prix de livraison si le type de commande est 'delivery'
  const isDelivery = store.getters['orderType/isDelivery'];
  return isDelivery && selectedSize.value.priceLivraison 
    ? parseFloat(selectedSize.value.priceLivraison) 
    : parseFloat(selectedSize.value.price);
});

const ingredientsPrice = computed(() => {
  let price = 0;
  if (selectedSize.value) {
    for (const ingId in customIngredients.value) {
      const quantity = customIngredients.value[ingId];
      if (quantity > 0) {
        // Chercher l'ingrédient dans les ingrédients du produit d'abord
        let ingredient: any = props.product?.ingredients?.find(i => i.id === ingId);
        
        // Si pas trouvé, chercher dans INGREDIENTS_WITH_PRICING
        if (!ingredient) {
          ingredient = INGREDIENTS_WITH_PRICING.find(i => i.id === ingId);
        }
        
        if (ingredient && !ingredient.isDefault) {
          // Si l'ingrédient a un prix direct
          if (typeof ingredient.price === 'number') {
            price += ingredient.price * quantity;
          } else if ((ingredient as any).pricing) {
            // Si l'ingrédient a un pricing par taille
            const sizeMap: Record<string, '24cm' | '28cm' | '33cm' | '40cm'> = {
              'Petite': '24cm',
              'Normale': '33cm',
              'Grande': '40cm',
              'Unique (28cm)': '28cm'
            };
            const currentSize = sizeMap[selectedSize.value.name] || '33cm';
            const ingredientPrice = ((ingredient as any).pricing[currentSize] || 0) * quantity;
            price += ingredientPrice;
          }
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
    price: selectedSize.value.price,
    priceLivraison: selectedSize.value.priceLivraison
  }


  // Créer la liste finale des ingrédients
  const finalIngredients: CartIngredient[] = [];
  const removedIngredients: CartIngredient[] = [];
  
  const sizeMap: Record<string, '24cm' | '28cm' | '33cm' | '40cm'> = {
    'Petite': '24cm',
    'Normale': '33cm',
    'Grande': '40cm',
    'Unique (28cm)': '28cm'
  };
  const currentSizeInCm = sizeMap[selectedSize.value!.name] || '33cm';
  
  // 1. Traiter les ingrédients de base
  if (baseIngredients.value.length > 0) {
    // Ingrédients de base retirés
    removedBaseIngredients.value.forEach(removedId => {
      const removedIngredient = baseIngredients.value.find(ing => ing.id === removedId);
      if (removedIngredient) {
        removedIngredients.push({
          id: removedIngredient.id,
          name: removedIngredient.name,
          extra_cost_price: 0,
          quantity: 1,
          isDefault: true,
          size: currentSizeInCm
        });
      }
    });

    // Ingrédients de base conservés
    // const nonRemovedBaseIngredients = baseIngredients.value.filter(ing => !removedBaseIngredients.value.has(ing.id));
    // nonRemovedBaseIngredients.forEach(ing => {
    //   const quantity = customIngredients.value[ing.id] || 1; // Quantité par défaut = 1
 
    //   finalIngredients.push({
    //     id: ing.id,
    //     name: ing.name,
    //     extra_cost_price: 0, // Les ingrédients de base sont gratuits
    //     quantity: quantity,
    //     isDefault: ing.isDefault || false,
    //     size: currentSizeInCm
    //   });
    // });
  }
 
  // 2. Ajouter les autres ingrédients sélectionnés (suppléments)
  Object.entries(customIngredients.value)
    .filter(([id, quantity]) => {
      // Exclure les ingrédients de base (ils sont déjà traités ci-dessus)
      return quantity > 0 && !id.startsWith('base-');
    })
    .forEach(([id, quantity]) => {
      // Chercher l'ingrédient dans les ingrédients du produit d'abord
      let ingredientInfo: any = props.product!.ingredients?.find(i => i.id === id);
      
      // Si pas trouvé, chercher dans INGREDIENTS_WITH_PRICING
      if (!ingredientInfo) {
        ingredientInfo = INGREDIENTS_WITH_PRICING.find(i => i.id === id);
      }
      
      // Calculer le prix selon le type d'ingrédient
      let extraCostPrice = 0;
      if (ingredientInfo) {
        if (typeof ingredientInfo.price === 'number') {
          extraCostPrice = ingredientInfo.price;
        } else if ((ingredientInfo as any).pricing) {
          extraCostPrice = (ingredientInfo as any).pricing[currentSizeInCm] || 0;
        }
      }

      finalIngredients.push({
        id: ingredientInfo?.id || id,
        name: ingredientInfo?.name || 'Ingrédient inconnu',
        extra_cost_price: extraCostPrice,
        quantity,
        isDefault: ingredientInfo?.isDefault || false,
        size: currentSizeInCm
      });
    });


  const event: AddToCartEvent = {
    product: props.product,
    size: sizeWithOriginalPrices,  // ← Utiliser les prix originaux
    quantity: quantity.value,
    ingredients: finalIngredients,  // ← Ingrédients conservés/ajoutés (feature)
    removedIngredients: removedIngredients,  // ← Ingrédients retirés
    supplements: [],
    notes: ''
  };

  emit('add-to-cart', event);
  closeModal();
};

// Watchers
watch(() => props.product, (newProduct) => {
  if (newProduct?.sizes) {
    // Utiliser la taille sélectionnée si fournie, sinon la taille par défaut
    const sizeToUse = props.initialSelectedSize || newProduct.sizes.find(s => s.name === 'Normale') || newProduct.sizes[0];
    if (sizeToUse) {
      selectSize(sizeToUse);

    }
  }

  // Initialiser avec les ingrédients par défaut
  const defaultIngredients: Record<string, number> = {};
  
  // Utiliser les ingrédients spécifiques du produit s'ils existent
  if (newProduct?.ingredients && newProduct.ingredients.length > 0) {
    newProduct.ingredients.forEach(ing => {
      if (ing.isDefault) {
        defaultIngredients[ing.id] = 1;
      }
    });
  } else {
    // Fallback vers INGREDIENTS_WITH_PRICING si pas d'ingrédients spécifiques
    INGREDIENTS_WITH_PRICING.forEach(ing => {
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

/* Information sur le fonctionnement */
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

/* Mode de personnalisation */
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
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: #388D35;
    background: #f8fafc;
  }

  &.default-ingredient {
    border: 1px solid #388D35;
    background: #f0f9f0;
  }

  &.removed-default {
    border: 1px solid #ef4444;
    background: #fef2f2;
    opacity: 0.7;
  }

  &.selected {
    border: 1px solid #388D35;
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

  .ingredient-card-image {
    position: relative;

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
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
      border-radius: 50%;
    }
  }

  .ingredient-name {
    font-weight: 500;
  }

  .ingredient-price {
    font-size: 11px;
    color: #388D35;
    font-weight: 500;

    &.default-price {
      color: #388D35;
      font-weight: 600;
    }
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

  .ingredient-base-controls {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }

  .remove-base-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #dc3545;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      background-color: #c82333;
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
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