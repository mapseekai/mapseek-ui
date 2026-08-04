import { renderToStaticMarkup } from "react-dom/server"
import { createServer } from "vite"
import { expect, it } from "vitest"

it("lets LinkedRefList summary cards grow to fit their two-row content", async () => {
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
    const summaryButtons = html.match(/<button[^>]*data-slot="button"[^>]*>/g) ?? []

    expect(summaryButtons).toHaveLength(3)
    for (const button of summaryButtons) {
      expect(button).toContain("h-auto")
      expect(button).not.toContain("h-7")
    }
  } finally {
    await server.close()
  }
})
