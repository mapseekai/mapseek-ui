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

    expect(html).toContain("grid border border-border")
    expect(summaryButtons).toHaveLength(3)
    for (const button of summaryButtons) {
      const classTokens = (button.match(/class="([^"]*)"/)?.[1] ?? "").split(/\s+/)
      expect(button).toContain("h-auto")
      expect(button).not.toContain("h-7")
      expect(button).toContain("border-0")
      expect(button).toContain("border-r")
      expect(button).toContain("border-border")
      expect(
        classTokens.some(
          (token) =>
            token !== "border-border" && (token === "border-b" || token.startsWith("border-b-")),
        ),
      ).toBe(false)
      expect(button).not.toMatch(/class="[^"]*(?:^|\s)border(?:\s|$)/)
    }
    expect(summaryButtons[0]).toContain("bg-selection-bg")
    for (const button of summaryButtons.slice(1)) {
      expect(button).toContain("bg-background")
    }
  } finally {
    await server.close()
  }
})
