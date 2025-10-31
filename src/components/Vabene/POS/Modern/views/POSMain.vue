<template>
  <div class="pos-container">
    <!-- Zone principale de contenu POS -->
    <main class="pos-main-content">
      <!-- Barre de recherche simple -->
      <div class="search-section">
        <div class="search-container">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher dans le menu..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Navigation par catégories -->
      <CategoryNavigation
        :categories="categories"
        :selected-category="selectedCategory"
        :is-loading="isLoading"
        @category-change="handleCategoryChange"
      />

      <!-- Menu et grille de produits -->
      <div class="products-container">
        <ProductMenu
          :category="selectedCategory"
          :search-query="searchQuery"
          :products="products"
          :is-loading="isLoadingProducts"
          @add-to-cart="handleAddToCart"
          @customize-product="handleCustomizeProduct"
          @create-pizza="handleCreatePizza"
        />
      </div>
    </main>

    <!-- Zone de commande/facturation à droite -->
    <aside class="pos-invoice-section">
      <OrderInvoice
        :cart="cart"
        :order-summary="orderSummary"
        :categories="categories"
        @update-quantity="handleUpdateQuantity"
        @remove-item="handleRemoveItem"
        @place-order="handlePlaceOrder"
      />
    </aside>

    <!-- Modales de personnalisation -->
    <ProductCustomizationModal
      v-if="showProductModal"
      :product="selectedProduct"
      @close="closeProductModal"
      @add-to-cart="handleAddToCart"
    />

    <!-- Modales spécialisées -->
    <SaladCustomizationModal
      v-if="showSaladModal"
      :product="selectedSaladProduct"
      :selected-size="selectedSaladSize"
      @close="closeSaladModal"
      @add-to-cart="handleAddToCart"
    />

    <PastaCustomizationModal
      v-if="showPastaModal"
      :product="selectedPastaProduct"
      :selected-size="selectedPastaSize"
      @close="closePastaModal"
      @add-to-cart="handleAddToCart"
    />

    <PizzaCustomizationModal
      v-if="showPizzaModal"
      :product="selectedPizzaProduct"
      :initial-selected-size="selectedPizzaSize"
      @close="closePizzaModal"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import CategoryNavigation from "../components/CategoryNavigation.vue";
import ProductMenu from "../components/ProductMenu.vue";
import OrderInvoice from "../components/OrderInvoice.vue";
import ProductCustomizationModal from "../modals/ProductCustomizationModal.vue";
import SaladCustomizationModal from "../modals/SaladCustomizationModal.vue";
import PastaCustomizationModal from "../modals/PastaCustomizationModal.vue";
import PizzaCustomizationModal from "../modals/PizzaCustomizationModal.vue";
import type {
  Category,
  Product,
  CartItem,
  AddToCartEvent,
  OrderSummary,
  ProductSize,
} from "../types";
// Import des fonctions API
import {
  listeCategorieActive,
  listeRestaurantProduct,
  listeIngredient,
  listeRestaurantCategorie,
  getAllCategories,
  getProductsByCategory,
} from "@/service/api";
import type {
  ApiResponse,
  PaginatedCategorie,
  PaginatedRestaurantProduct,
  PaginatedIngredient,
} from "@/models/Apiresponse";
import type { CategorieModel } from "@/models/categorie.model";
import type { ProductModel } from "@/models/product.model";
import type { IngredientModel } from "@/models/ingredient.model";
import { UserGeneralKey, UserRole } from "@/models/user.generalkey";
import { useToast } from "vue-toastification";

const store = useStore();
const toast = useToast();

// État local
const searchQuery = ref("");
const selectedCategory = ref("");

// États des modales
const showProductModal = ref(false);
const selectedProduct = ref<Product | null>(null);

const showSaladModal = ref(false);
const selectedSaladProduct = ref<Product | null>(null);
const selectedSaladSize = ref<ProductSize | null>(null);

const showPastaModal = ref(false);
const selectedPastaProduct = ref<Product | null>(null);
const selectedPastaSize = ref<ProductSize | null>(null);

const showPizzaModal = ref(false);
const selectedPizzaProduct = ref<Product | null>(null);
const selectedPizzaSize = ref<ProductSize | null>(null);

// État de chargement
const isLoading = ref(false);
const isLoadingProducts = ref(false);
const isLoadingIngredients = ref(false);

// Données des catégories et produits
const categories = ref<Category[]>([]);
const products = ref<ProductModel[]>([]);
const ingredients = ref<IngredientModel[]>([]);

