import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises"
import type { Server } from "node:http"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { afterEach, expect, it } from "vitest"
import { startRegistryServer } from "../registry-server"

const repoRoot = resolve(import.meta.dirname, "../..")
const publicRoot = join(repoRoot, "public")
let server: Server | undefined
let cleanup: (() => Promise<void>) | undefined

afterEach(async () => {
  if (server?.listening) {
    await new Promise<void>((resolve, reject) =>
      server?.close((error) => (error ? reject(error) : resolve())),
    )
  }
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
  server = await startRegistryServer()
  const response = await fetch("http://127.0.0.1:4174/outside.json")
  expect(response.status).toBe(403)
})
