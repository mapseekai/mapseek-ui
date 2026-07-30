import { access, cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { fileURLToPath } from "node:url"
import { join, resolve } from "node:path"
import { withRegistryServer } from "./registry-server"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))

async function run(cwd: string, command: string[]): Promise<void> {
  const process = Bun.spawn(command, { cwd, stdout: "inherit", stderr: "inherit" })
  if ((await process.exited) !== 0) throw new Error(`${command.join(" ")} failed`)
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export async function assertInstalledItemDestination(fixture: string, name: string): Promise<void> {
  if (await exists(join(fixture, "@"))) throw new Error(`top-level @ directory created for ${name}`)

  const expectedSources = [
    join(fixture, "src", "components", "ui", `${name}.tsx`),
    join(fixture, "src", "lib", "utils.ts"),
  ]
  for (const source of expectedSources) {
    if (!(await exists(source))) throw new Error(`installed ${name} source outside src: ${source}`)
  }
}

export async function verifyItems(names: readonly string[]): Promise<void> {
  await withRegistryServer(async () => {
    for (const name of names) {
      const fixture = await mkdtemp(join(tmpdir(), "mapseek-vite-item-"))
      try {
        await cp(join(repoRoot, "fixtures/vite-react-template"), fixture, { recursive: true })
        const componentsPath = join(fixture, "components.json")
        await writeFile(componentsPath, (await readFile(componentsPath, "utf8")).replace("__REGISTRY_ENDPOINT__", "http://127.0.0.1:4174/r/{name}.json"))
        await run(fixture, ["bun", "install"])
        await run(fixture, ["bunx", "shadcn@4.8.0", "add", `@mapseek/${name}`, "--yes"])
        await assertInstalledItemDestination(fixture, name)
        await run(fixture, ["bun", "run", "typecheck"])
        await run(fixture, ["bun", "run", "build"])
      } finally {
        await rm(fixture, { recursive: true, force: true })
      }
    }
  })
}

if (import.meta.main) await verifyItems(Bun.argv.slice(2))
