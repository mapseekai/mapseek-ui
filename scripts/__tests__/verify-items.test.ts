import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { assertInstalledItemDestination } from "../verify-items"

let fixtureRoot: string

beforeEach(async () => {
  fixtureRoot = await mkdtemp(join(tmpdir(), "mapseek-verify-items-"))
})

afterEach(async () => rm(fixtureRoot, { recursive: true, force: true }))

async function writeFixture(path: string): Promise<void> {
  const target = join(fixtureRoot, path)
  await mkdir(join(target, ".."), { recursive: true })
  await writeFile(target, "export {}")
}

describe("assertInstalledItemDestination", () => {
  it("accepts an item and its utility inside src", async () => {
    await writeFixture("src/components/ui/button.tsx")
    await writeFixture("src/lib/utils.ts")
    await expect(assertInstalledItemDestination(fixtureRoot, "button")).resolves.toBeUndefined()
  })

  it("rejects aliases written outside src", async () => {
    await writeFixture("components/ui/button.tsx")
    await writeFixture("lib/utils.ts")
    await expect(assertInstalledItemDestination(fixtureRoot, "button")).rejects.toThrow("outside src")
  })

  it("rejects a top-level alias directory even when sources are present", async () => {
    await writeFixture("src/components/ui/button.tsx")
    await writeFixture("src/lib/utils.ts")
    await writeFixture("@/components/ui/other.tsx")
    await expect(assertInstalledItemDestination(fixtureRoot, "button")).rejects.toThrow("top-level @ directory")
  })
})
