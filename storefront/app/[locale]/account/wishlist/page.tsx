"use client"

import { useTranslations } from "next-intl"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { useWishlistStore } from "@/store/wishlist"
import { Link } from "@/lib/i18n/navigation"

export default function WishlistPage() {
  const t = useTranslations("account")
  const items = useWishlistStore((s) => s.items)
  const removeItem = useWishlistStore((s) => s.removeItem)

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">{t("wishlist")}</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save your favorite items here</p>
          <Link href="/products" className="text-brand-600 font-medium hover:underline">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900">{t("wishlist")}</h1>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <Link href={`/products/${item.handle}`} className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.handle}`} className="text-sm font-medium text-gray-900 hover:text-brand-600 line-clamp-1">
                {item.title}
              </Link>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                ${(item.price || 0).toFixed(2)}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Link
                  href={`/products/${item.handle}`}
                  className="inline-flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" /> View Product
                </Link>
                <button
                  onClick={() => removeItem(item.id)}
                  className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <p className="text-sm text-gray-500 text-center">{items.length} item{items.length > 1 ? "s" : ""} in your wishlist</p>
      )}
    </div>
  )
}
