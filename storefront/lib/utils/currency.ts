export const currencies = {
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
  CAD: { symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  AUD: { symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
} as const

export type CurrencyCode = keyof typeof currencies

export async function getExchangeRates(base: CurrencyCode = "USD"): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${base}`
    )
    const data = await res.json()
    return data.rates
  } catch {
    return {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      CAD: 1.36,
      AUD: 1.53,
    }
  }
}

export function convertPrice(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<string, number>
): number {
  if (from === to) return amount
  const inUSD = from === "USD" ? amount : amount / rates[from]
  return to === "USD" ? inUSD : inUSD * rates[to]
}