// Informations utilisateur
const userRole = ref<UserRole | null>(null);
const restaurantID = ref<string | null>(null);

// IDs des catégories spécialisées
const SPECIALIZED_CATEGORY_IDS = {
  PASTA: "0f142654-3109-4dcb-89d3-6b89b8eca35e",
  SALAD: "aa5474aa-578e-4d0a-81b1-de15166a8766",
  PIZZA: "pizza",
} as const;

// Fonction pour parser les tableaux sérialisés PHP
const parsePhpSerializedArray = (serialized: string): string[] => {
  try {
    // Format attendu : a:2:{i:0;s:18:"Pointrine de Dinde";i:1;s:6:"Jambon";}
    const arrayMatch = serialized.match(/^a:(\d+):\{/);
    if (!arrayMatch) return [];

    const count = parseInt(arrayMatch[1]);
    const items: string[] = [];

    // Parser chaque élément : i:0;s:18:"Pointrine de Dinde";
    const itemRegex = /i:\d+;s:(\d+):"([^"]+)";/g;
    let match;

    while ((match = itemRegex.exec(serialized)) !== null) {
      const length = parseInt(match[1]);
      const value = match[2];

      // Vérifier que la longueur correspond
      if (value.length === length) {
        items.push(value);
      }
    }

    return items;
  } catch (error) {
    return [];
  }
};

// État du panier depuis Vuex (avec vérification de sécurité)
const cart = computed(() => store?.getters?.["cart/cart"] || []);
const cartTotal = computed(() => store?.getters?.["cart/cartTotal"] || 0);
const cartCount = computed(() => store?.getters?.["cart/cartCount"] || 0);

// Computed pour le type de commande
const currentOrderType = computed(
  () => store?.getters?.["orderType/selectedOrderType"] || "dine_in"
);

// Calcul du résumé de commande
const orderSummary = computed((): OrderSummary => {
  const subtotal = cart.value.reduce(
    (sum: number, item: CartItem) => sum + (item.totalPrice || 0),
    0
  );
  const tax = subtotal * 0.026; // 2.6% de taxe suisse (affichage informatif uniquement)
  const total = subtotal; // Le total ne comprend pas la TVA

  return {
    subtotal: subtotal,
    tax,
    total,
    items: cart.value,
  };
});

// Fonctions de détection du type de produit
const getSpecializedCategoryType = (
  product: Product | ProductModel
): "pasta" | "salad" | "pizza" | "none" => {
  // Pour ProductModel, utiliser categorieID.id; pour Product (transformé), utiliser category
  const categoryId =
    (product as any).category || (product as any).categorieID?.id;

  if (!categoryId) return "none";

  // Vérification des exceptions
  if ((product as any).exception) return "none";

  switch (categoryId) {
    case SPECIALIZED_CATEGORY_IDS.PASTA:
      return "pasta";
    case SPECIALIZED_CATEGORY_IDS.SALAD:
      return "salad";
    case SPECIALIZED_CATEGORY_IDS.PIZZA:
      return "pizza";
    default:
      // Vérification par type de produit
      if ((product as any).type === "Pizza") return "pizza";
      return "none";
  }
};

const requiresSpecializedModal = (product: Product | ProductModel): boolean => {
  return getSpecializedCategoryType(product) !== "none";
};

// Gestionnaires d'événements
const handleCategoryChange = async (categoryId: string) => {
  selectedCategory.value = categoryId;
  await fetchProducts(categoryId);
};

const handleCustomizeProduct = (data: {
  product: Product;
  selectedSize: ProductSize | null;
}) => {
  const { product, selectedSize } = data;
  const productType = getSpecializedCategoryType(product);

  switch (productType) {
    case "salad":
      openSaladModal(product, selectedSize);
      break;
    case "pasta":
      openPastaModal(product, selectedSize);
      break;
    case "pizza":
      openPizzaModal(product, selectedSize);
      break;
    default:
      // Modal général
      selectedProduct.value = product;
      showProductModal.value = true;
      break;
  }
};

const handleCreatePizza = (
  selectedBase: string,
  selectedSize: string,
  sizeId: string
) => {
  // This function is no longer used but kept for now to avoid breaking changes if used elsewhere.
  // Consider removing it in a future refactor.
  console.warn("handleCreatePizza is deprecated and should be removed.");
};

// Gestionnaires des modales spécialisées
const openSaladModal = (
  product: Product,
  selectedSize: ProductSize | null = null
) => {
  selectedSaladProduct.value = product;
  selectedSaladSize.value =
    selectedSize ||
    product.sizes?.find((s) => s.name === "Normale") ||
    product.sizes?.[0] ||
    null;

  showSaladModal.value = true;
};

