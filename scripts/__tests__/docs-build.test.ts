import { access, readdir, readFile } from "node:fs/promises"
import { join } from "node:path"
import { expect, it } from "vitest"

async function readBuiltCss(assetsDir: string): Promise<string> {
  const cssDir = join(assetsDir, "css")
  const files = await readdir(cssDir)
  const cssFiles = files.filter((file) => file.endsWith(".css"))
  const contents = await Promise.all(cssFiles.map((file) => readFile(join(cssDir, file), "utf8")))

  return contents.join("\n")
}

it("declares the Docusaurus docs workspace contract", async () => {
  const root = await Bun.file("package.json").json()
  const docs = await Bun.file("packages/docs/package.json").json()

  expect(root.workspaces).toEqual(["packages/*"])
  expect(root.scripts["docs:build"]).toContain("registry:build")
  expect(root.scripts["docs:build"]).toContain("bun run --cwd packages/docs build")
  expect(root.scripts["docs:dev"]).toContain("bun run --cwd packages/docs start")
  expect(root.scripts["docs:dev:en"]).toContain("bun run --cwd packages/docs start -- --locale en")
  expect(root.scripts["docs:serve"]).toBe("bun run --cwd packages/docs serve")
  expect(docs.dependencies).toMatchObject({
    "@docusaurus/core": "3.10.2",
    "@docusaurus/preset-classic": "3.10.2",
    "@docusaurus/types": "3.10.2",
  })
})

it("publishes installable registry artifacts and compiled theme utilities", async () => {
  await expect(access("packages/docs/build/r/button.json")).resolves.toBeNull()

  const css = await readBuiltCss("packages/docs/build/assets")

  expect(css).toContain("--primary:")
  expect(css).toContain(".bg-primary")
})
