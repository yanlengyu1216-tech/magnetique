"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    name: "Travel Magnets",
    image: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=600",
    count: 48,
    slug: "travel-magnets",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Custom Design",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600",
    count: 12,
    slug: "custom-design",
    color: "from-purple-400 to-purple-600",
  },
  {
    name: "Seasonal",
    image: "https://images.unsplash.com/photo-1579038773867-044c48829161?w=600",
    count: 24,
    slug: "seasonal",
    color: "from-red-400 to-red-600",
  },
  {
    name: "Animal Series",
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600",
    count: 36,
    slug: "animal-series",
    color: "from-green-400 to-green-600",
  },
  {
    name: "3D Magnets",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600",
    count: 18,
    slug: "3d-magnets",
    color: "from-orange-400 to-orange-600",
  },
  {
    name: "Gift Sets",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600",
    count: 15,
    slug: "gift-sets",
    color: "from-pink-400 to-pink-600",
  },
]

export function CategoryShowcase() {
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-sm md:text-base">{cat.name}</h3>
                <p className="text-white/80 text-xs mt-1">{cat.count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
