"use client"

import { Breadcrumbs } from "@/components/ui/Breadcrumbs"

interface StaticSection {
  heading: string
  body: string[]
}

interface StaticPageLayoutProps {
  title: string
  summary: string
  sections: StaticSection[]
}

export function StaticPageLayout({ title, summary, sections }: StaticPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: title },
          ]}
        />

        <div className="max-w-3xl mt-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">{title}</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">{summary}</p>
        </div>

        <div className="max-w-3xl mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900">{section.heading}</h2>
              <div className="mt-4 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