const closeSaladModal = () => {
  showSaladModal.value = false;
  selectedSaladProduct.value = null;
  selectedSaladSize.value = null;
};

const openPastaModal = (
  product: Product,
  selectedSize: ProductSize | null = null
) => {
  selectedPastaProduct.value = product;
  selectedPastaSize.value =
    selectedSize ||
    product.sizes?.find((s) => s.name === "Normale") ||
    product.sizes?.[0] ||
    null;

  showPastaModal.value = true;
};

const closePastaModal = () => {
  showPastaModal.value = false;
  selectedPastaProduct.value = null;
  selectedPastaSize.value = null;
};

const openPizzaModal = (
  product: Product,
  selectedSize: ProductSize | null = null
) => {
  selectedPizzaProduct.value = product;
  selectedPizzaSize.value = selectedSize;

  showPizzaModal.value = true;
};

const closePizzaModal = () => {
  showPizzaModal.value = false;
  selectedPizzaProduct.value = null;
  selectedPizzaSize.value = null;
};

const handleAddToCart = (event: AddToCartEvent) => {
  // Utiliser le bon prix selon le type de commande actuel
  const isDelivery = currentOrderType.value === "delivery";
  const correctBasePrice =
    isDelivery && event.size.priceLivraison
      ? parseFloat(event.size.priceLivraison) || 0
      : parseFloat(event.size.price) || 0;

  const cartItem: CartItem = {
    id: generateId(),
    productId: event.product.id,
    name: event.product.name,
    image: event.product.image,
    category: event.product.category, // Ajouter la catégorie du produit
    selectedSize: event.size,
    quantity: event.quantity,
    basePrice: correctBasePrice,
    totalPrice: calculateItemTotal(event),
    ingredients: event.ingredients || [],
    removedIngredients: event.removedIngredients || [],
    supplements: event.supplements || [],
    additionnal: (event as any).additionnal || [],
    notes: event.notes || "",
    localProductId: generateLocalProductId(event),
  };

  if (store) {
    store.dispatch("cart/addToCart", { item: cartItem });
  }

  // Fermer toutes les modales
  closeAllModals();
};

const closeAllModals = () => {
  closeProductModal();
  closeSaladModal();
  closePastaModal();
  closePizzaModal();
};

const handleUpdateQuantity = async (itemId: string, quantity: number) => {
  if (store) {
    if (quantity > 0) {
      await store.dispatch("cart/updateQuantity", { itemId, quantity });
    } else {
      const item = cart.value.find(
        (item: CartItem) => item.localProductId === itemId
      );
      if (item) {
        await store.dispatch("cart/removeFromCart", item);
      }
    }
  }
};

const handleRemoveItem = (itemId: string) => {
  const item = cart.value.find(
    (item: CartItem) => item.localProductId === itemId
  );
  if (item && store) {
    store.dispatch("cart/removeFromCart", item);
  }
};

const handlePlaceOrder = () => {
  // Logique pour finaliser la commande
  // Ici on pourrait ouvrir une modale de confirmation ou rediriger
};

const closeProductModal = () => {
  showProductModal.value = false;
  selectedProduct.value = null;
};

// Fonctions API
const fetchCategories = async () => {
  isLoading.value = true;
  try {
    let transformedCategories: Category[] = [];
    try {
      const response = await getAllCategories(1, 50);

      if (response.code === 200 && response.data?.data) {
        transformedCategories = response.data.data.map(
          (category: CategorieModel) => ({
            id: category.id,
            name: category.name,
            description: category.description || "",
            image: "/images/default-category.jpg",
            isActive: category.isActive !== false,
            ordered: category.ordered,
          })
        );
      } else {
        throw new Error(`API getAllCategories échouée: ${response.message}`);
      }
    } catch (newApiError) {
      if (userRole.value === UserRole.FRANCHISE) {
        const response = (await listeCategorieActive(
          1,
          "0"
        )) as ApiResponse<PaginatedCategorie>;
        if (response.code === 200 && response.data?.items) {
          transformedCategories = response.data.items.map(
            (category: CategorieModel) => ({
              id: category.id,
              name: category.name,
              description: category.description || "",
              image: "/images/default-category.jpg",
              isActive: category.isActive !== false,
              ordered: category.ordered,
            })
          );
        }
      } else {
        const response = await listeRestaurantCategorie(1, "0");
        if (response.code === 200 && response.data?.items) {
          transformedCategories = response.data.items.map((item: any) => {
            const category = item.category;
            return {
              id: category.id,
              name: category.name,
              description: category.description || "",
              image: "/images/default-category.jpg",
              isActive: category.isActive !== false,
              ordered: category.ordered,
            };
          });
        }
      }
    }

    if (transformedCategories.length === 0) {
      toast.error("Aucune catégorie trouvée");
      return;
    }

    categories.value = transformedCategories.sort(
      (a, b) => Number(a.ordered) - Number(b.ordered)
    );

    // Sélectionner la première catégorie par défaut
    if (transformedCategories.length > 0) {
      selectedCategory.value = transformedCategories[0].id;
      await fetchProducts(transformedCategories[0].id);
    }
  } catch (error) {
    toast.error("Erreur lors du chargement des catégories");
  } finally {
    isLoading.value = false;
  }
};

