"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { MapPin, Plus, Trash2, Star, Loader2, X } from "lucide-react"
import { useAuth } from "@/lib/auth"

const API = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  is_default: number
}

export default function AddressesPage() {
  const t = useTranslations("account")
  const { customer, token, loading: authLoading } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", street: "", city: "", state: "", zip: "", country: "United States", phone: "" })
  const [saving, setSaving] = useState(false)

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  useEffect(() => {
    if (!authLoading && token) fetchAddresses()
    else if (!authLoading) setLoading(false)
  }, [token, authLoading])

  const fetchAddresses = async () => {
    if (!token) return
    try {
      const res = await fetch(`${API}/store/customers/me/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAddresses(data.addresses || [])
      }
    } catch {} finally {
      setLoading(false)
    }
  }

  const addAddress = async () => {
    if (!token) return
    setSaving(true)
    try {
      const res = await fetch(`${API}/store/customers/me/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ name: "", street: "", city: "", state: "", zip: "", country: "United States", phone: "" })
        fetchAddresses()
      }
    } catch {} finally {
      setSaving(false)
    }
  }

  const deleteAddress = async (id: string) => {
    if (!token) return
    try {
      await fetch(`${API}/store/customers/me/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchAddresses()
    } catch {}
  }

  const setDefault = async (id: string) => {
    if (!token) return
    try {
      await fetch(`${API}/store/customers/me/addresses/${id}/default`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchAddresses()
    } catch {}
  }

  if (authLoading || loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 text-brand-600 animate-spin" /></div>
  }

  if (!customer) {
    return <div className="text-center py-20"><h2 className="text-xl font-semibold text-gray-900 mb-4">Please sign in</h2></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900">{t("addresses")}</h1>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Address
        </button>
      </div>

      {/* Add address form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">New Address</h3>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Home / Office"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input type="text" value={form.street} onChange={(e) => update("street", e.target.value)} placeholder="123 Main Street"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="New York"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
              <input type="text" value={form.zip} onChange={(e) => update("zip", e.target.value)} placeholder="10001"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="NY"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select value={form.country} onChange={(e) => update("country", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500">
                <option>United States</option><option>Canada</option><option>United Kingdom</option><option>Germany</option><option>France</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addAddress} disabled={saving}
              className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-60">
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-500">Add an address for faster checkout</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{addr.name}</h3>
                      {addr.is_default === 1 && (
                        <span className="flex items-center gap-1 text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                          <Star className="h-3 w-3 fill-brand-600" /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                    <p className="text-sm text-gray-600">{addr.country}</p>
                    {addr.phone && <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {addr.is_default !== 1 && (
                    <button onClick={() => setDefault(addr.id)} className="text-xs text-brand-600 font-medium hover:underline">
                      Set as Default
                    </button>
                  )}
                  <button onClick={() => deleteAddress(addr.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
