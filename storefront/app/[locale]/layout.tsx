import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import "../globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Magnetique - Premium Refrigerator Magnets",
    template: "%s | Magnetique",
  },
  description:
    "Discover handcrafted refrigerator magnets from around the world. Unique designs, premium quality, fast worldwide shipping.",
  keywords: ["refrigerator magnets", "souvenir magnets", "handcrafted", "home decor", "gifts"],
  openGraph: {
    title: "Magnetique - Premium Refrigerator Magnets",
    description: "Handcrafted refrigerator magnets from every corner of the world",
    type: "website",
    locale: "en_US",
    siteName: "Magnetique",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
