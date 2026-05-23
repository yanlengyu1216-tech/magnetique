"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { Link, useRouter } from "@/lib/i18n/navigation"
import { useCartStore } from "@/store/cart"
import { useWishlistStore } from "@/store/wishlist"

interface Product {
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
  isNew?: boolean
  isOnSale?: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id))
  const addWishlist = useWishlistStore((state) => state.addItem)
  const removeWishlist = useWishlistStore((state) => state.removeItem)

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeWishlist(product.id)
      return
    }

    addWishlist({
      id: product.id,
      handle: product.handle,
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
    })
  }

  const handleQuickAdd = () => {
    addItem({
      id: product.variantId,
      productId: product.id,
      handle: product.handle,
      title: product.title,
      variant: product.variantId,
      variantTitle: product.variantTitle,
      image: product.thumbnail,
      price: product.price,
      originalPrice: product.originalPrice,
      maxQuantity: product.maxQuantity,
    })
  }

  return (
    <div
      className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            NEW
          </span>
        )}
        {product.isOnSale && (
          <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            -{Math.round((1 - product.price / (product.originalPrice || product.price)) * 100)}%
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </button>

      {/* Image */}
      <Link href={`/products/${product.handle}`} className="block aspect-square bg-gray-50 relative overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Quick action overlay */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={handleQuickAdd}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-brand-600 hover:text-white transition-all transform hover:scale-110"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => router.push(`/products/${product.handle}`)}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-brand-600 hover:text-white transition-all transform hover:scale-110"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 md:p-4">
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2 hover:text-brand-600 transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm md:text-base font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs md:text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart button (mobile-friendly) */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="w-full mt-3 bg-brand-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 md:hidden"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
