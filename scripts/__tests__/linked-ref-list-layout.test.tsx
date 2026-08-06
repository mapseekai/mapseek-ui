import { renderToStaticMarkup } from "react-dom/server"
import { createServer } from "vite"
import { expect, it } from "vitest"

it("renders LinkedRefList summaries as one card tab set", async () => {
  const server = await createServer({
    configFile: "showcase/vite.config.ts",
    server: { middlewareMode: true },
    appType: "custom",
  })

  try {
    const { LinkedRefListDemo } = await server.ssrLoadModule(
      "/src/showcases/LinkedRefListShowcase.tsx",
    )
    const html = renderToStaticMarkup(<LinkedRefListDemo locale="zh-CN" />)
    const summaryTabs = html.match(/<button[^>]*role="tab"[^>]*>/g) ?? []

    expect(html).toContain('data-slot="card-tabs"')
    expect(html).not.toContain('data-slot="tabs"')
    expect(html).toContain('role="tablist"')
    expect(html).toContain('role="tabpanel"')
    expect(summaryTabs).toHaveLength(3)
    expect(summaryTabs[0]).toContain('aria-selected="true"')
    expect(summaryTabs[0]).toContain("data-active")
    for (const tab of summaryTabs) {
      expect(tab).toContain("h-auto")
      expect(tab).not.toContain("h-7")
    }
  } finally {
    await server.close()
  }
})
