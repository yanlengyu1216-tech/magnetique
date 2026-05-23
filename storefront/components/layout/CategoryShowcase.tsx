"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "@/lib/i18n/navigation"
import { API } from "@/lib/api"
import type { ApiCategory } from "@/lib/catalog"

const categoryColors = [
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-orange-600",
  "from-rose-400 to-rose-600",
  "from-indigo-400 to-indigo-600",
  "from-sky-400 to-cyan-600",
]

export function CategoryShowcase() {
  const [categories, setCategories] = useState<ApiCategory[]>([])

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(`${API}/store/product-categories`)
        if (!response.ok) return
        const data = await response.json()
        setCategories((data.product_categories || []).slice(0, 6))
      } catch {
        setCategories([])
      }
    }

    loadCategories()
  }, [])

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-gray-500 mt-2">Find your perfect magnet by theme</p>
          </div>
          <Link
            href="/products?view=categories"
            className="hidden sm:flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700 transition-colors"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[index % categoryColors.length]} opacity-90`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.32),transparent_45%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-sm md:text-base">{cat.name}</h3>
                  <p className="text-white/80 text-xs mt-1">Explore this collection</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            Categories will appear here once the catalog is available.
          </div>
        )}
      </div>
    </section>
  )
}
