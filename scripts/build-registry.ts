import { spawn } from "node:child_process"
import { rm } from "node:fs/promises"
import { join, resolve } from "node:path"
import { dlxCommand } from "./pnpm-command"
import { assertGeneratedOutputMatchesCatalog, assertValidCatalog } from "./registry-model"

async function run(command: string[]): Promise<void> {
  const [executable, ...args] = command
  if (!executable) throw new Error("Missing command executable")
  const child = spawn(executable, args, { cwd: repoRoot, stdio: "inherit" })
  const exitCode = await new Promise<number | null>((resolve, reject) => {
    child.once("error", reject)
    child.once("exit", resolve)
  })
  if (exitCode !== 0) throw new Error(`${command.join(" ")} failed`)
}

const repoRoot = resolve(import.meta.dirname, "..")
await rm(join(repoRoot, "public/r"), { recursive: true, force: true })
await assertValidCatalog(repoRoot)
await run(dlxCommand("shadcn@4.8.0", "build"))
await assertGeneratedOutputMatchesCatalog(repoRoot)
