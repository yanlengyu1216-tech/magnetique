"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "@/lib/i18n/navigation"
import { Search, ShoppingCart, User, Heart, Menu, X, Globe, ChevronDown } from "lucide-react"
import { locales } from "@/lib/i18n/navigation"
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher"
import { CurrencySwitcher } from "@/components/layout/CurrencySwitcher"
import { SearchBar } from "@/components/layout/SearchBar"
import { useCartStore } from "@/store/cart"

const navLinks = [
  { href: "/", label: "nav.home" },
  { href: "/products", label: "nav.all_products" },
  { href: "/products?view=categories", label: "nav.categories" },
  { href: "/custom-service", label: "nav.custom_service" },
  { href: "/about", label: "nav.about" },
  { href: "/contact", label: "nav.contact" },
]

export function Header() {
  const t = useTranslations()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const cartCount = useCartStore((s) => s.getItemCount())

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-brand-600">
              Magnetique
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-brand-600 ${
                    isActive ? "text-brand-600" : "text-gray-700"
                  }`}
                >
                  {t(link.label)}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language switcher - desktop */}
            <div className="hidden lg:block">
              <LocaleSwitcher />
            </div>

            {/* Currency switcher - desktop */}
            <div className="hidden lg:block">
              <CurrencySwitcher />
            </div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={t("nav.search")}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={t("nav.wishlist")}
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={t("nav.account")}
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={t("nav.cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="flex gap-2 mb-4">
              <LocaleSwitcher />
              <CurrencySwitcher />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors"
              >
                {t(link.label)}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 flex gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-brand-600">
                {t("nav.sign_in")}
              </Link>
              <Link href="/register" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                {t("nav.sign_up")}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </header>
  )
}
