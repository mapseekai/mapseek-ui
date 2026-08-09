import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const showcasePath = resolve(import.meta.dirname, "SwitchShowcase.tsx")
const docsPath = resolve(import.meta.dirname, "../../../packages/docs/content/docs/components")

describe("SwitchOverviewDemo", () => {
  it("shows rounded and square controls in the variants group", async () => {
    const source = await readFile(showcasePath, "utf8")
    const start = source.indexOf('data-demo="switch-variants"')
    const variants = source.slice(start, source.indexOf("</section>", start))

    expect(start).toBeGreaterThanOrEqual(0)
    expect(variants.match(/<Switch/g)).toHaveLength(4)
    expect(variants.match(/variant="square"/g)).toHaveLength(2)
    expect(variants.match(/defaultChecked/g)).toHaveLength(2)
  })

  it("describes square variant coverage in both documentation locales", async () => {
    const [chinese, english] = await Promise.all([
      readFile(resolve(docsPath, "switch.mdx"), "utf8"),
      readFile(resolve(docsPath, "switch.en.mdx"), "utf8"),
    ])

    expect(chinese).toContain("square 变体")
    expect(english).toContain("square variant")
  })

  it("documents the compact 24px square variant width in both locales", async () => {
    const [chinese, english] = await Promise.all([
      readFile(resolve(docsPath, "switch.mdx"), "utf8"),
      readFile(resolve(docsPath, "switch.en.mdx"), "utf8"),
    ])

    expect(chinese).toContain("24×16px")
    expect(english).toContain("24×16px")
  })
})
