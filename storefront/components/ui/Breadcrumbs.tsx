"use client"

import { ChevronRight, Home } from "lucide-react"
import { Link } from "@/lib/i18n/navigation"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500">
      <Link href="/" className="hover:text-brand-600 transition-colors flex items-center gap-1">
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
