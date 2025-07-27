// Types pour le système POS moderne VaBene

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  ordered: number;
}

export interface ProductSize {
  id: string;
  name: string;
  size: string;
  price: string;
  priceLivraison: string;
  created_at?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
  isAvailable: boolean;
  image?: string;
}

export interface Supplement {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extra_cost_price: number;
  image_url?: string;
  type?: string;
  size?: string;
  isDefault?: boolean;
  isAvailable?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  image: string;
  category: string;
  sizes: ProductSize[];
  ingredients: Ingredient[];
  supplements: Supplement[];
  isAvailable: boolean;
  isPopular?: boolean;
  type?: string;
  withoutGluten?: boolean;
  additionnal?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  selectedSize: ProductSize;
  quantity: number;
  basePrice: number;
  totalPrice: number;
  ingredients: CartIngredient[];
  supplements: CartSupplement[];
  notes?: string;
  localProductId: string;
  additionnal?: string[];
}

export interface CartIngredient {
  id: string;
  name: string;
  extra_cost_price: number;
  quantity: number;
  isDefault: boolean;
  size?: string;
  type?: string;
}

export interface CartSupplement {
  id: string;
  name: string;
  extra_cost_price: number;
  quantity: number;
  type?: string;
  size?: string;
}

export interface AddToCartEvent {
  product: Product;
  size: ProductSize;
  quantity: number;
  ingredients: CartIngredient[];
  supplements: CartSupplement[];
  notes?: string;
  additionnal?: string[];
  specification_id?: string;
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  total: number;
  items: CartItem[];
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  isSelected: boolean;
}

export interface POSState {
  selectedCategory: string;
  searchQuery: string;
  cart: CartItem[];
  customer: CustomerInfo | null;
  paymentMethod: PaymentMethod | null;
  isProcessingOrder: boolean;
  orderType: "dine_in" | "click_collect" | "delivery";
}

// Types pour les modales
export interface ProductModalData {
  product: Product;
  selectedSize: ProductSize | null;
  quantity: number;
  ingredients: CartIngredient[];
  supplements: CartSupplement[];
  notes: string;
}

// Types pour les événements
export interface UpdateCartEvent {
  itemId: string;
  quantity?: number;
  ingredients?: CartIngredient[];
  supplements?: CartSupplement[];
  notes?: string;
}

// Constants
export const CATEGORIES: Partial<Category>[] = [
  {
    id: "breakfast",
    name: "Petit-déjeuner",
    description: "Petit-déjeuner",
    image: "/images/breakfast.jpg",
    isActive: true,
  },
  {
    id: "lunch",
    name: "Déjeuner",
    description: "Déjeuner",
    image: "/images/lunch.jpg",
    isActive: true,
  },
  {
    id: "dinner",
    name: "Dîner",
    description: "Dîner",
    image: "/images/dinner.jpg",
    isActive: true,
  },
  {
    id: "soup",
    name: "Soupes",
    description: "Soupes",
    image: "/images/soup.jpg",
    isActive: true,
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Desserts",
    image: "/images/desserts.jpg",
    isActive: true,
  },
  {
    id: "sidedish",
    name: "Accompagnements",
    description: "Accompagnements",
    image: "/images/sidedish.jpg",
    isActive: true,
  },
  {
    id: "appetizer",
    name: "Entrées",
    description: "Entrées",
    image: "/images/appetizer.jpg",
    isActive: true,
  },
  {
    id: "beverages",
    name: "Boissons",
    description: "Boissons",
    image: "/images/beverages.jpg",
    isActive: true,
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "card",
    name: "Carte de crédit",
    icon: "credit-card",
    isSelected: false,
  },
  { id: "paylater", name: "Payer plus tard", icon: "clock", isSelected: false },
  { id: "cash", name: "Espèces", icon: "banknote", isSelected: true },
];
