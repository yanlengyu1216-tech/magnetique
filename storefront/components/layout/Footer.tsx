"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react"

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Best Sellers", href: "/products?sort=best_selling" },
    { label: "Gift Ideas", href: "/products?collection=gift-ideas" },
    { label: "Sale", href: "/products?on_sale=true" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Return Policy", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
}

export function Footer() {
  const t = useTranslations("footer")
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <h3 className="text-2xl font-display font-bold text-white">Magnetique</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t("about_text")}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-brand-400 shrink-0" />
                <span>123 Craft Lane, Design District, NY 10001</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-brand-400 shrink-0" />
                <span>hello@magnetique.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-brand-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("quick_links")}</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("customer_service")}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-white font-semibold mb-2">{t("newsletter")}</h4>
            <div className="flex mt-4">
              <input
                type="email"
                placeholder={t("newsletter_placeholder")}
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-l-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button className="px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-r-lg hover:bg-brand-700 transition-colors">
                {t("subscribe")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {t("copyright", { year })}
          </p>
          <div className="flex items-center gap-4">
            <img
              src="https://cdn.jsdelivr.net/gh/danielcraigie/payment-icons@master/icons/visa.svg"
              alt="Visa"
              className="h-6"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/danielcraigie/payment-icons@master/icons/mastercard.svg"
              alt="Mastercard"
              className="h-6"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/danielcraigie/payment-icons@master/icons/paypal.svg"
              alt="PayPal"
              className="h-6"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/danielcraigie/payment-icons@master/icons/stripe.svg"
              alt="Stripe"
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
