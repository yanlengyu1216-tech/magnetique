"use client"

import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Grid3X3, List, SlidersHorizontal, X, Search, ChevronDown, Loader2 } from "lucide-react"
import { ProductCard } from "@/components/product/ProductCard"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { API } from "@/lib/api"
import type { ApiCategory, ApiProduct, ProductCardData } from "@/lib/catalog"
import { toProductCardData } from "@/lib/catalog"

export default function ProductsPage() {
  const t = useTranslations("product")
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState<ProductCardData[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [showSortMenu, setShowSortMenu] = useState(false)

  const categoryId = searchParams.get("category") || ""
  const searchQuery = searchParams.get("q") || ""
  const categoryView = searchParams.get("category_view") === "1"

  useEffect(() => {
    const cat = categories.find((c) => c.id === categoryId)
    document.title = searchQuery
      ? `Search: ${searchQuery} | Magnetique`
      : cat
        ? `${cat.name} | Magnetique`
        : "All Products | Magnetique"
  }, [categoryId, searchQuery, categories])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError("")
      try {
        const params = new URLSearchParams()
        if (categoryId) params.set("category_id", categoryId)
        if (searchQuery) params.set("q", searchQuery)
        if (searchParams.get("on_sale") === "true") params.set("on_sale", "true")
        if (sortBy === "newest") params.set("sort", "newest")
        if (sortBy === "top_rated") params.set("sort", "top_rated")
        if (sortBy === "price_low") params.set("order", "price_asc")
        if (sortBy === "price_high") params.set("order", "price_desc")

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API}/store/products?${params}`),
          fetch(`${API}/store/product-categories`),
        ])

        if (!productsRes.ok) throw new Error("Failed to fetch products")
        const productsData = await productsRes.json()
        const categoriesData = categoriesRes.ok ? (await categoriesRes.json()).product_categories || [] : []

        setProducts((productsData.products || []).map((product: ApiProduct) => toProductCardData(product)))
        setCategories(categoriesData)
      } catch (err: any) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [categoryId, searchQuery, sortBy, searchParams])

  const selectedCategory = categories.find((c) => c.id === categoryId)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "All Products" },
          ]}
        />

          <div className="flex items-center justify-between mt-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
              {selectedCategory ? selectedCategory.name : "All Products"}
            </h1>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-1">
                Search results for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
              >
                {sortBy === "newest" ? "Newest" : sortBy === "price_low" ? "Price: Low to High" : sortBy === "price_high" ? "Price: High to Low" : "Top Rated"}
                <ChevronDown className="h-4 w-4" />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                  {["newest", "price_low", "price_high", "top_rated"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setShowSortMenu(false) }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === opt ? "text-brand-600 font-medium" : "text-gray-700"}`}
                    >
                      {opt === "newest" ? "Newest" : opt === "price_low" ? "Price: Low to High" : opt === "price_high" ? "Price: High to Low" : "Top Rated"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden sm:flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-l-lg ${viewMode === "grid" ? "bg-gray-100 text-brand-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-r-lg ${viewMode === "list" ? "bg-gray-100 text-brand-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

          {categoryView ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/products?category=${cat.id}`)}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left hover:border-brand-300 hover:bg-brand-50 transition-colors"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Category</p>
                  <h2 className="mt-3 text-xl font-semibold text-gray-900">{cat.name}</h2>
                  <p className="mt-2 text-sm text-gray-500">Browse products in {cat.name.toLowerCase()}.</p>
                </button>
              ))}
            </div>
          ) : (
          <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0`}>
            <div className="lg:sticky lg:top-24 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => router.push("/products")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!categoryId ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => router.push(`/products?category=${cat.id}`)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryId === cat.id ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="lg:hidden">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                >
                  <X className="h-4 w-4" /> Close Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-brand-600 font-medium hover:underline"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
                <button
                  onClick={() => router.push("/products")}
                  className="text-brand-600 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                : "space-y-4"
              }>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
          )}
      </div>
    </div>
  )
}
