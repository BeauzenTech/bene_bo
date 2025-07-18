// Types pour le système POS moderne VaBene

export interface Category {
  id: string
  name: string
  icon?: string
  description?: string
  isActive?: boolean
  itemCount?: number
}

export interface ProductSize {
  id: string
  name: string
  price: string
  priceLivraison: string
}

export interface Ingredient {
  id: string
  name: string
  price: number
  isDefault: boolean
  isAvailable: boolean
  image?: string
}

export interface Supplement {
  id: string
  name: string
  price: number
  isAvailable: boolean
  image?: string
}

export interface Product {
  id: string
  name: string
  description: string
  image: string
  category: string
  sizes: ProductSize[]
  ingredients: Ingredient[]
  supplements: Supplement[]
  isAvailable: boolean
  isPopular?: boolean
  preparationTime?: number
  allergens?: string[]
}

export interface CartIngredient extends Ingredient {
  quantity: number
  extra_cost_price: number
}

export interface CartSupplement extends Supplement {
  quantity: number
  extra_cost_price: number
}

export interface CartItem {
  id: string
  productId: string
  name: string
  image: string
  selectedSize: ProductSize
  quantity: number
  basePrice: number
  totalPrice: number
  ingredients: CartIngredient[]
  supplements: CartSupplement[]
  notes?: string
  localProductId: string
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  isActive: boolean
  type: 'cash' | 'card' | 'digital'
}

export interface OrderSummary {
  subtotal: number
  tax: number
  discount?: number
  total: number
  items: CartItem[]
}

export interface Customer {
  id?: string
  name?: string
  phone?: string
  email?: string
  loyaltyPoints?: number
}

export interface POSState {
  selectedCategory: string
  searchQuery: string
  cart: CartItem[]
  customer: Customer | null
  paymentMethod: PaymentMethod | null
  isProcessingOrder: boolean
  orderType: 'dine-in' | 'takeaway' | 'delivery'
}

// Types pour les modales
export interface ProductModalData {
  product: Product
  selectedSize: ProductSize | null
  quantity: number
  ingredients: CartIngredient[]
  supplements: CartSupplement[]
  notes: string
}

// Types pour les événements
export interface AddToCartEvent {
  product: Product
  size: ProductSize
  quantity: number
  ingredients: CartIngredient[]
  supplements: CartSupplement[]
  notes?: string
}

export interface UpdateCartEvent {
  itemId: string
  quantity?: number
  ingredients?: CartIngredient[]
  supplements?: CartSupplement[]
  notes?: string
}

// Constants
export const CATEGORIES: Category[] = [
  { id: 'breakfast', name: 'Breakfast', itemCount: 12 },
  { id: 'lunch', name: 'Lunch', itemCount: 12 },
  { id: 'dinner', name: 'Dinner', itemCount: 12 },
  { id: 'soup', name: 'Soup', itemCount: 12 },
  { id: 'desserts', name: 'Desserts', itemCount: 12 },
  { id: 'sidedish', name: 'Side Dish', itemCount: 12 },
  { id: 'appetizer', name: 'Appetizer', itemCount: 12 },
  { id: 'beverages', name: 'Beverages', itemCount: 12 }
]

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', name: 'Credit Card', icon: 'credit-card', isActive: true, type: 'card' },
  { id: 'paylater', name: 'Paylater', icon: 'clock', isActive: true, type: 'digital' },
  { id: 'cash', name: 'Cash Payout', icon: 'banknote', isActive: true, type: 'cash' }
] 