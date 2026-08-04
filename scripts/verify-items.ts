import { spawn } from "node:child_process"
import { access, cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { SHADCN_PACKAGE } from "../shared/shadcn"
import { dlxCommand, pnpmCommand } from "./pnpm-command"
import { loadCatalog } from "./registry-model"
import { withRegistryServer } from "./registry-server"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))

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
    return (
      dependencies.includes("@mapseek/utils") ||
      dependencies.some((dependency) => visit(dependency.slice("@mapseek/".length), seen))
    )
  }
  return visit(name)
}

export async function assertInstalledItemDestination(fixture: string, name: string): Promise<void> {
  if (await exists(join(fixture, "@"))) throw new Error(`top-level @ directory created for ${name}`)

  const item = (await loadCatalog(repoRoot)).find((candidate) => candidate.name === name)
  const hasDirectoryIndex = item?.files.some((file) => file.target === `@ui/${name}/index.ts`)
  const expectedSources =
    item?.type === "registry:block"
      ? [join(fixture, "src", "components", "blocks", name, "index.ts")]
      : [
          hasDirectoryIndex
            ? join(fixture, "src", "components", "ui", name, "index.ts")
            : join(fixture, "src", "components", "ui", `${name}.tsx`),
        ]
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
        await writeFile(
          componentsPath,
          (await readFile(componentsPath, "utf8")).replace(
            "__REGISTRY_ENDPOINT__",
            "http://127.0.0.1:4174/r/{name}.json",
          ),
        )
        await run(fixture, pnpmCommand("install"))
        await run(fixture, dlxCommand(SHADCN_PACKAGE, "add", `@mapseek/${name}`, "--yes"))
        await assertInstalledItemDestination(fixture, name)
        await run(fixture, pnpmCommand("run", "typecheck"))
        await run(fixture, pnpmCommand("run", "build"))
      } finally {
        await rm(fixture, { recursive: true, force: true })
      }
    }
  })
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href)
  await verifyItems(process.argv.slice(2))
