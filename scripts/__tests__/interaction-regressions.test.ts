import { once } from "node:events"
import { mkdtemp, rm } from "node:fs/promises"
import { createServer as createHttpServer, type Server } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { type Browser, expect as browserExpect, chromium, type Page } from "@playwright/test"
import { createServer, type ViteDevServer } from "vite"
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from "vitest"

let server: ViteDevServer
let httpServer: Server
let browser: Browser
let page: Page
let baseUrl: string
let errors: string[]
let cacheDir: string

beforeAll(async () => {
  cacheDir = await mkdtemp(join(tmpdir(), "mapseek-interaction-tests-"))
  httpServer = createHttpServer()
  server = await createServer({
    configFile: "showcase/vite.config.ts",
    root: fileURLToPath(new URL("../../", import.meta.url)),
    cacheDir,
    appType: "custom",
    server: { middlewareMode: true, hmr: false, ws: { server: httpServer }, watch: null },
    optimizeDeps: {
      entries: ["scripts/__tests__/interaction-regressions.fixture.tsx"],
      include: ["@codemirror/commands"],
    },
    plugins: [
      {
        name: "interaction-test-page",
        configureServer(vite) {
          vite.middlewares.use("/interaction-test", async (_request, response) => {
            response.setHeader("Content-Type", "text/html")
            response.end(
              await vite.transformIndexHtml(
                "/interaction-test",
                `<style>
                  section[aria-label="Attribute table"] { position: fixed; bottom: 0; left: 0; right: 0; }
                  button[aria-label="Resize attribute table"] { width: 100%; height: 8px; display: block; }
                </style><div id="root"></div>
                <script type="module" src="/scripts/__tests__/interaction-regressions.fixture.tsx"></script>`,
              ),
            )
          })
        },
      },
    ],
  })
  // Finish the static import crawl and dependency writes before navigation.
  // Under parallel test load, cold prebundling can exceed the action timeout.
  await server.transformRequest("/scripts/__tests__/interaction-regressions.fixture.tsx")
  await server.waitForRequestsIdle()
  const optimizer = server.environments.client.depsOptimizer
  await optimizer?.scanProcessing
  await Promise.all(
    optimizer?.metadata.depInfoList.map((dependency) => dependency.processing) ?? [],
  )

  httpServer.on("request", server.middlewares)
  httpServer.listen(0, "127.0.0.1")
  await once(httpServer, "listening")
  const address = httpServer.address()
  if (!address || typeof address === "string") throw new Error("Missing HTTP test server port")
  baseUrl = `http://127.0.0.1:${address.port}/`
  browser = await chromium.launch({ headless: true })
}, 60_000)

beforeEach(async () => {
  errors = []
  page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  page.setDefaultTimeout(5000)
  page.on("pageerror", (error) => errors.push(error.message))
})

afterEach(async () => {
  await page?.close()
  expect(errors).toEqual([])
})

afterAll(async () => {
  try {
    await browser?.close()
  } finally {
    try {
      if (httpServer?.listening) {
        httpServer.closeAllConnections()
        await new Promise<void>((resolve, reject) => {
          httpServer.close((error) => (error ? reject(error) : resolve()))
        })
      }
    } finally {
      try {
        await server?.close()
      } finally {
        if (cacheDir) await rm(cacheDir, { recursive: true, force: true })
      }
    }
  }
}, 30_000)

it("undoes and redoes a full JSON replacement and consecutive typing", async () => {
  await page.goto(`${baseUrl}interaction-test?component=json`)
  const editor = page.getByRole("textbox", { name: "JSON document" })
  const original = '{"enabled": true, "name": "Original"}'
  await browserExpect(editor).toHaveText(original)
  await editor.click()
  await page.keyboard.press("ControlOrMeta+a")
  await page.keyboard.insertText('{"review":123}')
  await browserExpect(editor).toHaveText('{"review":123}')
  await page.keyboard.press("ControlOrMeta+z")
  await browserExpect(editor).toHaveText(original)
  await page.keyboard.press("ControlOrMeta+Shift+z")
  await browserExpect(editor).toHaveText('{"review":123}')
  await page.keyboard.press("End")
  await page.keyboard.press("ArrowLeft")
  await page.keyboard.type("45")
  await browserExpect(editor).toHaveText('{"review":12345}')
  await page.keyboard.press("ControlOrMeta+z")
  await browserExpect(editor).toHaveText('{"review":123}')
  await page.keyboard.press("ControlOrMeta+Shift+z")
  await browserExpect(editor).toHaveText('{"review":12345}')
}, 30_000)

