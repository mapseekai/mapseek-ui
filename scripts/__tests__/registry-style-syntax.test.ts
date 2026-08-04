import { readdir, readFile } from "node:fs/promises"
import { extname, join, relative } from "node:path"
import { describe, expect, it } from "vitest"

const registryRoot = "registry"

async function sourceFiles(directory = registryRoot): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) return sourceFiles(path)
      return [".ts", ".tsx", ".css"].includes(extname(entry.name)) ? [path] : []
    }),
  )
  return nested.flat()
}

async function violations(pattern: RegExp, files?: readonly string[]): Promise<string[]> {
  const results: string[] = []
  for (const file of files ?? (await sourceFiles())) {
    const source = await readFile(file, "utf8")
    source.split("\n").forEach((line, index) => {
      pattern.lastIndex = 0
      if (pattern.test(line)) results.push(`${relative(registryRoot, file)}:${index + 1}`)
    })
  }
  return results
}

describe("registry style syntax", () => {
  it("uses Tailwind v4 CSS-variable shorthand utilities", async () => {
    expect(await violations(/\b[\w!:-]+-\[(?:length:)?var\(--[\w-]+\)\]/g)).toEqual([])
  })

  it("uses flex gaps instead of positive space-y utilities", async () => {
    expect(await violations(/(?:^|[\s"'`])space-y-[^\s"'`]+/g)).toEqual([])
  })

  it("uses semantic palette tokens instead of raw Tailwind colors", async () => {
    expect(
      await violations(
        /\b(?:bg|border|fill|ring|stroke|text)-(?:amber|blue|emerald|gray|green|orange|purple|red|slate|stone|yellow|zinc)-\d+/g,
      ),
    ).toEqual([])
  })

  it("does not add manual dark-mode styling in composed blocks", async () => {
    const blockFiles = (await sourceFiles("registry/blocks")).filter((file) =>
      [".ts", ".tsx"].includes(extname(file)),
    )
    expect(await violations(/(?:^|[\s"'`])dark:[^\s"'`]+/g, blockFiles)).toEqual([])
  })
})
