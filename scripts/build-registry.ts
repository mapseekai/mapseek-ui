import { spawn } from "node:child_process"
import { cp, rm } from "node:fs/promises"
import { join, resolve } from "node:path"
import { SHADCN_PACKAGE } from "../shared/shadcn"
import { dlxCommand } from "./pnpm-command"
import { assertGeneratedOutputMatchesCatalog, assertValidCatalog } from "./registry-model"

async function run(command: string[]): Promise<void> {
  const [executable, ...args] = command
  if (!executable) throw new Error("Missing command executable")
  const child = spawn(executable, args, {
    cwd: repoRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  const exitCode = await new Promise<number | null>((resolve, reject) => {
    child.once("error", reject)
    child.once("exit", resolve)
  })
  if (exitCode !== 0) throw new Error(`${command.join(" ")} failed`)
}

const repoRoot = resolve(import.meta.dirname, "..")
const registryOutput = join(repoRoot, "public/r")
const docsRegistryOutput = join(repoRoot, "packages/docs/public/r")
await Promise.all([
  rm(registryOutput, { recursive: true, force: true }),
  rm(docsRegistryOutput, { recursive: true, force: true }),
])
await assertValidCatalog(repoRoot)
await run(dlxCommand(SHADCN_PACKAGE, "build"))
await assertGeneratedOutputMatchesCatalog(repoRoot)
await cp(registryOutput, docsRegistryOutput, { recursive: true })
