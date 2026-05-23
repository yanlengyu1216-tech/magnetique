"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/lib/i18n/navigation"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { API } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API}/store/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Registration failed")
      }
      const data = await res.json()
      localStorage.setItem("magnet-auth-token", data.token)
      localStorage.setItem("magnet-customer", JSON.stringify(data.customer))
      router.push("/account")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-display font-bold text-brand-600">
            Magnetique
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6">Create an Account</h1>
          <p className="text-gray-500 mt-1">Join us for a better shopping experience</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
                  placeholder="John" required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)}
                  placeholder="Doe" required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com" required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type={showPassword ? "text" : "password"} value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Min. 8 characters" required minLength={8}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-brand-600 hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
          </p>

          <button type="submit" disabled={loading}
            className="w-full bg-brand-600 text-white py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
