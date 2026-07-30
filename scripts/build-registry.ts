import { rm } from "node:fs/promises"
import { join, resolve } from "node:path"
import { assertGeneratedOutputMatchesCatalog, assertValidCatalog } from "./registry-model"
import { bunCommand } from "./bun-command"

async function run(command: string[]): Promise<void> {
  const process = Bun.spawn(command, { cwd: repoRoot, stdout: "inherit", stderr: "inherit" })
  if ((await process.exited) !== 0) throw new Error(`${command.join(" ")} failed`)
}

const repoRoot = resolve(import.meta.dir, "..")
await rm(join(repoRoot, "public/r"), { recursive: true, force: true })
await assertValidCatalog(repoRoot)
await run(bunCommand("x", "shadcn@4.8.0", "build"))
await assertGeneratedOutputMatchesCatalog(repoRoot)
