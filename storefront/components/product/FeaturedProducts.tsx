"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product/ProductCard"
import { Link } from "@/lib/i18n/navigation"
import { API } from "@/lib/api"
import { toProductCardData, type ApiProduct, type ProductCardData } from "@/lib/catalog"

export function FeaturedProducts() {
  const t = useTranslations("product")
  const [products, setProducts] = useState<ProductCardData[]>([])

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API}/store/products?sort=top_rated&limit=8`)
        if (!response.ok) return
        const data = await response.json()
        setProducts((data.products || []).map((product: ApiProduct) => toProductCardData(product)))
      } catch {
        setProducts([])
      }
    }

    loadProducts()
  }, [])

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-500 mt-2">Handpicked favorites from our collection</p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700 transition-colors"
          >
            {t("title")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
            Featured products will appear here once the catalog is available.
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-brand-600 font-medium"
          >
            {t("title")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
