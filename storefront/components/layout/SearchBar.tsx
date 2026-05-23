"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Search, X, TrendingUp, ArrowRight } from "lucide-react"
import { Link, useRouter } from "@/lib/i18n/navigation"
import { API } from "@/lib/api"
import type { ApiProduct } from "@/lib/catalog"

const popularSearches = ["Eiffel Tower", "Custom", "Christmas", "Panda", "3D Magnet"]

interface SearchBarProps {
  onClose: () => void
}

export function SearchBar({ onClose }: SearchBarProps) {
  const t = useTranslations("common")
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (query.trim().length <= 1) {
      setSuggestions([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ q: query.trim(), limit: "5" })
        const response = await fetch(`${API}/store/products?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!response.ok) return
        const data = await response.json()
        setSuggestions(data.products || [])
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setSuggestions([])
        }
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [query])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    onClose()
    router.push(`/products?q=${encodeURIComponent(value)}`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="hidden sm:inline-flex items-center gap-2 bg-brand-600 px-4 py-3 text-sm font-medium text-white rounded-xl hover:bg-brand-700 transition-colors"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="container mx-auto px-4 pb-6">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Suggestions
              </h3>
              <div className="space-y-1">
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion.id}
                    href={`/products/${suggestion.handle}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="block text-sm text-gray-700 group-hover:text-brand-600">
                        {suggestion.title}
                      </span>
                      {suggestion.category?.name && (
                        <span className="block text-xs text-gray-500 mt-0.5">
                          {suggestion.category.name}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <p className="text-sm text-gray-500 mb-4">Searching products...</p>
          )}

          {/* Popular searches */}
          {!query && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-brand-600" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("popular_searches")}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/products?q=${encodeURIComponent(term)}`}
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-brand-100 hover:text-brand-600 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {query.trim().length > 1 && !loading && suggestions.length === 0 && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                No instant matches for "{query}". Press search to view the full results page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
