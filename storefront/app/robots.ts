import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://magnetique-theta.vercel.app"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/checkout", "/cart", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
