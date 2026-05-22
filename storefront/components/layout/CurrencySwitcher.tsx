"use client"

import { useState } from "react"
import { DollarSign } from "lucide-react"

type Currency = {
  code: string
  symbol: string
  name: string
}

const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
]

export function CurrencySwitcher() {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0])
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-700 hover:text-brand-600 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <DollarSign className="h-4 w-4" />
        <span className="hidden lg:inline">{currentCurrency.code}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => {
                  setCurrentCurrency(currency)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                  currency.code === currentCurrency.code
                    ? "text-brand-600 font-medium bg-brand-50"
                    : "text-gray-700"
                }`}
              >
                <span className="w-8 text-sm">{currency.symbol}</span>
                <div className="flex flex-col items-start">
                  <span>{currency.code}</span>
                  <span className="text-xs text-gray-500">{currency.name}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
