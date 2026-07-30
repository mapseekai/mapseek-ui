import { afterEach, expect, it } from "vitest"
import { spawn, type ChildProcess } from "node:child_process"
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { join, resolve } from "node:path"

const repoRoot = resolve(import.meta.dirname, "../..")
let fixture: string | undefined
let server: ChildProcess | undefined

afterEach(async () => {
  server?.kill()
  if (fixture) await rm(fixture, { recursive: true, force: true })
})

async function run(cwd: string, command: string[]): Promise<void> {
  const process = spawn(command[0]!, command.slice(1), { cwd, stdio: "inherit" })
  await new Promise<void>((resolve, reject) => {
    process.once("error", reject)
    process.once("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${command.join(" ")} failed`))))
  })
}
async function installTheme(fixture: string): Promise<void> {
  const installer = join(fixture, "install-theme.ts")
  await writeFile(installer, `const fixture = Bun.argv[2]!
async function run(command: string[]) {
  const process = Bun.spawn(command, { cwd: fixture, stdout: "inherit", stderr: "inherit" })
  if ((await process.exited) !== 0) throw new Error(\`\${command.join(" ")} failed\`)
}
await run(["npm", "install"])
await run(["npx", "--yes", "shadcn@4.8.0", "add", "@mapseek/theme", "--yes", "--cwd", fixture])
`)
  await run(repoRoot, ["bun", installer, fixture])
}


async function startRegistryServer(): Promise<void> {
  server = spawn("bun", ["scripts/registry-server.ts"], { cwd: repoRoot })
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      if ((await fetch("http://127.0.0.1:4174/r/registry.json")).ok) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 25))
  }
  throw new Error("Registry server did not start")
}

it("installs the Mapseek theme with its tokens and dependencies", async () => {
  fixture = await mkdtemp(join(repoRoot, ".mapseek-vite-theme-"))
  await cp(join(repoRoot, "fixtures/vite-react-template"), fixture, { recursive: true })
  const componentsPath = join(fixture, "components.json")
  await writeFile(componentsPath, (await readFile(componentsPath, "utf8")).replace("__REGISTRY_ENDPOINT__", "http://127.0.0.1:4174/r/{name}.json"))

  await run(repoRoot, ["bun", "run", "registry:build"])
  await startRegistryServer()
  await installTheme(fixture)
  await run(fixture, ["npm", "run", "build"])

  const css = await readFile(join(fixture, "src/app.css"), "utf8")
  expect(css).toContain("--color-primary")
  expect(css).toContain(".dark")
  expect(css).toContain("--radius: 0rem")
  expect(css).toContain("--shadow-map-float")
  expect(css).toContain("@keyframes accordion-down")
  expect(css).toContain('@import "@fontsource-variable/geist"')
  expect(css).toContain('@import "@fontsource-variable/geist-mono"')

  const packageJson = JSON.parse(await readFile(join(fixture, "package.json"), "utf8")) as { dependencies?: Record<string, string> }
  expect(packageJson.dependencies).toMatchObject({
    "@fontsource-variable/geist": expect.any(String),
    "@fontsource-variable/geist-mono": expect.any(String),
    "tw-animate-css": expect.any(String),
  })
}, 120_000)
