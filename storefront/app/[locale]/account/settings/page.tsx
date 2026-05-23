"use client"

import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { User, Lock, Bell, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { API } from "@/lib/api"

export default function AccountSettings() {
  const t = useTranslations("account")
  const { customer, token, loading: authLoading, refreshCustomer } = useAuth()

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (customer) {
      setForm({
        firstName: customer.first_name || "",
        lastName: customer.last_name || "",
        email: customer.email || "",
        phone: customer.phone || "",
      })
    }
  }, [customer])

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }))

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch(`${API}/store/customers/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
        }),
      })
      if (res.ok) {
        setSaved(true)
        refreshCustomer()
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {} finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-display font-bold text-gray-900">{t("settings")}</h1>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <User className="h-5 w-5 text-brand-600" /> Profile Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
            <input type="text" value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
            <input type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" value={form.email} disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="mt-6 bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
