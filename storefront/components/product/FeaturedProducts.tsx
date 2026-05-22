"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product/ProductCard"

const featuredProducts = [
  {
    id: "1",
    handle: "eiffel-tower-paris-magnet",
    title: "Eiffel Tower Paris Magnet",
    thumbnail: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=400",
    price: 8.99,
    originalPrice: 12.99,
    rating: 4.8,
    reviewCount: 156,
    isNew: true,
    isOnSale: true,
  },
  {
    id: "2",
    handle: "colosseum-rome-magnet",
    title: "Colosseum Rome Magnet",
    thumbnail: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400",
    price: 7.99,
    rating: 4.6,
    reviewCount: 98,
    isNew: false,
    isOnSale: false,
  },
  {
    id: "3",
    handle: "custom-family-portrait-magnet",
    title: "Custom Family Portrait Magnet",
    thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.9,
    reviewCount: 234,
    isNew: false,
    isOnSale: true,
  },
  {
    id: "4",
    handle: "sakura-cherry-blossom-magnet",
    title: "Sakura Cherry Blossom Magnet",
    thumbnail: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400",
    price: 6.99,
    rating: 4.7,
    reviewCount: 312,
    isNew: true,
    isOnSale: false,
  },
  {
    id: "5",
    handle: "panda-3d-magnet",
    title: "Panda 3D Magnet",
    thumbnail: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400",
    price: 5.99,
    rating: 4.5,
    reviewCount: 87,
    isNew: false,
    isOnSale: false,
  },
  {
    id: "6",
    handle: "london-bus-magnet",
    title: "London Bus Magnet",
    thumbnail: "https://images.unsplash.com/photo-1574279606130-5d2bc9e36c6d?w=400",
    price: 8.99,
    rating: 4.4,
    reviewCount: 145,
    isNew: false,
    isOnSale: false,
  },
  {
    id: "7",
    handle: "christmas-reindeer-magnet-set",
    title: "Christmas Reindeer Magnet Set",
    thumbnail: "https://images.unsplash.com/photo-1579038773867-044c48829161?w=400",
    price: 15.99,
    originalPrice: 19.99,
    rating: 4.8,
    reviewCount: 67,
    isNew: false,
    isOnSale: true,
  },
  {
    id: "8",
    handle: "minimalist-moon-phase-magnet",
    title: "Minimalist Moon Phase Magnet",
    thumbnail: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=400",
    price: 7.99,
    rating: 4.3,
    reviewCount: 54,
    isNew: false,
    isOnSale: false,
  },
]

export function FeaturedProducts() {
  const t = useTranslations("product")

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