const fetchProducts = async (categoryId: string) => {
  if (!categoryId) return;

  isLoadingProducts.value = true;
  try {
    let extractedProducts: ProductModel[] = [];

    // Essayer d'abord la nouvelle API getProductsByCategory
    try {
      const response = await getProductsByCategory(categoryId, 1, 50);

      if (response.code === 200 && response.data?.data) {
        extractedProducts = response.data.data.map((product: any) => {
          // Gestion sécurisée du parsing JSON pour les images
          let imageUrl = "/images/default-product.jpg";
          try {
            if (product.image_urls) {
              const parsedImages = JSON.parse(product.image_urls);
              if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                imageUrl = parsedImages[0];
              }
            }
          } catch (error) {
            if (product.image_urls && typeof product.image_urls === "string") {
              // Chercher les URLs Cloudinary dans la chaîne
              const cloudinaryMatch = product.image_urls.match(
                /https:\/\/res\.cloudinary\.com\/[^"]+/
              );
              if (cloudinaryMatch) {
                imageUrl = cloudinaryMatch[0];
              }
            }
          }

          // Gestion sécurisée du parsing pour les options additionnelles (format PHP sérialisé)
          let additionnalOptions = [];
          try {
            if (product.additionnal) {
              // Parser le format PHP sérialisé : a:2:{i:0;s:18:"Pointrine de Dinde";i:1;s:6:"Jambon";}
              additionnalOptions = parsePhpSerializedArray(product.additionnal);
            }
          } catch (error) {
            try {
              additionnalOptions = JSON.parse(product.additionnal);
            } catch (jsonError) {
              console.warn("⚠️ Échec du parsing JSON aussi:", jsonError);
            }
          }

          return {
            ...product,
            // Transformer les variations en sizes
            sizes:
              product.variations?.map((variation: any) => ({
                id: variation.id,
                name: variation.size,
                description: variation.description,
                price: variation.takeawayPrice,
                priceLivraison: variation.deliveryPrice,
                isActive: variation.isActive,
              })) || [],
            // S'assurer que les champs requis existent
            image: imageUrl,
            isActive: product.isActive === 1,
            // Transformer les options additionnelles
            additionnal: additionnalOptions,
            // CRUCIAL: Mapper category_id vers categorieID pour le filtrage
            categorieID: {
              id: product.category_id,
              name: product.category_name,
            },
          };
        });
      } else {
        throw new Error(
          `API getProductsByCategory échouée: ${response.message}`
        );
      }
    } catch (newApiError) {
      // Fallback vers l'ancienne API
      const response = (await listeRestaurantProduct(
        1,
        "0",
        categoryId
      )) as ApiResponse<PaginatedRestaurantProduct>;

      if (response.code === 200 && response.data?.items) {
        extractedProducts = response.data.items.map(
          (item: any) => item.product
        );
      } else {
        throw new Error(
          `API listeRestaurantProduct échouée: ${response.message}`
        );
      }
    }

    if (extractedProducts.length === 0) {
      toast.warning("Aucun produit trouvé pour cette catégorie");
    }

    products.value = extractedProducts;
  } catch (error) {
    console.error("❌ Erreur lors du chargement des produits:", error);
    toast.error("Erreur lors du chargement des produits");
    products.value = [];
  } finally {
    isLoadingProducts.value = false;
  }
};

const fetchIngredients = async () => {
  isLoadingIngredients.value = true;
  try {
    const response = (await listeIngredient(
      1,
      "0"
    )) as ApiResponse<PaginatedIngredient>;
    if (response.code === 200) {
      toast.success(response.message || "Ingrédients chargés avec succès");
      ingredients.value = response.data?.items || [];
    }
  } catch (error) {
    console.error("Erreur lors du chargement des ingrédients:", error);
    toast.error("Erreur lors du chargement des ingrédients");
  } finally {
    isLoadingIngredients.value = false;
  }
};

