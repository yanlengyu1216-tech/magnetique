"use client"

import { useTranslations } from "next-intl"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

export function AnnouncementBar() {
  const t = useTranslations("announcement")
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="relative bg-brand-600 text-white text-center text-sm py-2 px-4">
      <p className="truncate mx-8">{t("text")}</p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-brand-700 rounded transition-colors"
        aria-label="Close announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