it("keeps an external JSON replacement coherent across undo and redo", async () => {
  await page.goto(`${baseUrl}interaction-test?component=json`)
  const editor = page.getByRole("textbox", { name: "JSON document" })
  await editor.click()
  await page.keyboard.press("ControlOrMeta+a")
  await page.keyboard.insertText('{"review":123}')
  await page.getByRole("button", { name: "Load external JSON" }).click()
  await browserExpect(editor).toHaveText('{"external": true}')
  await editor.click()
  await page.keyboard.press("ControlOrMeta+z")
  await browserExpect(editor).toHaveText('{"review":123}')
  await page.keyboard.press("ControlOrMeta+Shift+z")
  await browserExpect(editor).toHaveText('{"external": true}')
}, 30_000)

it("enters and leaves fullscreen within one continuous sheet drag", async () => {
  await page.goto(`${baseUrl}interaction-test?component=sheet`)
  const sheet = page.getByRole("region", { name: "Attribute table" })
  const handle = page.getByRole("button", { name: "Resize attribute table" })
  await browserExpect(sheet).toHaveCSS("height", "320px")
  await handle.hover()
  await page.mouse.down()
  await page.mouse.move(640, 120)
  await browserExpect(sheet).toHaveCSS("height", "800px")
  await page.mouse.move(640, 500)
  await browserExpect(sheet).toHaveCSS("height", "300px")
  await page.mouse.up()
  await page.mouse.move(640, 400)
  await browserExpect(sheet).toHaveCSS("height", "300px")
  await page.getByRole("button", { name: "Toggle fullscreen" }).click()
  await browserExpect(sheet).toHaveCSS("height", "800px")
  await page.getByRole("button", { name: "Toggle fullscreen" }).click()
  await browserExpect(sheet).toHaveCSS("height", "300px")
}, 30_000)

it("preserves an empty color draft while clearing, reopening, and typing a new color", async () => {
  await page.goto(`${baseUrl}interaction-test?component=color`)
  const input = page.getByRole("textbox", { name: "Color", exact: true })
  await input.fill("")
  await page.getByRole("button", { name: "Clear externally" }).focus()
  await browserExpect(input).toHaveValue("")
  await page.getByRole("button", { name: "Choose color" }).click()
  await browserExpect(input).toHaveValue("")
  await input.fill("#")
  await browserExpect(input).toHaveValue("#")
  await input.fill("#ff0000")
  await browserExpect(input).toHaveValue("#ff0000")
  await page.getByRole("button", { name: "Choose color" }).click()
  await page.getByRole("button", { name: "Clear externally" }).click()
  await browserExpect(input).toHaveValue("")
  await page.getByRole("button", { name: "Toggle disabled" }).click()
  await browserExpect(input).toBeDisabled()
  await browserExpect(input).toHaveValue("")
  await browserExpect(page.getByRole("button", { name: "Choose color" })).toBeDisabled()
}, 30_000)

it("stops a live drag when the sheet unmounts", async () => {
  await page.goto(`${baseUrl}interaction-test?component=sheet`)
  await page.getByRole("button", { name: "Resize attribute table" }).hover()
  await page.mouse.down()
  await page.mouse.move(640, 450)
  const height = page.getByRole("status", { name: "Sheet height" })
  await browserExpect(height).toHaveText("350")
  await page.getByRole("button", { name: "Toggle sheet" }).focus()
  await page.keyboard.press("Enter")
  await browserExpect(page.getByRole("region", { name: "Attribute table" })).toHaveCount(0)
  await page.mouse.move(640, 300)
  await page.evaluate(() => new Promise(requestAnimationFrame))
  await browserExpect(height).toHaveText("350")
  await page.mouse.up()
}, 30_000)
