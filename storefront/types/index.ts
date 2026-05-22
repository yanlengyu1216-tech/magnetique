export interface Product {
  id: string
  handle: string
  title: string
  subtitle?: string
  description?: string
  thumbnail: string
  images: string[]
  price: number
  originalPrice?: number
  currency?: string
  rating: number
  reviewCount: number
  isNew?: boolean
  isOnSale?: boolean
  inStock?: boolean
  stock?: number
  sku?: string
  material?: string
  dimensions?: string
  weight?: string
  origin?: string
  categories?: ProductCategory[]
  tags?: string[]
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  title: string
  price: number
  originalPrice?: number
  stock: number
  options?: Record<string, string>
}

export interface ProductCategory {
  id: string
  name: string
  handle: string
  parent?: ProductCategory
  children?: ProductCategory[]
}

export interface Cart {
  id?: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  coupon?: string
  discount?: number
}

export interface CartItem {
  id: string
  productId: string
  handle: string
  title: string
  variant: string
  image: string
  price: number
  quantity: number
  maxQuantity: number
}

export interface Order {
  id: string
  date: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  subtotal: number
  shipping: number
  tax: number
  items: OrderItem[]
  shippingAddress: Address
  trackingNumber?: string
  estimatedDelivery?: string
  paymentMethod: string
}

export interface OrderItem {
  title: string
  variant: string
  quantity: number
  price: number
  image: string
}

export interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault: boolean
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  addresses: Address[]
}

export interface Review {
  id: string
  author: string
  rating: number
  date: string
  text: string
  images?: string[]
  avatar?: string
}

export interface Currency {
  code: string
  symbol: string
  name: string
  rate: number
}

export type Locale = "en" | "de" | "fr" | "es" | "it"
export type ViewMode = "grid" | "list"
export type SortOption = "newest" | "price_low" | "price_high" | "best_selling" | "top_rated"
