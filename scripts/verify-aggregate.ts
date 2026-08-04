import { spawn } from "node:child_process"
import { cp, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { SHADCN_PACKAGE } from "../shared/shadcn"
import { dlxCommand, pnpmCommand } from "./pnpm-command"
import { loadCatalog } from "./registry-model"
import { withRegistryServer } from "./registry-server"

const repoRoot = resolve(import.meta.dirname, "..")

async function run(cwd: string, command: string[]): Promise<void> {
  const [executable, ...args] = command
  if (!executable) throw new Error("Missing command executable")
  const child = spawn(executable, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  const exitCode = await new Promise<number | null>((resolve, reject) => {
    child.once("error", reject)
    child.once("exit", resolve)
  })
  if (exitCode !== 0) throw new Error(`${command.join(" ")} failed`)
}

export async function verifyAggregate(): Promise<void> {
  const fixture = await mkdtemp(join(tmpdir(), "mapseek-vite-aggregate-"))
  try {
    await cp(join(repoRoot, "fixtures/vite-react-smoke"), fixture, { recursive: true })
    await withRegistryServer(async () => {
      const items = await loadCatalog(repoRoot)
      await run(fixture, pnpmCommand("install"))
      if (items.length > 0)
        await run(
          fixture,
          dlxCommand(
            SHADCN_PACKAGE,
            "add",
            ...items.map((item) => `@mapseek/${item.name}`),
            "--yes",
          ),
        )
      await run(fixture, pnpmCommand("run", "typecheck"))
      await run(fixture, pnpmCommand("run", "build"))
    })
  } finally {
    await rm(fixture, { recursive: true, force: true })
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await verifyAggregate()
