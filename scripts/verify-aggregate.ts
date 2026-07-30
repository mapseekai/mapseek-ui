import { cp, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { loadCatalog } from "./registry-model"
import { withRegistryServer } from "./registry-server"

const repoRoot = resolve(import.meta.dir, "..")

async function run(cwd: string, command: string[]): Promise<void> {
  const process = Bun.spawn(command, { cwd, stdout: "inherit", stderr: "inherit" })
  if ((await process.exited) !== 0) throw new Error(`${command.join(" ")} failed`)
}

export async function verifyAggregate(): Promise<void> {
  const fixture = await mkdtemp(join(tmpdir(), "mapseek-vite-aggregate-"))
  try {
    await cp(join(repoRoot, "fixtures/vite-react-smoke"), fixture, { recursive: true })
    await withRegistryServer(async () => {
      const items = await loadCatalog(repoRoot)
      await run(fixture, ["bun", "install"])
      if (items.length > 0) await run(fixture, ["bunx", "shadcn@4.8.0", "add", ...items.map((item) => `@mapseek/${item.name}`), "--yes"])
      await run(fixture, ["bun", "run", "typecheck"])
      await run(fixture, ["bun", "run", "build"])
    })
  } finally {
    await rm(fixture, { recursive: true, force: true })
  }
}

if (import.meta.main) await verifyAggregate()
