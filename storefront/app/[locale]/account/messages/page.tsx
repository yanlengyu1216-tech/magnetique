"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { MessageSquare, Package, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"

const API = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

export default function MessagesPage() {
  const t = useTranslations("account")
  const { customer, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!customer) { setLoading(false); return }
    const cid = customer.id
    async function fetchMessages() {
      try {
        // Fetch orders as "messages" (order status notifications)
        const res = await fetch(`${API}/store/orders/customer/${cid}`)
        if (res.ok) {
          const data = await res.json()
          const orderMessages = (data.orders || []).map((o: any) => ({
            id: o.id,
            type: "order",
            title: `Order ${o.id.slice(0, 8)}...`,
            preview: `Status: ${o.status}`,
            date: o.created_at,
            status: o.status,
            href: `/account/orders/${o.id}`,
          }))
          setMessages(orderMessages)
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [customer, authLoading, API])

  if (authLoading || loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 text-brand-600 animate-spin" /></div>
  }

  if (!customer) {
    return <div className="text-center py-20"><h2 className="text-xl font-semibold text-gray-900 mb-4">Please sign in</h2></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900">{t("messages")}</h1>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-500">Order updates and notifications will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {messages.map((msg) => (
            <Link key={msg.id} href={msg.href}
              className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                msg.status === "delivered" ? "bg-green-50" : "bg-blue-50"
              }`}>
                <Package className={`h-5 w-5 ${msg.status === "delivered" ? "text-green-600" : "text-blue-600"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{msg.title}</p>
                <p className="text-xs text-gray-500">{msg.preview}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(msg.date).toLocaleDateString()}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
