import { spawn } from "node:child_process"
import { cp, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises"
import type { Server } from "node:http"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { afterEach, expect, it } from "vitest"
import { SHADCN_PACKAGE } from "../../shared/shadcn"
import { dlxCommand, npmCommand, pnpmCommand } from "../pnpm-command"
import { startRegistryServer } from "../registry-server"

const repoRoot = resolve(import.meta.dirname, "../..")
const themeVirtualStore = join(repoRoot, "node_modules/.pnpm-theme-install-test").replaceAll(
  "\\",
  "/",
)
let fixture: string | undefined
let server: Server | undefined

afterEach(async () => {
  if (server?.listening) {
    await new Promise<void>((resolve, reject) =>
      server?.close((error) => (error ? reject(error) : resolve())),
    )
  }
  if (fixture) await rm(fixture, { recursive: true, force: true })
}, 60_000)

async function run(cwd: string, command: string[]): Promise<void> {
  const executable = command[0]
  if (executable === undefined) throw new Error("Missing command executable")
  const childProcess = spawn(executable, command.slice(1), {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  await new Promise<void>((resolve, reject) => {
    childProcess.once("error", reject)
    childProcess.once("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${command.join(" ")} failed`)),
    )
  })
}
async function installTheme(fixture: string): Promise<void> {
  await run(fixture, pnpmCommand("install"))
  await run(
    repoRoot,
    dlxCommand(SHADCN_PACKAGE, "add", "@mapseek/theme", "--yes", "--cwd", fixture),
  )
}

async function startServer(): Promise<void> {
  server = await startRegistryServer()
}

it("installs the Mapseek theme with its tokens and dependencies", async () => {
  fixture = await mkdtemp(join(tmpdir(), "mapseek-vite-theme-"))
  await cp(join(repoRoot, "fixtures/vite-react-template"), fixture, { recursive: true })
  await writeFile(join(fixture, ".npmrc"), `virtual-store-dir=${themeVirtualStore}\n`)
  const componentsPath = join(fixture, "components.json")
  await writeFile(
    componentsPath,
    (await readFile(componentsPath, "utf8")).replace(
      "__REGISTRY_ENDPOINT__",
      "http://127.0.0.1:4174/r/{name}.json",
    ),
  )

  await run(repoRoot, pnpmCommand("run", "registry:build"))
  await startServer()
  await installTheme(fixture)
  await run(fixture, npmCommand("run", "build"))
  const assets = await readdir(join(fixture, "dist/assets"))
  const cssAsset = assets.find((path) => path.endsWith(".css"))
  if (cssAsset === undefined) throw new Error("Missing built CSS asset")
  const builtCss = await readFile(join(fixture, "dist/assets", cssAsset), "utf8")
  expect(builtCss).toMatch(/--primary:oklch\(/)
  expect(builtCss).toContain("--radius:0rem")
  expect(builtCss).not.toMatch(/@(theme|utility|custom-variant|apply)\b/)

  const css = await readFile(join(fixture, "src/app.css"), "utf8")
  expect(css).toContain("--color-primary")
  expect(css).toContain(".dark")
  expect(css).toContain("--radius: 0rem")
  expect(css).toContain("--shadow-map-float: none")
  expect(css).toContain("::-webkit-scrollbar-thumb")
  expect(css).not.toContain('@import "@fontsource-variable/geist"')
  expect(css).toContain('@import "@fontsource-variable/geist-mono"')

  const packageJson = JSON.parse(await readFile(join(fixture, "package.json"), "utf8")) as {
    dependencies?: Record<string, string>
  }
  expect(packageJson.dependencies).toMatchObject({
    "@fontsource-variable/geist-mono": expect.any(String),
    "tw-animate-css": expect.any(String),
  })
  expect(packageJson.dependencies).not.toHaveProperty("@fontsource-variable/geist")
}, 360_000)
