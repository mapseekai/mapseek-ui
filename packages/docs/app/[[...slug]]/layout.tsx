import { DocsLayout } from "fumadocs-ui/layouts/notebook"
import type { ReactNode } from "react"

import { resolveRoute } from "@/lib/i18n"
import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"
import { DocsProviders } from "@/src/components/DocsProviders"

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const { lang } = resolveRoute(slug)
  return (
    <DocsLayout {...baseOptions()} tree={source.pageTree[lang]}>
      <DocsProviders>{children}</DocsProviders>
    </DocsLayout>
  )
}
