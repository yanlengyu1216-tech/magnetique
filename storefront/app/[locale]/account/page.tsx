"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Package, MapPin, Heart, Ticket, ArrowRight, ShoppingBag, Clock, DollarSign, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth"

const API = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

export default function AccountDashboard() {
  const t = useTranslations("account")
  const { customer, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  const totalOrders = orders.length
  const activeOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed" || o.status === "shipped").length
  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0)
  const recentOrders = orders.slice(0, 3)

  const stats = [
    { label: "Total Orders", value: String(totalOrders), icon: ShoppingBag, color: "bg-blue-500" },
    { label: "Active Orders", value: String(activeOrders), icon: Clock, color: "bg-green-500" },
    { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: DollarSign, color: "bg-purple-500" },
    { label: "Wishlist", value: "0", icon: Heart, color: "bg-pink-500" },
  ]

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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Please sign in</h2>
        <Link href="/login" className="text-brand-600 font-medium hover:underline">Sign In</Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-display font-bold text-gray-900">{t("dashboard")}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t("order_history")}</h2>
          <Link href="/account/orders" className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500 text-sm">
            No orders yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.id.slice(0, 8)}...</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString()} · {(order.items || []).length} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">${(order.total || 0).toFixed(2)}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered" ? "bg-green-100 text-green-700"
                    : order.status === "shipped" || order.status === "confirmed" ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
