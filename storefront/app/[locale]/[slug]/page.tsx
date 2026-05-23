import { notFound } from "next/navigation"
import { StaticPageLayout } from "@/components/common/StaticPageLayout"
import { sitePages } from "@/lib/content/site-pages"

export default function SiteInfoPage({
  params,
}: {
  params: { slug: string }
}) {
  const page = sitePages[params.slug]

  if (!page) {
    notFound()
  }

  return (
    <StaticPageLayout
      title={page.title}
      summary={page.summary}
      sections={page.sections}
    />
  )
}
