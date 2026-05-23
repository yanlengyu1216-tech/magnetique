"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronRight, CreditCard, Shield, Lock, Loader2 } from "lucide-react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { useCartStore } from "@/store/cart"
import { API } from "@/lib/api"
import { Link } from "@/lib/i18n/navigation"

const shippingMethods = [
  { id: "ship_free", name: "Free Shipping", price: 0, deliveryDays: "7-10 business days", description: "Free on orders over $50" },
  { id: "ship_standard", name: "Standard Shipping", price: 4.99, deliveryDays: "5-7 business days" },
  { id: "ship_express", name: "Express Shipping", price: 12.99, deliveryDays: "2-3 business days" },
]

export default function CheckoutPage() {
  const t = useTranslations("checkout")
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const getSubtotal = useCartStore((s) => s.getSubtotal)
  const getShipping = useCartStore((s) => s.getShipping)
  const getTotal = useCartStore((s) => s.getTotal)

  const [step, setStep] = useState<"shipping" | "payment" | "confirm">("shipping")
  const [selectedShipping, setSelectedShipping] = useState("ship_standard")
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState<any>(null)
  const [orderError, setOrderError] = useState("")

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", zip: "", state: "", country: "United States",
  })

  const subtotal = getSubtotal()
  const shipping = shippingMethods.find((m) => m.id === selectedShipping)?.price || 0
  const total = subtotal + shipping

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const placeOrder = async () => {
    if (!form.email || !form.address) {
      setOrderError("Please fill in all required fields")
      return
    }
    setSubmitting(true)
    setOrderError("")

    try {
      // 1. Create cart
      const cartRes = await fetch(`${API}/store/carts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region_id: null, email: form.email }),
      })
      if (!cartRes.ok) throw new Error("Failed to create cart")
      const { cart } = await cartRes.json()

      // 2. Add items to cart
      for (const item of items) {
        const res = await fetch(`${API}/store/carts/${cart.id}/line-items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variant_id: item.id, quantity: item.quantity }),
        })
        if (!res.ok) throw new Error(`Failed to add ${item.title}`)
      }

      // 3. Set shipping method
      const shipRes = await fetch(`${API}/store/carts/${cart.id}/shipping-methods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option_id: selectedShipping }),
      })
      if (!shipRes.ok) throw new Error("Failed to set shipping method")

      // 4. Initiate payment
      const payRes = await fetch(`${API}/store/carts/${cart.id}/payment-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (!payRes.ok) throw new Error("Failed to initiate payment")

      // 5. Complete cart
      const customerStr = localStorage.getItem("magnet-customer")
      const customerId = customerStr ? JSON.parse(customerStr).id : null
      const completeRes = await fetch(`${API}/store/carts/${cart.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          shipping_address: {
            first_name: form.firstName,
            last_name: form.lastName,
            address_1: form.address,
            city: form.city,
            province: form.state,
            postal_code: form.zip,
            country_code: form.country === "United States" ? "us" : form.country.toLowerCase().slice(0, 2),
            phone: form.phone,
          },
        }),
      })
      if (!completeRes.ok) throw new Error("Failed to complete order")
      const completeData = await completeRes.json()

      // 6. Clear local cart
      clearCart()
      setOrderResult(completeData.data || completeData.order || completeData)
    } catch (err: any) {
      setOrderError(err.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (orderResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-500 mb-6">Thank you for your order.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-lg font-semibold text-gray-900">{orderResult.id}</p>
          </div>
          <div className="text-sm text-gray-500 mb-6 space-y-1">
            <p>Order Total: <span className="font-medium text-gray-900">${(orderResult.total || total).toFixed(2)}</span></p>
            <p>A confirmation email has been sent to {form.email}</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <Link href="/products" className="text-brand-600 font-medium hover:underline">Go shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />

        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mt-4 mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping address */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                  <input
                    type="text" value={form.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input
                    type="text" value={form.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="Doe"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email" value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input
                    type="tel" value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
                  <input
                    type="text" value={form.address}
                    onChange={(e) => updateForm("address", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="123 Main Street"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                  <input
                    type="text" value={form.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP / Postal Code *</label>
                  <input
                    type="text" value={form.zip}
                    onChange={(e) => updateForm("zip", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="10001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State / Province</label>
                  <input
                    type="text" value={form.state}
                    onChange={(e) => updateForm("state", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                  <select
                    value={form.country}
                    onChange={(e) => updateForm("country", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>France</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping method */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Method</h2>
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedShipping === method.id
                        ? "border-brand-600 bg-brand-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio" name="shipping" value={method.id}
                        checked={selectedShipping === method.id}
                        onChange={() => setSelectedShipping(method.id)}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.deliveryDays}</p>
                      </div>
                    </div>
                    <span className="font-semibold">
                      {method.price === 0 ? <span className="text-green-600">FREE</span> : `$${method.price.toFixed(2)}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
                  <input type="radio" name="payment" defaultChecked className="text-brand-600 focus:ring-brand-500" />
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Credit Card</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl opacity-60">
                  <input type="radio" name="payment" className="text-brand-600 focus:ring-brand-500" />
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-700">P</span>
                    <span className="font-medium text-gray-900">PayPal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest checkout */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500">
                New customer?{" "}
                <Link href="/register" className="text-brand-600 font-medium hover:underline">
                  Create an account
                </Link>{" "}
                for faster checkout next time.
              </p>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {items.map((item, i) => (
                  <div key={`${item.productId}-${i}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.variantTitle} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({items.length} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>

              {orderError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {orderError}
                </div>
              )}

              <button
                onClick={placeOrder}
                disabled={submitting}
                className="mt-6 w-full bg-brand-600 text-white py-3.5 rounded-xl font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Placing Order...</>
                ) : (
                  <><Lock className="h-4 w-4" /> Place Order</>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Secure SSL
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  30-day returns
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center mb-3">Accepted payment methods</p>
                <div className="flex justify-center gap-3">
                  <span className="h-6 px-2 bg-gray-100 rounded text-xs font-bold text-gray-600 flex items-center">Visa</span>
                  <span className="h-6 px-2 bg-gray-100 rounded text-xs font-bold text-gray-600 flex items-center">MC</span>
                  <span className="h-6 px-2 bg-gray-100 rounded text-xs font-bold text-gray-600 flex items-center">PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
