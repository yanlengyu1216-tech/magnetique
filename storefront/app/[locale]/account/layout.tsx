"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Package, MapPin, Heart, Ticket, MessageSquare, Settings, LogOut,
  User, ChevronRight
} from "lucide-react"
import { useAuth } from "@/lib/auth"

const accountLinks = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/addresses", label: "My Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "My Wishlist", icon: Heart },
  { href: "/account/coupons", label: "My Coupons", icon: Ticket },
  { href: "/account/messages", label: "Messages", icon: MessageSquare },
  { href: "/account/settings", label: "Settings", icon: Settings },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("account")
  const pathname = usePathname()
  const router = useRouter()
  const { customer, loading, logout } = useAuth()

  const initials = customer
    ? `${customer.first_name?.[0] || ""}${customer.last_name?.[0] || ""}`.toUpperCase()
    : "?"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
              {/* User info */}
              <div className="p-6 bg-gradient-to-r from-brand-600 to-brand-800 text-white">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3 text-lg font-bold">
                  {loading ? "..." : initials}
                </div>
                <p className="font-semibold">
                  {loading ? "Loading..." : customer ? `${customer.first_name} ${customer.last_name}` : "Guest"}
                </p>
                <p className="text-sm text-white/80 truncate">
                  {customer?.email || ""}
                </p>
              </div>

              {/* Navigation */}
              <nav className="p-3">
                {accountLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-brand-50 text-brand-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  )
                })}

                <div className="border-t border-gray-100 mt-3 pt-3">
                  <button
                    onClick={() => { logout(); router.push("/login") }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 w-full transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
