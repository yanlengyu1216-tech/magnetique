"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Search, X, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

const popularSearches = ["Eiffel Tower", "Custom", "Christmas", "Panda", "3D Magnet"]

interface SearchBarProps {
  onClose: () => void
}

export function SearchBar({ onClose }: SearchBarProps) {
  const t = useTranslations("common")
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (query.length > 1) {
      const fakeSuggestions = popularSearches.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
      setSuggestions(fakeSuggestions)
    } else {
      setSuggestions([])
    }
  }, [query])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
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
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
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
                    key={suggestion}
                    href={`/products?q=${encodeURIComponent(suggestion)}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 group-hover:text-brand-600">
                      {suggestion}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
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
        </div>
      </div>
    </div>
  )
}
