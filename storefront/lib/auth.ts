"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

const API = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  created_at?: string
}

interface AuthState {
  customer: Customer | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshCustomer: () => Promise<void>
}

export function useAuth(): AuthState {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("magnet-auth-token")
    if (stored) {
      setToken(stored)
      fetchCustomer(stored)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCustomer = async (t: string) => {
    try {
      const res = await fetch(`${API}/store/customers/me`, {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (res.ok) {
        const data = await res.json()
        setCustomer(data.customer)
      } else {
        localStorage.removeItem("magnet-auth-token")
        localStorage.removeItem("magnet-customer")
        setToken(null)
      }
    } catch {
      // Network error
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/store/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Invalid credentials")
    }
    const data = await res.json()
    localStorage.setItem("magnet-auth-token", data.token)
    localStorage.setItem("magnet-customer", JSON.stringify(data.customer))
    setToken(data.token)
    setCustomer(data.customer)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("magnet-auth-token")
    localStorage.removeItem("magnet-customer")
    setToken(null)
    setCustomer(null)
  }, [])

  const refreshCustomer = useCallback(async () => {
    const t = token || localStorage.getItem("magnet-auth-token")
    if (!t) return
    try {
      const res = await fetch(`${API}/store/customers/me`, {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (res.ok) {
        const data = await res.json()
        setCustomer(data.customer)
      }
    } catch {}
  }, [token])

  return { customer, token, loading, login, logout, refreshCustomer }
}
