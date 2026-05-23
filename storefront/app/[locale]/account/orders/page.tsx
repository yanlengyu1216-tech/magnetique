"use client"

import { useTranslations } from "next-intl"
import { Package, Clock, CreditCard, ChevronRight, Search, Loader2 } from "lucide-react"
import { Link } from "@/lib/i18n/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { API } from "@/lib/api"

export default function OrdersPage() {
  const t = useTranslations("account")
  const { customer, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!customer) { setLoading(false); return }
    const cid = customer.id
    async function fetchOrders() {
      try {
        const res = await fetch(`${API}/store/orders/customer/${cid}`)
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders || [])
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    if (!authLoading) fetchOrders()
  }, [customer, authLoading, API])

  const filtered = search
    ? orders.filter((o) => o.id.toLowerCase().includes(search.toLowerCase()))
    : orders

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Please sign in to view orders</h2>
        <Link href="/login" className="text-brand-600 font-medium hover:underline">Sign In</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900">{t("orders")}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 w-48 md:w-56"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">{search ? "Try a different search term" : "You haven't placed any orders yet"}</p>
          {!search && (
            <Link href="/products" className="text-brand-600 font-medium hover:underline">
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filtered.map((order) => {
            const items = order.items || []
            const itemCount = items.reduce((s: number, i: any) => s + (i.quantity || 1), 0)
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    order.status === "delivered" ? "bg-green-50"
                    : order.status === "shipped" || order.status === "confirmed" ? "bg-blue-50"
                    : order.status === "cancelled" ? "bg-red-50" : "bg-yellow-50"
                  }`}>
                    {order.status === "delivered" ? <Package className="h-5 w-5 text-green-600" />
                     : order.status === "shipped" || order.status === "confirmed" ? <Clock className="h-5 w-5 text-blue-600" />
                     : <CreditCard className="h-5 w-5 text-red-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.id.slice(0, 8)}...</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString()} · {itemCount} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">${(order.total || 0).toFixed(2)}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered" ? "bg-green-100 text-green-700"
                    : order.status === "shipped" || order.status === "confirmed" ? "bg-blue-100 text-blue-700"
                    : order.status === "cancelled" ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
