"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { useCartStore } from "@/store/cart"
import { Link } from "@/lib/i18n/navigation"

export default function CartPage() {
  const t = useTranslations("cart")
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  const removeCoupon = useCartStore((s) => s.removeCoupon)
  const couponCode = useCartStore((s) => s.couponCode)
  const getSubtotal = useCartStore((s) => s.getSubtotal)
  const getShipping = useCartStore((s) => s.getShipping)
  const getTotal = useCartStore((s) => s.getTotal)

  const [couponInput, setCouponInput] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const total = getTotal()

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return
    applyCoupon(couponInput.trim())
    setCouponApplied(true)
    setTimeout(() => setCouponApplied(false), 2000)
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponInput("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />

        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mt-4 mb-8">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variant}`} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 flex gap-4 md:gap-6">
                  <Link href={`/products/${item.handle}`} className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-50">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/products/${item.handle}`} className="text-sm md:text-base font-medium text-gray-900 hover:text-brand-600 line-clamp-1">
                          {item.title}
                        </Link>
                        <p className="text-xs md:text-sm text-gray-500 mt-0.5">{item.variantTitle}</p>
                      </div>
                      <p className="text-sm md:text-base font-semibold text-gray-900 shrink-0 ml-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.variant)}
                        className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal ({items.length} items)</span>
                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {subtotal < 50 && (
                    <p className="text-xs text-gray-400">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>

                {/* Coupon */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{couponCode}</span>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          couponApplied
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {couponApplied ? "✓" : "Apply"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-base">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 w-full bg-brand-600 text-white py-3.5 rounded-xl font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Shield className="h-3.5 w-3.5" />
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