// Fonctions utilitaires
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const generateLocalProductId = (event: AddToCartEvent): string => {
  const baseId = `${event.product.id}_${event.size.id}`;
  const ingredientsHash = event.ingredients
    .filter((ing) => !ing.isDefault && ing.quantity > 0)
    .map((ing) => `${ing.id}_${ing.quantity}`)
    .sort()
    .join("_");
  const supplementsHash = event.supplements
    .filter((sup) => sup.quantity > 0)
    .map((sup) => `${sup.id}_${sup.quantity}`)
    .sort()
    .join("_");

  return `${baseId}_${ingredientsHash}_${supplementsHash}`;
};

const calculateItemTotal = (event: AddToCartEvent): number => {
  // Utiliser le bon prix selon le type de commande actuel
  const isDelivery = currentOrderType.value === "delivery";
  const basePrice =
    isDelivery && event.size.priceLivraison
      ? parseFloat(event.size.priceLivraison) || 0
      : parseFloat(event.size.price) || 0;

  const ingredientsPrice = event.ingredients.reduce((sum, ing) => {
    if (!ing.isDefault && ing.quantity > 0) {
      const ingPrice =
        typeof ing.extra_cost_price === "string"
          ? parseFloat(ing.extra_cost_price) || 0
          : ing.extra_cost_price || 0;
      return sum + ingPrice * ing.quantity;
    }
    return sum;
  }, 0);
  const supplementsPrice = event.supplements.reduce((sum, sup) => {
    if (sup.quantity > 0) {
      const supPrice =
        typeof sup.extra_cost_price === "string"
          ? parseFloat(sup.extra_cost_price) || 0
          : sup.extra_cost_price || 0;
      return sum + supPrice;
    }
    return sum;
  }, 0);

  return (basePrice + ingredientsPrice + supplementsPrice) * event.quantity;
};

// Initialisation
const initializeUserData = () => {
  // Récupérer les informations utilisateur depuis localStorage
  const storedRole = localStorage.getItem(UserGeneralKey.USER_ROLE);
  const storedRestaurantID = localStorage.getItem(
    UserGeneralKey.USER_RESTAURANT_ID
  );

  if (storedRole) {
    userRole.value = storedRole as UserRole;
  }

  if (storedRestaurantID) {
    restaurantID.value = storedRestaurantID;
  }
};

onMounted(async () => {
  // Initialiser les données utilisateur
  initializeUserData();

  // Charger les données initiales depuis les stores
  if (store) {
    store.dispatch("cart/loadFromStorage");
    store.dispatch("features/loadFromStorage");
  }

  // Charger les données depuis l'API
  await Promise.all([fetchCategories(), fetchIngredients()]);
});

watch(currentOrderType, (newOrderType, oldOrderType) => {}, {
  immediate: false,
});
</script>

<style lang="scss" scoped>
.pos-container {
  display: flex;
  height: 100vh;
  background: #f8fafc;
  overflow: hidden; // Empêcher le scroll global
}

.pos-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  min-width: 0; // Permet la compression flex
  overflow: hidden;
}

.search-section {
  flex-shrink: 0; // Ne pas réduire la zone de recherche
  margin-bottom: 0.5rem;

  .search-container {
    position: relative;
    width: 100%;
    margin: 0 auto;

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: 14px;
    }

    .search-input {
      width: 100%;
      height: 40px;
      padding: 0 12px 0 36px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      font-size: 14px;
      background: white;

      &:focus {
        outline: none;
        border-color: #388d35;
        box-shadow: 0 0 0 3px rgba(56, 141, 53, 0.1);
      }

      &::placeholder {
        color: #94a3b8;
      }
    }
  }
}

.products-container {
  flex: 1;
  overflow: hidden; // Le scroll sera géré par ProductMenu
  min-height: 0; // Permet la compression flex
}

.pos-invoice-section {
  width: 400px;
  background: white;
  border-left: 1px solid #e2e8f0;
  overflow-y: auto;
  flex-shrink: 0; // Ne pas réduire la zone de commande
}

@media (max-width: 1200px) {
  .pos-invoice-section {
    width: 350px;
  }
}

@media (max-width: 768px) {
  .pos-container {
    flex-direction: column;
  }

  .pos-invoice-section {
    width: 100%;
    height: 40vh;
    border-left: none;
    border-top: 1px solid #e2e8f0;
  }

  .pos-main-content {
    height: 60vh;
    padding: 1rem;
  }
}
</style>
