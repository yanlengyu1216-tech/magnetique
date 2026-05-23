import { MetadataRoute } from "next"

const locales = ["en", "de", "fr", "es", "it"]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://magnetique-theta.vercel.app"

  const staticPages = ["", "/products", "/about", "/contact", "/login", "/register", "/custom-service", "/faq", "/privacy", "/terms", "/shipping", "/returns", "/size-guide"]

  const entries = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1.0 : 0.8,
    }))
  )

  return entries
}
