import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page"
import { notFound } from "next/navigation"

import { i18n, resolveRoute } from "@/lib/i18n"
import { source } from "@/lib/source"
import { getMDXComponents } from "@/mdx-components"

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug: segments } = await params
  const { lang, slug } = resolveRoute(segments)
  const page = source.getPage(slug, lang)
  if (!page) notFound()
  const MDX = page.data.body
  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody className="max-w-[760px]">
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  const params: { slug?: string[] }[] = []
  for (const lang of i18n.languages) {
    for (const page of source.getPages(lang)) {
      const slug = page.slugs.length > 0 ? [...page.slugs] : []
      params.push(lang === "en" ? { slug: ["en", ...slug] } : { slug })
    }
  }
  return params
}
