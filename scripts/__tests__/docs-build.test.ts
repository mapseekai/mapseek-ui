import { expect, it } from "vitest"

it("declares the Docusaurus docs workspace contract", async () => {
  const root = await Bun.file("package.json").json()
  const docs = await Bun.file("packages/docs/package.json").json()

  expect(root.workspaces).toEqual(["packages/*"])
  expect(root.scripts["docs:build"]).toContain("registry:build")
  expect(root.scripts["docs:build"]).toContain("bun run --cwd packages/docs build")
  expect(root.scripts["docs:dev"]).toContain("bun run --cwd packages/docs start")
  expect(root.scripts["docs:dev:en"]).toContain(
    "bun run --cwd packages/docs start -- --locale en",
  )
  expect(root.scripts["docs:serve"]).toBe("bun run --cwd packages/docs serve")
  expect(docs.dependencies).toMatchObject({
    "@docusaurus/core": "3.10.2",
    "@docusaurus/preset-classic": "3.10.2",
    "@docusaurus/types": "3.10.2",
  })
})
