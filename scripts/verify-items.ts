import { access, cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { fileURLToPath } from "node:url"
import { join, resolve } from "node:path"
import { withRegistryServer } from "./registry-server"
import { loadCatalog } from "./registry-model"
import { bunCommand } from "./bun-command"

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

async function requiresUtils(name: string): Promise<boolean> {
  const items = await loadCatalog(repoRoot)
  const byName = new Map(items.map((item) => [item.name, item]))
  const visit = (itemName: string, seen = new Set<string>()): boolean => {
    if (seen.has(itemName)) return false
    seen.add(itemName)
    const dependencies = byName.get(itemName)?.registryDependencies ?? []
    return dependencies.includes("@mapseek/utils") ||
      dependencies.some((dependency) => visit(dependency.slice("@mapseek/".length), seen))
  }
  return visit(name)
}

export async function assertInstalledItemDestination(fixture: string, name: string): Promise<void> {
  if (await exists(join(fixture, "@"))) throw new Error(`top-level @ directory created for ${name}`)

  const item = (await loadCatalog(repoRoot)).find((candidate) => candidate.name === name)
  const expectedSources = item?.type === "registry:block"
    ? [join(fixture, "src", "components", "blocks", name, "index.ts")]
    : [join(fixture, "src", "components", "ui", `${name}.tsx`)]
  if (await requiresUtils(name)) expectedSources.push(join(fixture, "src", "lib", "utils.ts"))
  for (const source of expectedSources) {
    if (!(await exists(source))) throw new Error(`installed ${name} source outside src: ${source}`)
  }
}

export async function verifyItems(names: readonly string[]): Promise<void> {
  await withRegistryServer(async () => {
    for (const name of names) {
      const fixture = await mkdtemp(join(repoRoot, ".verify-item-"))
      try {
        await cp(join(repoRoot, "fixtures/vite-react-template"), fixture, { recursive: true })
        const componentsPath = join(fixture, "components.json")
        await writeFile(componentsPath, (await readFile(componentsPath, "utf8")).replace("__REGISTRY_ENDPOINT__", "http://127.0.0.1:4174/r/{name}.json"))
        await run(fixture, bunCommand("install"))
        await run(fixture, bunCommand("x", "shadcn@4.8.0", "add", `@mapseek/${name}`, "--yes"))
        await assertInstalledItemDestination(fixture, name)
        await run(fixture, bunCommand("run", "typecheck"))
        await run(fixture, bunCommand("run", "build"))
      } finally {
        await rm(fixture, { recursive: true, force: true })
      }
    }
  })
}

if (import.meta.main) await verifyItems(Bun.argv.slice(2))
