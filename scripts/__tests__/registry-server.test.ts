import { type ChildProcess, spawn } from "node:child_process"
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { afterEach, expect, it } from "vitest"

const repoRoot = resolve(import.meta.dirname, "../..")
const publicRoot = join(repoRoot, "public")
let server: ChildProcess | undefined
let cleanup: (() => Promise<void>) | undefined

afterEach(async () => {
  server?.kill()
  await cleanup?.()
})

it("rejects public symlinks that resolve outside the public root", async () => {
  const outside = await mkdtemp(join(tmpdir(), "mapseek-server-outside-"))
  const link = join(publicRoot, "outside.json")
  await writeFile(join(outside, "outside.json"), '{"private":true}')
  await mkdir(publicRoot, { recursive: true })
  await symlink(join(outside, "outside.json"), link)
  cleanup = async () => {
    await rm(link, { force: true })
    await rm(outside, { recursive: true, force: true })
  }
  server = spawn("tsx", ["scripts/registry-server.ts"], { cwd: repoRoot })
  let response: Response | undefined
  // A separate process owns the fixed port; retrying observes its real readiness.
  for (let attempt = 0; attempt < 20 && !response; attempt += 1) {
    try {
      response = await fetch("http://127.0.0.1:4174/outside.json")
    } catch {
      const { promise, resolve: continueAfterStartup } = Promise.withResolvers<void>()
      setTimeout(continueAfterStartup, 25)
      await promise
    }
  }
  expect(response?.status).toBe(403)
})
