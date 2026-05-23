"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Package, MapPin, CreditCard, ChevronLeft, Truck, Loader2 } from "lucide-react"
import Link from "next/link"
import { API } from "@/lib/api"

export default function OrderDetailPage() {
  const t = useTranslations("account")
  const params = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const orderId = typeof params.id === "string" ? params.id : ""

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return
      try {
        const res = await fetch(`${API}/store/orders/${orderId}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data.order)
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId, API])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order not found</h2>
        <Link href="/account/orders" className="text-brand-600 font-medium hover:underline">Back to Orders</Link>
      </div>
    )
  }

  const items = order.items || []
  const shippingAddress = order.shipping_address || {}
  const shippingMethod = order.shipping_method || {}

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm text-brand-600 font-medium hover:underline">
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order {order.id.slice(0, 8)}...</h1>
            <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            order.status === "delivered" ? "bg-green-100 text-green-700"
            : order.status === "shipped" || order.status === "confirmed" ? "bg-blue-100 text-blue-700"
            : "bg-yellow-100 text-yellow-700"
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Subtotal</p>
            <p className="text-lg font-bold text-gray-900">${(order.subtotal || 0).toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Shipping</p>
            <p className="text-lg font-bold text-gray-900">${(order.shipping_cost || 0).toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-lg font-bold text-gray-900">${(order.total || 0).toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Payment</p>
            <p className="text-lg font-bold text-gray-900">
              {order.payment_method?.provider_id === "stripe" ? "Card" : "Card"}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Items ({items.length})</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {items.map((item: any, i: number) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.variant_title || item.variant} × {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping</h2>
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {shippingAddress.first_name || ""} {shippingAddress.last_name || ""}
            </p>
            <p className="text-gray-500">{shippingAddress.address_1 || ""}</p>
            <p className="text-gray-500">
              {shippingAddress.city || ""}{shippingAddress.city && shippingAddress.province ? ", " : ""}{shippingAddress.province || ""} {shippingAddress.postal_code || ""}
            </p>
            <p className="text-gray-500">{shippingAddress.country_code || ""}</p>
          </div>
        </div>
        {shippingMethod.name && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 text-sm">
            <Truck className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">{shippingMethod.name}</p>
              {shippingMethod.delivery_days && (
                <p className="text-gray-500">{shippingMethod.delivery_days}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
