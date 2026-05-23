export interface ApiPrice {
  amount?: number
  original_amount?: number | null
  currency_code?: string
  a?: number
  c?: string
}

export interface ApiVariant {
  id: string
  title: string
  prices?: ApiPrice[]
  inventory_quantity?: number
}

export interface ApiCategory {
  id: string
  name: string
  handle: string
}

export interface ApiTag {
  id: string
  value: string
}

export interface ApiProduct {
  id: string
  handle: string
  title: string
  subtitle?: string
  description?: string
  thumbnail?: string
  images?: string[]
  variants?: ApiVariant[]
  category?: ApiCategory | null
  tags?: ApiTag[]
  rating?: number
  review_count?: number
  created_at?: string
}

export interface ProductCardData {
  id: string
  handle: string
  title: string
  thumbnail: string
  variantId: string
  variantTitle: string
  maxQuantity: number
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  isNew: boolean
  isOnSale: boolean
}

function getPriceAmount(price?: ApiPrice) {
  if (!price) return 0
  const raw = price.amount ?? price.a ?? 0
  return raw / 100
}

export function getUsdPrice(prices: ApiPrice[] = []) {
  return prices.find((price) => (price.currency_code || price.c) === "usd")
}

export function getOriginalUsdPrice(prices: ApiPrice[] = []) {
  const price = getUsdPrice(prices)
  if (!price?.original_amount) return undefined
  return price.original_amount / 100
}

export function getPrimaryVariant(product: ApiProduct) {
  return product.variants?.[0]
}

export function getProductPricing(product: ApiProduct) {
  const variant = getPrimaryVariant(product)
  const price = getPriceAmount(getUsdPrice(variant?.prices))
  const originalPrice = getOriginalUsdPrice(variant?.prices)
  const isOnSale = Boolean(originalPrice && originalPrice > price)

  return {
    price,
    originalPrice: isOnSale ? originalPrice : undefined,
    isOnSale,
  }
}

export function isNewProduct(product: ApiProduct) {
  if (!product.created_at) return false
  const createdAt = new Date(product.created_at).getTime()
  const ageInDays = (Date.now() - createdAt) / (1000 * 60 * 60 * 24)
  return ageInDays <= 30
}

export function toProductCardData(product: ApiProduct): ProductCardData {
  const { price, originalPrice, isOnSale } = getProductPricing(product)
  const variant = getPrimaryVariant(product)

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    thumbnail: product.thumbnail || product.images?.[0] || "",
    variantId: variant?.id || product.id,
    variantTitle: variant?.title || "Default",
    maxQuantity: variant?.inventory_quantity || 99,
    price,
    originalPrice,
    rating: product.rating || 0,
    reviewCount: product.review_count || 0,
    isNew: isNewProduct(product),
    isOnSale,
  }
}
