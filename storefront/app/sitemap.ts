import { MetadataRoute } from "next"

const locales = ["en", "de", "fr", "es", "it"]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://magnetique.com"

  const staticPages = ["", "/products", "/about", "/contact", "/cart", "/checkout", "/login", "/register", "/custom-service"]

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
