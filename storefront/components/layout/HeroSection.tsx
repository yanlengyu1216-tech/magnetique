"use client"

import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { Link } from "@/lib/i18n/navigation"

export function HeroSection() {
  const t = useTranslations("hero")

  return (
    <section className="relative bg-gradient-to-br from-brand-50 via-white to-amber-50 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              {t("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
              >
                {t("cta")}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/custom-service"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl font-medium hover:border-brand-600 hover:text-brand-600 transition-colors"
              >
                {t("cta_custom")}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              {[
                { label: "Free Shipping", detail: "On orders $50+" },
                { label: "Handcrafted", detail: "Premium quality" },
                { label: "Easy Returns", detail: "30-day guarantee" },
              ].map((badge) => (
                <div key={badge.label} className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{badge.label}</p>
                  <p className="text-xs text-gray-500">{badge.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-brand-200 to-amber-200">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-8">
                  {[
                    "https://images.unsplash.com/photo-1549144511-f099e773c147?w=300",
                    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300",
                    "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300",
                    "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=300",
                    "https://images.unsplash.com/photo-1579038773867-044c48829161?w=300",
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300",
                  ].map((src, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">10,000+</p>
                <p className="text-xs text-gray-500">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
