"use client"

import { usePathname, useRouter, locales, type Locale } from "@/lib/i18n/navigation"
import { Globe } from "lucide-react"
import { useState, useTransition } from "react"

const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
}

const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
  es: "🇪🇸",
  it: "🇮🇹",
}

export function LocaleSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const currentLocale = pathname.split("/")[1] as Locale

  const switchLocale = (locale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale })
      setOpen(false)
    })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-700 hover:text-brand-600 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden lg:inline">{localeNames[currentLocale]}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLocale(locale)}
                disabled={isPending}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                  locale === currentLocale
                    ? "text-brand-600 font-medium bg-brand-50"
                    : "text-gray-700"
                }`}
              >
                <span className="text-base">{localeFlags[locale]}</span>
                <span>{localeNames[locale]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
