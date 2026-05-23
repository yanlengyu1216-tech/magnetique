import { useTranslations } from "next-intl"
import { AnnouncementBar } from "@/components/layout/AnnouncementBar"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/layout/HeroSection"
import { FeaturedProducts } from "@/components/product/FeaturedProducts"
import { CategoryShowcase } from "@/components/layout/CategoryShowcase"
import { NewsletterSection } from "@/components/layout/NewsletterSection"

export default function HomePage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <CategoryShowcase />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
