"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Ticket, Copy, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/store/cart"
import { useAuth } from "@/lib/auth"
import { API } from "@/lib/api"

export default function CouponsPage() {
  const t = useTranslations("account")
  const { customer, loading: authLoading } = useAuth()
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState("")

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch(`${API}/admin/coupons`)
        if (res.ok) {
          const data = await res.json()
          setCoupons(data.coupons || [])
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchCoupons()
  }, [API])

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(""), 2000)
  }

  const handleUseNow = (code: string) => {
    applyCoupon(code)
  }

  if (authLoading || loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full" /></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-gray-900">{t("coupons")}</h1>

      {coupons.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No coupons available</h3>
          <p className="text-gray-500">Check back later for promotions</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {coupons.map((c: any) => {
            const isPercentage = c.type === "percentage"
            const discountLabel = isPercentage ? `${c.value}% OFF` : `$${c.value} OFF`
            const minSpend = c.min_subtotal ? `$${(c.min_subtotal / 100).toFixed(0)}` : null
            return (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Ticket className="h-6 w-6 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{discountLabel}</h3>
                    <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">{c.code}</span>
                  </div>
                  {c.description && <p className="text-xs text-gray-500 mt-1">{c.description}</p>}
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs text-gray-400">
                      {c.usage_limit ? `${c.used_count || 0}/${c.usage_limit} used` : "Unlimited"}
                      {minSpend ? ` · Min. ${minSpend}` : ""}
                      {c.expires_at ? ` · Expires ${new Date(c.expires_at).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleCopy(c.code)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    {copied === c.code ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-400" />}
                  </button>
                  <Link href="/cart"
                    onClick={() => handleUseNow(c.code)}
                    className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1"
                  >
                    Use Now <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
