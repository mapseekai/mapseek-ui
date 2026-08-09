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

it("uses responsive summary tabs with standard counts and status tags", async () => {
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

    expect(html).toContain("grid-cols-1")
    expect(html).toContain("--linked-ref-columns:3")
    expect(html).toContain("text-headline-lg")
    expect(html.match(/data-slot="tag"/g) ?? []).toHaveLength(3)
  } finally {
    await server.close()
  }
})

it("renders distinct accessible item actions and hides decorative icons", async () => {
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

    expect(html).toContain('aria-label="打开引用"')
    expect(html).toContain('aria-label="复制引用链接"')
    expect(html).not.toContain('disabled=""')
    expect(html.match(/aria-hidden="true"/g)?.length).toBeGreaterThanOrEqual(10)
  } finally {
    await server.close()
  }
})
