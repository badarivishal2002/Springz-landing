// Core Product Types
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  category: "whey" | "plant" | "recovery" | "accessories"
  images: string[]
  inStock: boolean
  stockCount: number
  features: string[]
  nutritionFacts: NutritionFacts
  flavors: Flavor[]
  sizes: ProductSize[]
  rating: number
  reviewCount: number
  tags: string[]
}

export interface NutritionFacts {
  servingSize: string
  servingsPerContainer: number
  calories: number
  protein: number
  carbs: number
  fat: number
  sugar: number
  sodium: number
  ingredients: string[]
}

export interface Flavor {
  id: string
  name: string
  available: boolean
}

export interface ProductSize {
  id: string
  name: string
  weight: string
  price: number
  originalPrice?: number
  available: boolean
}

// Cart Types
export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  selectedFlavor: Flavor
  selectedSize: ProductSize
  price: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  itemCount: number
}

// User & Auth Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: "customer" | "admin"
  status: "active" | "banned" | "pending"
  createdAt: string
  addresses: Address[]
}

export interface Address {
  id: string
  type: "billing" | "shipping"
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault: boolean
}

// Order Types
export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  createdAt: string
  updatedAt: string
  trackingNumber?: string
}

export interface PaymentMethod {
  type: "card" | "paypal" | "apple_pay"
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardholderName?: string
  last4?: string
  brand?: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface SignupForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface CheckoutForm {
  email: string
  shippingAddress: Omit<Address, "id" | "type" | "isDefault">
  billingAddress: Omit<Address, "id" | "type" | "isDefault">
  sameAsShipping: boolean
  paymentMethod: PaymentMethod
}

export interface AdminStats {
  totalSales: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
}

export interface AdminProductForm {
  name: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  category: Product["category"]
  stockCount: number
  features: string[]
  tags: string[]
}
