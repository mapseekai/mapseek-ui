import { access, readFile, realpath, stat } from "node:fs/promises"
import { createServer } from "node:http"
import { extname, resolve, sep } from "node:path"
import { type Browser, chromium, expect, type Locator, type Page } from "@playwright/test"
import { SHADCN_PACKAGE } from "../shared/shadcn"

type DocsVisualCase =
  | "smoke"
  | "button"
  | "dialog"
  | "color-input"
  | "pilots"
  | "onboarding"
  | "release"
type DocsVisualCategory = "block" | "primitive"
type DocsTheme = "dark" | "light"
type DocsViewportName = "desktop" | "mobile"
type BlockPage = {
  readonly name: string
  readonly demo: string
  readonly sourceFunction: string
  readonly importPath: string
}

type CliOptions = {
  readonly baseUrl?: string
  readonly browserChannel?: string
  readonly category?: DocsVisualCategory
  readonly only?: readonly string[]
  readonly caseName: DocsVisualCase
  readonly port: number
}

function readOption(name: string): string | undefined {
  const index = process.argv.indexOf(name)

  if (index === -1) {
    return undefined
  }

  return process.argv[index + 1]
}

function readCliOptions(): CliOptions {
  const baseUrl = readOption("--base-url")
  const browserChannel = readOption("--browser-channel")
  const category = readOption("--category")
  const caseName = readOption("--case") ?? "smoke"
  const only = readOption("--only")?.split(",").filter(Boolean)
  const port = Number(readOption("--port") ?? process.env.DOCS_VISUAL_PORT ?? "4175")

  if (
    caseName !== "smoke" &&
    caseName !== "button" &&
    caseName !== "dialog" &&
    caseName !== "color-input" &&
    caseName !== "pilots" &&
    caseName !== "onboarding" &&
    caseName !== "release"
  ) {
    throw new Error(`Unsupported docs visual QA case: ${caseName}`)
  }

  if (category !== undefined && category !== "primitive" && category !== "block") {
    throw new Error(`Unsupported docs visual QA category: ${category}`)
  }
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Unsupported docs visual QA port: ${port}`)
  }

  return { baseUrl, browserChannel, category, only, caseName, port }
}

function contentType(path: string): string {
  if (path.endsWith(".html")) return "text/html; charset=utf-8"
  if (path.endsWith(".css")) return "text/css; charset=utf-8"
  if (path.endsWith(".js")) return "text/javascript; charset=utf-8"
  if (path.endsWith(".json")) return "application/json; charset=utf-8"
  if (path.endsWith(".svg")) return "image/svg+xml"
  if (path.endsWith(".png")) return "image/png"
  if (path.endsWith(".webp")) return "image/webp"
  return "application/octet-stream"
}

async function existingFile(path: string): Promise<string | undefined> {
  try {
    const info = await stat(path)
    if (info.isFile()) return path
  } catch {}
  return undefined
}

async function resolveStaticFile(buildRoot: string, pathname: string): Promise<string | undefined> {
  let decoded: string
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    return undefined
  }
  if (!decoded.startsWith("/")) return undefined

  const candidates = decoded.endsWith("/")
    ? [resolve(buildRoot, `.${decoded}index.html`)]
    : [resolve(buildRoot, `.${decoded}`), resolve(buildRoot, `.${decoded}/index.html`)]
  const realBuildRoot = await realpath(buildRoot)

  for (const candidate of candidates) {
    const file = await existingFile(candidate)
    if (!file) continue
    const realFile = await realpath(file)
    if (realFile !== realBuildRoot && realFile.startsWith(`${realBuildRoot}${sep}`)) {
      return realFile
    }
  }
  return undefined
}

async function startStaticPreview(
  requestedPort: number,
): Promise<{ readonly baseUrl: string; stop(): void }> {
  const buildRoot = resolve(import.meta.dirname, "../packages/docs/out")
  await access(resolve(buildRoot, "index.html"))

  for (let offset = 0; offset < 20; offset += 1) {
    const port =
      requestedPort + offset === 4174 ? requestedPort + offset + 1 : requestedPort + offset
    try {
      const server = createServer((request, response) => {
        void (async () => {
          const file = await resolveStaticFile(
            buildRoot,
            new URL(request.url ?? "/", "http://127.0.0.1").pathname,
          )
          if (!file) {
            response.writeHead(404).end("Not found")
            return
          }
          response
            .writeHead(200, { "content-type": contentType(extname(file)) })
            .end(await readFile(file))
        })()
      })
      await new Promise<void>((resolve, reject) => {
        server.once("error", reject)
        server.listen(port, "127.0.0.1", resolve)
      })
      const baseUrl = `http://127.0.0.1:${port}`
      await assertPreviewIsAvailable(baseUrl)
      return { baseUrl, stop: () => void server.close() }
    } catch {}
  }

  throw new Error(`Unable to start docs static preview near port ${requestedPort}`)
}

async function assertPreviewIsAvailable(baseUrl: string) {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error(`Docs preview is not ready at ${baseUrl}: HTTP ${response.status}`)
  }
}

async function launchBrowser(browserChannel?: string): Promise<Browser> {
  return chromium.launch(browserChannel ? { channel: browserChannel } : undefined)
}

async function runSmokeCase(baseUrl: string, browserChannel?: string) {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await launchBrowser(browserChannel)

  try {
    const page = await (
      await browser.newContext({
        baseURL: baseUrl,
        permissions: ["clipboard-read", "clipboard-write"],
      })
    ).newPage()

    await page.goto("/components/_smoke")
    await expect(page.getByRole("heading", { level: 1, name: "Smoke", exact: true })).toBeVisible()
    await expect(page.getByText("Smoke demo rendered")).toBeVisible()

    await page.locator('[data-demo-action="source"]').click()
    await expect(page.locator("pre code")).toContainText("export function SmokeDemo")

    await page.locator('[data-demo-action="copy"]').click()
    await expect(page.locator('[data-copy-status="copied"]')).toHaveText(/\S/)

    await page.locator('[data-demo-action="reset"]').click()
    await expect(page.locator('[data-reset-revision="1"]')).toHaveText(/\S/)

    const themeToggle = page.locator("[data-theme-toggle]").first()
    await expect(themeToggle).toBeVisible()
    await themeToggle.click()
    await expect(page.locator("html")).toHaveClass(/(^|\s)dark(\s|$)/)
    await themeToggle.click()
    await expect(page.locator("html")).toHaveClass(/(^|\s)light(\s|$)/)
  } finally {
    await browser.close()
  }
}

async function runButtonCase(baseUrl: string, browserChannel?: string) {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await launchBrowser(browserChannel)

  try {
    const page = await (
      await browser.newContext({
        baseURL: baseUrl,
        permissions: ["clipboard-read", "clipboard-write"],
      })
    ).newPage()

    await page.goto("/components/button")
    await assertButtonPilot(page, "/components/button")
  } finally {
    await browser.close()
  }
}

async function runColorInputCase(baseUrl: string, browserChannel?: string) {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await launchBrowser(browserChannel)

  try {
    const page = await (
      await browser.newContext({
        baseURL: baseUrl,
        viewport: { width: 1280, height: 720 },
      })
    ).newPage()

    await page.goto("/components/color-input")
    await assertPrimitiveInteraction(page, "color-input", "/components/color-input")
  } finally {
    await browser.close()
  }
}

async function assertButtonPilot(page: Page, path: string): Promise<void> {
  await expect(page.getByRole("heading", { level: 1, name: "Button", exact: true })).toBeVisible()
  await assertLocalizedSentinelLabels(page, path, sharedWidgetSentinels)
  await assertInstallWidget(page, path)

  const basicPreview = page.locator('[data-demo="button-basic"]')
  const variantsPreview = page.locator('[data-demo="button-variants"]')
  const sizesPreview = page.locator('[data-demo="button-sizes"]')
  await expect(basicPreview).toBeVisible()
  await expect(variantsPreview).toBeVisible()
  await expect(sizesPreview).toBeVisible()

  await expect(page.locator('[data-demo="button-variant-default"]')).toBeVisible()
  await expect(page.locator('[data-demo="button-variant-secondary"]')).toBeVisible()
  await expect(page.locator('[data-demo="button-variant-outline"]')).toBeVisible()
  await expect(page.locator('[data-demo="button-variant-ghost"]')).toBeVisible()
  await expect(page.locator('[data-demo="button-variant-destructive"]')).toBeVisible()
  await expect(page.locator('[data-demo="button-variant-link"]')).toBeVisible()

  await expect(page.locator('[data-demo="button-size-xs"]')).toBeVisible()
  await expect(page.locator('[data-demo="button-size-sm"]')).toBeVisible()
  await expect(page.locator('[data-demo="button-size-default"]')).toBeVisible()
  await expect(page.locator('[data-demo="button-size-lg"]')).toBeVisible()

  await page.locator('[data-demo="button-primary-action"]').click()
  await expect(page.locator('[data-demo="button-press-count"]')).toHaveText(
    localized(path, "点击次数：1", "Presses: 1"),
  )

  const basicDemo = basicPreview.locator("xpath=ancestor::section")
  await basicDemo.locator('[data-demo-action="source"]').click()
  await expect(basicDemo.locator("pre code")).toContainText("export function ButtonBasicDemo")
  await expect(basicDemo.locator("pre code")).toContainText(
    'import { Button } from "@registry/ui/button"',
  )

  await basicDemo.locator('[data-demo-action="reset"]').click()
  await expect(basicDemo.locator('[data-reset-revision="1"]')).toBeVisible()
  await expect(page.locator('[data-demo="button-press-count"]')).toHaveText(
    localized(path, "点击次数：0", "Presses: 0"),
  )
}

async function setDocsTheme(page: Page, theme: DocsTheme): Promise<void> {
  // Late hydration (next-themes mount) can re-apply the stored theme once and
  // clobber the class we set; re-apply inside a poll until the class settles.
  await expect(async () => {
    await page.evaluate((nextTheme) => {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(nextTheme)
      localStorage.setItem("theme", nextTheme)
    }, theme)
    const current = await page.locator("html").getAttribute("class")
    expect(current ?? "").toMatch(new RegExp(`(^|\\s)${theme}(\\s|$)`))
  }).toPass({ timeout: 5000 })
}

async function assertDialogPortalIsVisible(page: Page): Promise<void> {
  const dialog = page.locator('[data-slot="dialog-content"]').last()
  await expect(dialog).toBeVisible()

  const viewport = page.viewportSize()
  const box = await dialog.boundingBox()
  if (!viewport || !box) throw new Error("Dialog portal bounding box is unavailable.")
  if (
    box.x < 0 ||
    box.y < 0 ||
    box.x + box.width > viewport.width ||
    box.y + box.height > viewport.height
  ) {
    throw new Error(`Dialog portal is outside the viewport: ${JSON.stringify({ box, viewport })}`)
  }

  const isInsideDemo = await dialog.evaluate((element) => element.closest("[data-demo]") !== null)
  if (isInsideDemo) throw new Error("Dialog content was clipped inside the demo surface.")
}

async function openAndAssertDialog(page: Page, trigger: Locator): Promise<void> {
  await trigger.click()
  await assertDialogPortalIsVisible(page)
}

async function closeWithEscapeAndAssertFocus(page: Page, trigger: Locator): Promise<void> {
  await page.keyboard.press("Escape")
  await expect(page.locator('[data-slot="dialog-content"]')).toBeHidden()
  await expect(trigger).toBeFocused()
}

async function closeWithButtonAndAssertFocus(
  trigger: Locator,
  closeButton: Locator,
): Promise<void> {
  await closeButton.click()
  await expect(trigger).toBeFocused()
}

function localizedDiscardStatus(path: string): string {
  return path.startsWith("/en/") ? "Discarded changes" : "已放弃修改"
}

async function runDialogCase(baseUrl: string, browserChannel?: string) {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await launchBrowser(browserChannel)

  try {
    const page = await (
      await browser.newContext({
        baseURL: baseUrl,
        viewport: { width: 1280, height: 720 },
        permissions: ["clipboard-read", "clipboard-write"],
      })
    ).newPage()

    for (const path of ["/components/dialog", "/en/components/dialog"] as const) {
      for (const theme of ["light", "dark"] as const) {
        await page.goto(path)
        await setDocsTheme(page, theme)
        await assertDialogPilot(page, path)
      }
    }
  } finally {
    await browser.close()
  }
}

async function assertDialogPilot(page: Page, path: string): Promise<void> {
  await expect(page.getByRole("heading", { level: 1, name: "Dialog", exact: true })).toBeVisible()

  const uncontrolledTrigger = page.locator('[data-demo="dialog-basic-uncontrolled-trigger"]')
  await openAndAssertDialog(page, uncontrolledTrigger)
  await closeWithButtonAndAssertFocus(
    uncontrolledTrigger,
    page.locator('[data-demo="dialog-basic-cancel"]'),
  )

  const controlledTrigger = page.locator('[data-demo="dialog-basic-controlled-trigger"]')
  await openAndAssertDialog(page, controlledTrigger)
  await closeWithEscapeAndAssertFocus(page, controlledTrigger)

  const confirmationTrigger = page.locator('[data-demo="dialog-confirmation-trigger"]')
  await openAndAssertDialog(page, confirmationTrigger)
  await closeWithButtonAndAssertFocus(
    confirmationTrigger,
    page.locator('[data-demo="dialog-confirmation-cancel"]'),
  )
  await openAndAssertDialog(page, confirmationTrigger)
  await page.locator('[data-demo="dialog-confirmation-save"]').click()
  await expect(confirmationTrigger).toBeFocused()
  await openAndAssertDialog(page, confirmationTrigger)
  await closeWithButtonAndAssertFocus(
    confirmationTrigger,
    page.locator('[data-demo="dialog-confirmation-discard"]'),
  )
  await expect(page.locator('[data-demo="dialog-confirmation-status"]')).toContainText(
    localizedDiscardStatus(path),
  )

  const longContentTrigger = page.locator('[data-demo="dialog-long-content-trigger"]')
  await openAndAssertDialog(page, longContentTrigger)
  await closeWithEscapeAndAssertFocus(page, longContentTrigger)
}

async function assertNoHorizontalOverflow(locator: Locator, label: string): Promise<void> {
  let lastSample: { clientWidth: number; scrollWidth: number } | undefined
  try {
    await expect
      .poll(
        async () => {
          lastSample = await locator.evaluate((element) => ({
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
          }))
          return lastSample.scrollWidth <= lastSample.clientWidth + 1
        },
        { timeout: 5000 },
      )
      .toBe(true)
  } catch {
    const offenders = await locator.evaluate((root) => {
      const bounds = root.getBoundingClientRect()
      const hits: string[] = []
      for (const el of root.querySelectorAll("*")) {
        const r = el.getBoundingClientRect()
        if (r.right > bounds.right + 1) {
          let clipped = false
          let guard = el.parentElement
          while (guard && guard !== root) {
            const overflowX = getComputedStyle(guard).overflowX
            if (overflowX !== "visible") {
              clipped = true
              break
            }
            guard = guard.parentElement
          }
          if (!clipped)
            hits.push(
              `${el.tagName}.${(typeof el.className === "string" ? el.className : "").slice(0, 60)} right=${Math.round(r.right)} text=${(el.textContent ?? "").slice(0, 24)}`,
            )
          if (hits.length >= 4) break
        }
      }
      return hits
    })
    throw new Error(
      `${label} has horizontal overflow: ${JSON.stringify(lastSample)} offenders=${JSON.stringify(offenders)}`,
    )
  }
}

async function assertWithinViewport(locator: Locator, label: string): Promise<void> {
  const page = locator.page()
  let lastSample: unknown
  try {
    await expect
      .poll(
        async () => {
          const viewport = page.viewportSize()
          const box = await locator.boundingBox()
          if (!viewport || !box) return { fits: false, viewport, box }
          const sample = {
            fits:
              box.x >= -1 &&
              box.y >= -1 &&
              box.x + box.width <= viewport.width + 1 &&
              box.y + box.height <= viewport.height + 1,
            viewport,
            box,
          }
          lastSample = sample
          return sample
        },
        { message: `${label} stays within the viewport` },
      )
      .toMatchObject({ fits: true })
  } catch (error) {
    throw new Error(`${label} viewport fit failed: ${JSON.stringify(lastSample)}`, {
      cause: error,
    })
  }
}

async function activateByKeyboard(locator: Locator): Promise<void> {
  await locator.focus()
  await locator.page().keyboard.press("Enter")
}

async function assertLayerPanelDemoFits(root: Locator, label: string): Promise<void> {
  await assertNoHorizontalOverflow(root, `${label} demo`)
  const panel = root.locator('[data-slot="layer-panel"]')
  await panel.evaluate((element) => element.scrollIntoView({ block: "center" }))
  await assertWithinViewport(panel, `${label} panel`)
}

async function assertLayerPanelPilot(page: Page, path: string): Promise<void> {
  await expect(
    page.getByRole("heading", { level: 1, name: "LayerPanel", exact: true }),
  ).toBeVisible()

  const demo = page.locator('[data-demo="layer-panel"]')
  await expect(demo).toBeVisible()
  await demo.scrollIntoViewIfNeeded()
  await assertLayerPanelDemoFits(demo, `${path} LayerPanel`)

  const panel = demo.locator('[data-slot="layer-panel"]')
  await panel
    .getByRole("button", {
      name: path.startsWith("/en/") ? "Collapse layer panel" : "收起图层面板",
    })
    .click()
  await expect(panel).toHaveAttribute("data-collapsed", "true")
  await panel
    .getByRole("button", {
      name: path.startsWith("/en/") ? "Expand layer panel" : "展开图层面板",
    })
    .click()
  await expect(panel).not.toHaveAttribute("data-collapsed", "true")

  const search = panel.getByLabel(path.startsWith("/en/") ? "Search layers" : "搜索图层")
  await search.fill(path.startsWith("/en/") ? "road" : "道路")
  await expect(
    panel.getByText(path.startsWith("/en/") ? "Road centerlines" : "道路中心线"),
  ).toBeVisible()
  await expect(panel.getByText(path.startsWith("/en/") ? "Land use" : "用地分类")).toHaveCount(0)
  await search.fill("")

  await activateByKeyboard(
    panel.getByRole("button", {
      name: path.startsWith("/en/") ? "Hide layer Road centerlines" : "隐藏图层 道路中心线",
    }),
  )
  await expect(
    panel.getByRole("button", {
      name: path.startsWith("/en/") ? "Show layer Road centerlines" : "显示图层 道路中心线",
    }),
  ).toBeVisible()
  await assertLayerPanelDemoFits(demo, `${path} interactive LayerPanel`)
}

async function runPilotsCase(baseUrl: string, browserChannel?: string): Promise<void> {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await launchBrowser(browserChannel)
  const viewports: Record<DocsViewportName, { width: number; height: number }> = {
    desktop: { width: 1280, height: 720 },
    mobile: { width: 390, height: 760 },
  }

  try {
    for (const viewport of Object.values(viewports)) {
      const page = await (
        await browser.newContext({
          baseURL: baseUrl,
          permissions: ["clipboard-read", "clipboard-write"],
          viewport,
        })
      ).newPage()
      try {
        for (const path of ["/components/button", "/en/components/button"] as const) {
          for (const theme of ["light", "dark"] as const) {
            await page.goto(path)
            await setDocsTheme(page, theme)
            await assertButtonPilot(page, path)
          }
        }

        for (const path of ["/components/dialog", "/en/components/dialog"] as const) {
          for (const theme of ["light", "dark"] as const) {
            await page.goto(path)
            await setDocsTheme(page, theme)
            await assertDialogPilot(page, path)
          }
        }

        for (const path of ["/blocks/layer-panel", "/en/blocks/layer-panel"] as const) {
          for (const theme of ["light", "dark"] as const) {
            await page.goto(path)
            await setDocsTheme(page, theme)
            await assertLayerPanelPilot(page, path)
          }
        }
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
}

async function assertLocalizedIndexFilter(
  page: Page,
  path: string,
  searchLabel: string,
  query: string,
  expectedCard: string,
  hiddenCard?: string,
): Promise<void> {
  await page.goto(path)
  const search = page.getByLabel(searchLabel, { exact: true })
  await expect(search).toBeVisible()
  await search.fill(query)
  await expect(page.locator(`[data-component-card="${expectedCard}"]`)).toBeVisible()
  if (hiddenCard) await expect(page.locator(`[data-component-card="${hiddenCard}"]`)).toBeHidden()
}

async function assertLocaleDropdownPreservesPath(page: Page, path: string): Promise<void> {
  await page.goto(path)
  const localeDropdown = page.getByRole("button", { name: "简体中文", exact: true })
  await expect(localeDropdown).toBeVisible()
  await localeDropdown.click()

  const englishLink = page.getByRole("link", { name: "English", exact: true })
  await expect(englishLink).toBeVisible()
  await englishLink.click()
  await expect(page).toHaveURL(new RegExp(`/en${path.replaceAll("/", "\\/")}\\/?$`))
  await expect(
    page.getByRole("heading", { level: 1, name: "Install Mapseek UI", exact: true }),
  ).toBeVisible()
}

async function runOnboardingCase(baseUrl: string, browserChannel?: string): Promise<void> {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await launchBrowser(browserChannel)

  try {
    const page = await (
      await browser.newContext({
        baseURL: baseUrl,
        viewport: { width: 1280, height: 720 },
        permissions: ["clipboard-read", "clipboard-write"],
      })
    ).newPage()

    await page.goto("/")
    await page.getByRole("link", { name: "安装", exact: true }).click()
    await expect(
      page.getByRole("heading", { level: 1, name: "安装 Mapseek UI", exact: true }),
    ).toBeVisible()
    const article = page.getByRole("article")
    await expect(article.getByRole("link", { name: "主题", exact: true })).toHaveAttribute(
      "href",
      /^\/getting-started\/theming\/?$/,
    )
    await expect(article.getByRole("link", { name: "Registry", exact: true })).toHaveAttribute(
      "href",
      /^\/getting-started\/registry\/?$/,
    )

    await assertLocalizedIndexFilter(page, "/components", "搜索组件", "Button", "button", "dialog")
    await assertLocalizedIndexFilter(
      page,
      "/en/components",
      "Search components",
      "Button",
      "button",
    )
    await assertLocalizedIndexFilter(page, "/blocks", "搜索区块", "LayerPanel", "layer-panel")
    await assertLocalizedIndexFilter(
      page,
      "/en/blocks",
      "Search blocks",
      "LayerPanel",
      "layer-panel",
    )
    await assertLocaleDropdownPreservesPath(page, "/getting-started/installation")
  } finally {
    await browser.close()
  }
}

async function runReleaseCase(baseUrl: string, browserChannel?: string): Promise<void> {
  await runOnboardingCase(baseUrl, browserChannel)
  await runPilotsCase(baseUrl, browserChannel)
  await runPrimitiveCategoryCase(baseUrl, browserChannel)
  await runBlockCategoryCase(baseUrl, browserChannel)
}

const primitivePages = [
  "accordion",
  "avatar",
  "badge",
  "calendar",
  "card",
  "chart",
  "checkbox",
  "color-input",
  "collapsible",
  "combobox",
  "command",
  "confirm-dialog",
  "context-menu",
  "dropdown-menu",
  "empty",
  "field",
  "icon-button",
  "input",
  "input-group",
  "json-viewer",
  "label",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "separator",
  "select",
  "sheet",
  "skeleton",
  "sonner",
  "slider",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle",
  "toggle-group",
  "tooltip",
] as const

const blockPages = [
  {
    name: "custom-colormap",
    demo: "custom-colormap",
    sourceFunction: "CustomColormapDemo",
    importPath: "@registry/blocks/custom-colormap",
  },
  {
    name: "toolbox",
    demo: "toolbox",
    sourceFunction: "ToolboxDemo",
    importPath: "@registry/blocks/toolbox",
  },
  {
    name: "toolbar",
    demo: "toolbar",
    sourceFunction: "ToolbarDemo",
    importPath: "@registry/blocks/toolbar",
  },
  {
    name: "app-top-bar",
    demo: "app-top-bar",
    sourceFunction: "AppTopBarDemo",
    importPath: "@registry/blocks/app-top-bar",
  },
  {
    name: "crs-picker",
    demo: "crs-picker",
    sourceFunction: "CrsPickerDemo",
    importPath: "@registry/blocks/crs-picker",
  },
  {
    name: "layer-editor-group",
    demo: "layer-editor-group",
    sourceFunction: "LayerEditorGroupDemo",
    importPath: "@registry/blocks/layer-editor-group",
  },
  {
    name: "layer-panel",
    demo: "layer-panel",
    sourceFunction: "LayerPanelDemo",
    importPath: "@registry/blocks/layer-panel",
  },
  {
    name: "layer-style-editor",
    demo: "layer-style-editor",
    sourceFunction: "LayerStyleEditorDemo",
    importPath: "@registry/blocks/layer-style-editor",
  },
  {
    name: "layout",
    demo: "layout",
    sourceFunction: "LayoutDemo",
    importPath: "@registry/blocks/layout",
  },
  {
    name: "add-field-form",
    demo: "add-field-form",
    sourceFunction: "AddFieldFormDemo",
    importPath: "@registry/blocks/add-field-form",
  },
  {
    name: "attr-inspector",
    demo: "attr-inspector",
    sourceFunction: "AttrInspectorDemo",
    importPath: "@registry/blocks/attr-inspector",
  },
  {
    name: "attr-table",
    demo: "attr-table",
    sourceFunction: "AttrTableDemo",
    importPath: "@registry/blocks/attr-table",
  },
  {
    name: "filter-panel",
    demo: "filter-panel",
    sourceFunction: "FilterPanelDemo",
    importPath: "@registry/blocks/filter-panel",
  },
  {
    name: "form-inputs",
    demo: "form-inputs",
    sourceFunction: "FormInputsDemo",
    importPath: "@registry/blocks/form-inputs",
  },
  {
    name: "geojson-view",
    demo: "geojson-view",
    sourceFunction: "GeoJSONViewDemo",
    importPath: "@registry/blocks/geojson-view",
  },
  {
    name: "json-editor",
    demo: "json-editor",
    sourceFunction: "JsonEditorDemo",
    importPath: "@registry/blocks/json-editor",
  },
  {
    name: "map-controls",
    demo: "map-controls",
    sourceFunction: "MapControlsDemo",
    importPath: "@registry/blocks/map-controls",
  },
  {
    name: "map-search",
    demo: "map-search",
    sourceFunction: "MapSearchDemo",
    importPath: "@registry/blocks/map-search",
  },
  {
    name: "map-coordinate-status",
    demo: "map-coordinate-status",
    sourceFunction: "MapCoordinateStatusDemo",
    importPath: "@registry/blocks/map-coordinate-status",
  },
  {
    name: "map-switcher",
    demo: "map-switcher",
    sourceFunction: "MapSwitcherDemo",
    importPath: "@registry/blocks/map-switcher",
  },
  {
    name: "number-range-input",
    demo: "number-range-input",
    sourceFunction: "NumberRangeInputDemo",
    importPath: "@registry/blocks/number-range-input",
  },
  {
    name: "schema-form",
    demo: "schema-form",
    sourceFunction: "SchemaFormDemo",
    importPath: "@registry/blocks/schema-form",
  },
  {
    name: "pixel-probe",
    demo: "pixel-probe",
    sourceFunction: "PixelProbeDemo",
    importPath: "@registry/blocks/pixel-probe",
  },
  {
    name: "split-tool-picker",
    demo: "split-tool-picker",
    sourceFunction: "SplitToolPickerDemo",
    importPath: "@registry/blocks/split-tool-picker",
  },
  {
    name: "band-stat",
    demo: "band-stat",
    sourceFunction: "BandStatDemo",
    importPath: "@registry/blocks/band-stat",
  },
  {
    name: "linked-ref-list",
    demo: "linked-ref-list",
    sourceFunction: "LinkedRefListDemo",
    importPath: "@registry/blocks/linked-ref-list",
  },
  {
    name: "loading-screen",
    demo: "loading-screen",
    sourceFunction: "LoadingScreenDemo",
    importPath: "@registry/blocks/loading-screen",
  },
  {
    name: "notification-center",
    demo: "notification-center",
    sourceFunction: "NotificationCenterDemo",
    importPath: "@registry/blocks/notification-center",
  },
  {
    name: "placeholder-glyph",
    demo: "placeholder-glyph",
    sourceFunction: "PlaceholderGlyphDemo",
    importPath: "@registry/blocks/placeholder-glyph",
  },
  {
    name: "processing-timeline",
    demo: "processing-timeline",
    sourceFunction: "ProcessingTimelineDemo",
    importPath: "@registry/blocks/processing-timeline",
  },
  {
    name: "product-logo",
    demo: "product-logo",
    sourceFunction: "ProductLogoDemo",
    importPath: "@registry/blocks/product-logo",
  },
  {
    name: "resource-detail-drawer",
    demo: "resource-detail-drawer",
    sourceFunction: "ResourceDetailDrawerDemo",
    importPath: "@registry/blocks/resource-detail-drawer",
  },
  {
    name: "resource-grid",
    demo: "resource-grid",
    sourceFunction: "ResourceGridDemo",
    importPath: "@registry/blocks/resource-grid",
  },
  {
    name: "resource-sidebar",
    demo: "resource-sidebar",
    sourceFunction: "ResourceSidebarDemo",
    importPath: "@registry/blocks/resource-sidebar",
  },
  {
    name: "resource-status",
    demo: "resource-status",
    sourceFunction: "ResourceStatusDemo",
    importPath: "@registry/blocks/resource-status",
  },
  {
    name: "service-endpoint-row",
    demo: "service-endpoint-row",
    sourceFunction: "ServiceEndpointRowDemo",
    importPath: "@registry/blocks/service-endpoint-row",
  },
  {
    name: "service-status",
    demo: "service-status",
    sourceFunction: "ServiceStatusDemo",
    importPath: "@registry/blocks/service-status",
  },
  {
    name: "stat-strip",
    demo: "stat-strip",
    sourceFunction: "StatStripDemo",
    importPath: "@registry/blocks/stat-strip",
  },
  {
    name: "storage-meter",
    demo: "storage-meter",
    sourceFunction: "StorageMeterDemo",
    importPath: "@registry/blocks/storage-meter",
  },
  {
    name: "raster-style-panel",
    demo: "raster-style-panel",
    sourceFunction: "RasterStylePanelDemo",
    importPath: "@registry/blocks/raster-style-panel",
  },
  {
    name: "style-color-input",
    demo: "style-color-input",
    sourceFunction: "StyleColorInputDemo",
    importPath: "@registry/blocks/style-color-input",
  },
  {
    name: "style-editor-modal",
    demo: "style-editor-modal",
    sourceFunction: "StyleEditorModalDemo",
    importPath: "@registry/blocks/style-editor-modal",
  },
  {
    name: "style-editor-panel",
    demo: "style-editor-panel",
    sourceFunction: "StyleEditorPanelDemo",
    importPath: "@registry/blocks/style-editor-panel",
  },
  {
    name: "style-filter-editor",
    demo: "style-filter-editor",
    sourceFunction: "StyleFilterEditorDemo",
    importPath: "@registry/blocks/style-filter-editor",
  },
  {
    name: "style-function-editor",
    demo: "style-function-editor",
    sourceFunction: "StyleFunctionEditorDemo",
    importPath: "@registry/blocks/style-function-editor",
  },
  {
    name: "style-panel",
    demo: "style-panel",
    sourceFunction: "StylePanelDemo",
    importPath: "@registry/blocks/style-panel",
  },
  {
    name: "style-source-picker-dialog",
    demo: "style-source-picker-dialog",
    sourceFunction: "StyleSourcePickerDialogDemo",
    importPath: "@registry/blocks/style-source-picker-dialog",
  },
  {
    name: "toggle-config-popover",
    demo: "toggle-config-popover",
    sourceFunction: "ToggleConfigPopoverDemo",
    importPath: "@registry/blocks/toggle-config-popover",
  },
] as const satisfies readonly BlockPage[]

function titleFromName(name: string): string {
  return name
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("")
}

async function assertDemoPreviewAndSource(page: Page, primitive: string): Promise<void> {
  const demo = page.locator(`[data-demo="${primitive}-overview"]`)
  await expect(demo).toBeVisible()
  await assertNoHorizontalOverflow(demo, `${primitive} preview`)

  const section = demo.locator("xpath=ancestor::section").first()
  await section.locator('[data-demo-action="source"]').click()
  const source = section.locator("css=figure pre code")
  await expect(source).toContainText(`export function ${titleFromName(primitive)}OverviewDemo`)
  await expect(source).toContainText(`@registry/ui/${primitive}`)
}

async function assertBlockDemoPreviewAndSource(page: Page, block: BlockPage): Promise<void> {
  const demo = page.locator(`[data-demo="${block.demo}"]`)
  await expect(demo).toBeVisible()
  await assertNoHorizontalOverflow(demo, `${block.name} preview`)

  const section = demo.locator("xpath=ancestor::section").first()
  await section.locator('[data-demo-action="source"]').click()
  const source = section.locator("css=figure pre code")
  await expect(source).toContainText(`export function ${block.sourceFunction}`)
  await expect(source).toContainText(block.importPath)
  await section.locator('[data-demo-action="source"]').click()
}

async function assertPortalFits(locator: Locator, label: string): Promise<void> {
  await expect(locator).toBeVisible()
  // A portal anchors to its trigger; when prior steps scrolled the trigger out
  // of view the portal is out of view too. Re-center before measuring.
  await locator.evaluate((element) => element.scrollIntoView({ block: "center" }))
  await assertWithinViewport(locator, label)

  const isInsideDemo = await locator.evaluate(
    (element) => element.parentElement?.closest("[data-demo]") !== null,
  )
  if (isInsideDemo) throw new Error(`${label} was clipped inside the demo surface.`)
}

async function openMenuWithKeyboard(page: Page, trigger: Locator, content: Locator): Promise<void> {
  await trigger.focus()
  await expect(trigger).toBeFocused()
  await page.keyboard.press("Enter")
  await assertPortalFits(content, "keyboard-opened menu portal")
}

async function openContextMenu(page: Page): Promise<void> {
  const trigger = page.locator('[data-demo="context-menu-trigger"]')
  await trigger.scrollIntoViewIfNeeded()
  await trigger.focus()
  await expect(trigger).toBeFocused()
  const box = await trigger.boundingBox()
  if (!box) throw new Error("Context menu trigger bounding box is unavailable.")
  await trigger.evaluate(
    (element, point) =>
      element.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          button: 2,
          buttons: 2,
          cancelable: true,
          clientX: point.x,
          clientY: point.y,
        }),
      ),
    {
      x: Math.round(box.x + box.width / 2),
      y: Math.round(box.y + box.height / 2),
    },
  )
  await assertPortalFits(
    page.locator('[data-slot="context-menu-content"]').last(),
    "context menu portal",
  )
}

async function assertToastRendered(page: Page, text: string): Promise<void> {
  const toast = page.locator("[data-sonner-toast]").filter({ hasText: text }).first()
  await expect(toast).toBeVisible()
  await assertWithinViewport(toast, `toast ${text}`)
}

export async function assertPrimitiveInteraction(
  page: Page,
  primitive: string,
  path: string,
): Promise<void> {
  if (primitive === "avatar") {
    await expect(page.locator('[data-demo="avatar-size-default"]')).toHaveCSS("overflow", "visible")
    await expect(page.locator('[data-demo="avatar-size-lg"]')).toHaveCSS("overflow", "visible")
  }

  if (primitive === "accordion") {
    const single = page.locator('[data-demo="accordion-single"]')
    await single
      .getByRole("button", {
        name: localized(path, "支持哪些格式？", "Supported formats?"),
        exact: true,
      })
      .click()
    await expect(single).toContainText(localized(path, "GeoJSON、TopoJSON", "GeoJSON, TopoJSON"))
  }

  if (primitive === "calendar") {
    const single = page.locator('[data-demo="calendar-single"]')
    await single.locator('td[role="gridcell"]:not([class*="outside"]) button').nth(14).click()
    await expect(single).toContainText(localized(path, "15日", "15, "))
  }

  if (primitive === "checkbox") {
    const controlled = page.locator('[data-demo="checkbox-controlled"]')
    const checkbox = controlled.getByRole("checkbox", {
      name: localized(path, "包含在导出中", "Include in export"),
      exact: true,
    })
    await checkbox.focus()
    await page.keyboard.press("Space")
    await expect(
      controlled.getByRole("checkbox", {
        name: localized(path, "已包含在导出中", "Included in export"),
      }),
    ).toBeChecked()
  }

  if (primitive === "color-input") {
    const controlled = page.locator('[data-demo="color-input-controlled"]')
    const colorInput = controlled.getByLabel(localized(path, "图层颜色", "Layer color"))
    const picker = page.locator('[data-slot="popover-content"]:visible')

    await expect(controlled.locator('input[type="color"]')).toHaveCount(0)
    await colorInput.click()
    await expect(picker).toHaveCount(1)
    await colorInput.click()
    await expect(picker).toHaveCount(0)

    await colorInput.click()
    await expect(picker).toHaveCount(1)
    await controlled.getByRole("heading", { level: 4 }).click()
    await expect(picker).toHaveCount(0)

    await colorInput.fill("#dc2626")
    await expect(controlled.locator('[data-demo="color-input-value"]')).toContainText("#dc2626")

    await page.evaluate(() => {
      const EyeDropperMock = Function(
        'return function EyeDropper() { this.open = function () { return Promise.reject(new DOMException("The user canceled the selection.", "AbortError")) } }',
      )()
      Object.defineProperty(globalThis, "EyeDropper", {
        configurable: true,
        value: EyeDropperMock,
      })
    })
    await controlled
      .getByRole("button", {
        name: localized(path, "打开颜色选择器", "Open color picker"),
      })
      .click()
    const eyeDropperErrors: string[] = []
    const collectEyeDropperErrors = (message: { type(): string; text(): string }) => {
      if (message.type() === "error" && message.text().includes("EyeDropper failed")) {
        eyeDropperErrors.push(message.text())
      }
    }
    page.on("console", collectEyeDropperErrors)
    await page
      .getByRole("button", { name: "Pick color" })
      .evaluate((button) => (button as HTMLButtonElement).click())
    await page.waitForTimeout(0)
    page.off("console", collectEyeDropperErrors)
    expect(eyeDropperErrors).toEqual([])
  }

  if (primitive === "icon-button") {
    const xs = page.locator('[data-demo="icon-button-size-xs"]')
    const sm = page.locator('[data-demo="icon-button-size-sm"]')
    const md = page.locator('[data-demo="icon-button-size-md"]')
    const lg = page.locator('[data-demo="icon-button-size-lg"]')

    await expect(xs).toHaveCSS("width", "24px")
    await expect(xs).toHaveCSS("height", "24px")
    await expect(sm).toHaveCSS("width", "28px")
    await expect(sm).toHaveCSS("height", "28px")
    await expect(md).toHaveCSS("width", "32px")
    await expect(md).toHaveCSS("height", "32px")
    await expect(lg).toHaveCSS("width", "36px")
    await expect(lg).toHaveCSS("height", "36px")

    await expect(xs).toHaveCSS("border-radius", "0px")
    await expect(sm).toHaveCSS("border-radius", "0px")
    await expect(md).toHaveCSS("border-radius", "0px")
    await expect(lg).toHaveCSS("border-radius", "0px")
    await expect(xs).toHaveAttribute(
      "aria-label",
      localized(path, "编辑图层（24px）", "Edit layer (24px)"),
    )

    await sm.focus()
    await page.keyboard.press("Tab")
    await expect(md).toBeFocused()
    await expect(md).toHaveCSS("box-shadow", /3px/)

    await xs.hover()
    await expect(page.locator('[data-slot="tooltip-content"]')).toHaveText(
      localized(path, "编辑图层（24px）", "Edit layer (24px)"),
    )
  }

  if (primitive === "combobox") {
    const combobox = page.locator('[data-demo="combobox-format"]')
    await combobox.getByLabel(localized(path, "选择格式", "Select format")).fill("geo")
    await expect(page.getByText("GeoJSON", { exact: true })).toBeVisible()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(combobox.locator('[data-demo="combobox-format-value"]')).toContainText("geojson")
  }

  if (primitive === "command") {
    const command = page.locator('[data-demo="command-palette"]')
    await command
      .getByPlaceholder(localized(path, "输入命令...", "Type a command..."))
      .fill(localized(path, "线", "line"))
    await expect(
      command.getByText(localized(path, "添加线图层", "Add Line Layer"), { exact: true }),
    ).toBeVisible()
    await expect(
      command.getByText(localized(path, "添加点图层", "Add Point Layer"), { exact: true }),
    ).toBeHidden()
  }

  if (primitive === "confirm-dialog") {
    const saveTrigger = page.locator('[data-demo="confirm-dialog-save-trigger"]')
    await saveTrigger.click()
    await assertDialogPortalIsVisible(page)
    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="dialog-content"]')).toBeHidden()
    await expect(saveTrigger).toBeFocused()
    await expect(page.locator('[data-demo="confirm-dialog-status"]')).toHaveText(
      "Changes discarded",
    )

    const deleteTrigger = page.locator('[data-demo="confirm-dialog-delete-trigger"]')
    await deleteTrigger.click()
    await assertDialogPortalIsVisible(page)
    await page.getByRole("button", { name: "Delete", exact: true }).click()
    await expect(deleteTrigger).toBeFocused()
    await expect(page.locator('[data-demo="confirm-dialog-status"]')).toHaveText("Delete confirmed")
  }

  if (primitive === "context-menu") {
    await openContextMenu(page)
    await page.locator('[data-demo="context-menu-duplicate"]').focus()
    await page.keyboard.press("Enter")
    await expect(page.locator('[data-demo="context-menu-status"]')).toContainText(
      "Duplicated layer",
    )

    await openContextMenu(page)
    await page.locator('[data-demo="context-menu-snapping"]').focus()
    await page.keyboard.press("Space")
    await expect(page.locator('[data-demo="context-menu-status"]')).toContainText("snapping off")
    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="context-menu-content"]')).toBeHidden()

    await openContextMenu(page)
    await page.locator('[data-demo="context-menu-unit-trigger"]').focus()
    await page.keyboard.press("ArrowRight")
    await assertPortalFits(
      page.locator('[data-slot="context-menu-sub-content"]').last(),
      "context menu submenu portal",
    )
    await page.locator('[data-demo="context-menu-unit-kilometers"]').focus()
    await page.keyboard.press("Enter")
    await expect(page.locator('[data-demo="context-menu-status"]')).toContainText("unit kilometers")
  }

  if (primitive === "dropdown-menu") {
    const trigger = page.locator('[data-demo="dropdown-menu-trigger"]')
    const content = page.locator('[data-slot="dropdown-menu-content"]').last()
    await openMenuWithKeyboard(page, trigger, content)
    await page.locator('[data-demo="dropdown-menu-rename"]').focus()
    await page.keyboard.press("Enter")
    await expect(page.locator('[data-demo="dropdown-menu-status"]')).toContainText("Renamed layer")
    await expect(trigger).toBeFocused()

    await openMenuWithKeyboard(page, trigger, content)
    await page.locator('[data-demo="dropdown-menu-grid"]').focus()
    await page.keyboard.press("Space")
    await expect(page.locator('[data-demo="dropdown-menu-status"]')).toContainText("grid hidden")
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()

    await openMenuWithKeyboard(page, trigger, content)
    await page.locator('[data-demo="dropdown-menu-format-trigger"]').focus()
    await page.keyboard.press("ArrowRight")
    await assertPortalFits(
      page.locator('[data-slot="dropdown-menu-sub-content"]').last(),
      "dropdown submenu portal",
    )
    await page.locator('[data-demo="dropdown-menu-format-topojson"]').focus()
    await page.keyboard.press("Enter")
    await expect(page.locator('[data-demo="dropdown-menu-status"]')).toContainText(
      "export topojson",
    )
  }

  if (primitive === "collapsible") {
    const trigger = page.locator('[data-demo="collapsible-trigger"]')
    await trigger.click()
    await expect(page.locator('[data-demo="collapsible-content"]')).toBeVisible()
    await expect(page.locator('[data-demo="collapsible-state"]')).toHaveText("open")
    await trigger.click()
    await expect(page.locator('[data-demo="collapsible-state"]')).toHaveText("closed")
  }

  if (primitive === "json-viewer") {
    const viewer = page.locator('[data-demo="json-viewer-overview"]')
    const expandAllButton = page.getByRole("button", {
      name: localized(path, "全部展开", "Expand all"),
      exact: true,
    })
    const collapseAllButton = page.getByRole("button", {
      name: localized(path, "全部收起", "Collapse all"),
      exact: true,
    })
    const nodeTrigger = viewer.locator('[data-slot="collapsible-trigger"]').first()
    await expandAllButton.click()
    await expect(nodeTrigger).toHaveAttribute("aria-expanded", "true")
    await expect(nodeTrigger).toHaveAttribute("aria-controls", /.+/)
    await nodeTrigger.click()
    await expect(nodeTrigger).toHaveAttribute("aria-expanded", "true")
    await nodeTrigger.dblclick()
    await expect(nodeTrigger).toHaveAttribute("aria-expanded", "false")
    await nodeTrigger.press("Enter")
    await expect(nodeTrigger).toHaveAttribute("aria-expanded", "true")
    await collapseAllButton.click()
    await expect(viewer).toContainText("Feature")
    await expandAllButton.click()
    await expect(viewer).toContainText("coordinates")
    await viewer
      .getByRole("button", {
        name: localized(path, "复制 GeoJSON", "Copy GeoJSON"),
        exact: true,
      })
      .click()
    await expect(
      viewer.getByRole("button", {
        name: localized(path, "已复制 GeoJSON", "Copied GeoJSON"),
        exact: true,
      }),
    ).toBeVisible()
  }

  if (primitive === "pagination") {
    await expect(page.locator('[data-demo="pagination-current"]')).toHaveText("3")
    await expect(page.locator('[data-demo="pagination-current"]')).toHaveAttribute(
      "aria-current",
      "page",
    )
    await page.locator('[data-demo="pagination-next"]').click()
    await expect(page.locator('[data-demo="pagination-status"]')).toHaveText("Page 4 of 12")
    await expect(page.locator('[data-demo="pagination-current"]')).toHaveText("4")
    await expect(page.locator('[data-demo="pagination-current"]')).toHaveAttribute(
      "aria-current",
      "page",
    )
    await page.locator('[data-demo="pagination-previous"]').click()
    await expect(page.locator('[data-demo="pagination-status"]')).toHaveText("Page 3 of 12")
  }

  if (primitive === "popover") {
    const trigger = page.locator('[data-demo="popover-controlled-trigger"]')
    await trigger.click()
    await assertPortalFits(page.locator('[data-slot="popover-content"]').last(), "popover portal")
    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="popover-content"]')).toBeHidden()
    await expect(trigger).toBeFocused()
  }

  if (primitive === "input") {
    const input = page
      .locator('[data-demo="input-controlled"]')
      .getByLabel(localized(path, "数据集文件", "Dataset file"))
    await input.fill("buildings-2026.geojson")
    await expect(page.locator('[data-demo="input-value"]')).toHaveText(
      localized(path, "当前值：buildings-2026.geojson", "Value: buildings-2026.geojson"),
    )
    await expect(page.locator('[data-demo="input-readonly"] input')).toHaveAttribute("readonly", "")
  }

  if (primitive === "select") {
    const select = page.locator('[data-demo="select-controlled"]')
    const trigger = select.locator('[data-slot="select-trigger"]')
    await trigger.focus()
    await page.keyboard.press("Space")
    await expect(page.getByText("EPSG:4326 - WGS 84", { exact: true })).toBeVisible()
    await page.getByText("EPSG:3857 - Web Mercator", { exact: true }).click()
    await expect(select.locator('[data-demo="select-value"]')).toHaveText(
      localized(path, "当前值：3857", "Value: 3857"),
    )
  }

  if (primitive === "radio-group") {
    const controlled = page.locator('[data-demo="radio-group-controlled"]')
    await controlled.getByText(localized(path, "卫星", "Satellite"), { exact: true }).click()
    await expect(controlled.locator('[data-demo="radio-group-value"]')).toContainText(
      localized(path, "卫星", "Satellite"),
    )
  }

  if (primitive === "sheet") {
    const rightTrigger = page.locator('[data-demo="sheet-right-trigger"]')
    await rightTrigger.click()
    await assertPortalFits(page.locator('[data-slot="sheet-content"]').last(), "sheet portal")
    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="sheet-content"]')).toBeHidden()
    await expect(rightTrigger).toBeFocused()

    const bottomTrigger = page.locator('[data-demo="sheet-bottom-trigger"]')
    await bottomTrigger.click()
    await assertPortalFits(
      page.locator('[data-slot="sheet-content"]').last(),
      "bottom sheet portal",
    )
    await page.locator('[data-demo="sheet-bottom-close"]').click()
    await expect(bottomTrigger).toBeFocused()
  }

  if (primitive === "sonner") {
    await page.locator('[data-demo="sonner-success"]').click()
    await assertToastRendered(page, "Dataset uploaded successfully.")
    await page.locator('[data-demo="sonner-action"]').click()
    await assertToastRendered(page, "Upload failed")
    await page.getByRole("button", { name: "Retry", exact: true }).click()
    await assertToastRendered(page, "Retry queued.")
  }

  if (primitive === "slider") {
    const slider = page.locator('[data-demo="slider-controlled"]')
    const thumb = slider.getByRole("slider")
    await thumb.focus()
    await expect(thumb).toBeFocused()
    await thumb.press("ArrowRight")
    await expect(slider.locator('[data-demo="slider-value"]')).toHaveText(
      localized(path, "不透明度：51%", "Opacity: 51%"),
    )
  }

  if (primitive === "switch") {
    const controlledSwitch = page.getByRole("switch", {
      name: localized(path, "启用瓦片缓存", "Enable tile cache"),
    })
    await controlledSwitch.focus()
    await page.keyboard.press("Space")
    await expect(page.locator('[data-demo="switch-value"]')).toHaveText("checked = true")
  }

  if (primitive === "tabs") {
    const controlled = page.locator('[data-demo="tabs-controlled"]')
    await expect(controlled.locator('[data-demo="tabs-controlled-value"]')).toHaveText(
      "Selected: schema",
    )
    await controlled.locator('[data-demo="tabs-trigger-schema"]').focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("Enter")
    await expect(controlled.locator('[data-demo="tabs-controlled-value"]')).toHaveText(
      "Selected: export",
    )
    await page.keyboard.press("ArrowLeft")
    await page.keyboard.press("Enter")
    await expect(controlled.locator('[data-demo="tabs-controlled-value"]')).toHaveText(
      "Selected: schema",
    )
  }

  if (primitive === "textarea") {
    const textarea = page
      .locator('[data-demo="textarea-controlled"]')
      .getByLabel(localized(path, "图层描述", "Layer description"))
    await textarea.fill("Updated notes")
    await expect(page.locator('[data-demo="textarea-count"]')).toHaveText(
      localized(path, "字符数：13", "Characters: 13"),
    )
    await expect(page.locator('[data-demo="textarea-readonly"] textarea')).toHaveAttribute(
      "readonly",
      "",
    )
  }

  if (primitive === "toggle") {
    const toggle = page.locator('[data-demo="toggle-controlled"]').getByRole("button", {
      name: localized(path, "吸附", "Snap"),
      exact: true,
    })
    await toggle.focus()
    await page.keyboard.press("Enter")
    await expect(page.locator('[data-demo="toggle-value"]')).toHaveText("pressed = true")
  }

  if (primitive === "toggle-group") {
    const single = page.locator('[data-demo="toggle-group-single"]')
    await single
      .getByRole("button", { name: localized(path, "居中", "Center"), exact: true })
      .focus()
    await page.keyboard.press("Enter")
    await expect(single.locator('[data-demo="toggle-group-alignment"]')).toHaveText(
      localized(path, "对齐：center", "Alignment: center"),
    )
    const multiple = page.locator('[data-demo="toggle-group-multiple"]')
    await multiple
      .getByRole("button", { name: localized(path, "斜体", "Italic"), exact: true })
      .focus()
    await page.keyboard.press("Enter")
    await expect(multiple.locator('[data-demo="toggle-group-styles"]')).toContainText("italic")
  }

  if (primitive === "tooltip") {
    const trigger = page.locator('[data-demo="tooltip-map"]')
    await page.keyboard.press("Tab")
    await trigger.focus()
    const tooltip = page.locator('[data-slot="tooltip-content"]').last()
    await assertPortalFits(tooltip, "focused tooltip portal")
    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="tooltip-content"]')).toBeHidden()

    await trigger.hover()
    await assertPortalFits(tooltip, "hovered tooltip portal")
    await page.mouse.move(0, 0)
    await expect(page.locator('[data-slot="tooltip-content"]')).toBeHidden()

    await page.locator('[data-demo="tooltip-disabled-trigger"]').hover()
    await expect(page.locator('[data-slot="tooltip-content"]')).toBeHidden()
  }
}

function localized(path: string, zh: string, en: string): string {
  return path.startsWith("/en/") ? en : zh
}

const registryWidgetSentinels = [
  { zh: "Registry 依赖", en: "Registry dependencies" },
  { zh: "包依赖", en: "Package dependencies" },
] as const

async function assertInstallWidget(page: Page, path: string): Promise<void> {
  const article = page.getByRole("article")
  const isEnglish = path.startsWith("/en/")
  const copyName = isEnglish ? "Copy install command" : "复制安装命令"
  const otherCopyName = isEnglish ? "复制安装命令" : "Copy install command"

  await expect(article.getByRole("button", { name: copyName, exact: true })).toBeVisible()
  await expect(article.getByRole("button", { name: otherCopyName, exact: true })).toHaveCount(0)

  const install = article.locator("[data-install-widget]").first()
  const command = install.locator("code").first()
  await expect(command).toContainText(`npx ${SHADCN_PACKAGE} add @mapseek/`)
  await install.getByRole("button", { name: "pnpm", exact: true }).click()
  await expect(command).toContainText(`pnpm dlx ${SHADCN_PACKAGE} add @mapseek/`)
  await install.getByRole("button", { name: "bun", exact: true }).click()
  await expect(command).toContainText(`bunx ${SHADCN_PACKAGE} add @mapseek/`)
  await install.getByRole("button", { name: "npm", exact: true }).click()
  await expect(command).toContainText(`npx ${SHADCN_PACKAGE} add @mapseek/`)
}

const sharedWidgetSentinels = [
  ...registryWidgetSentinels,
  { zh: "运行查询", en: "Run query" },
  { zh: "禁用", en: "Disabled" },
] as const

async function assertLocalizedSentinelLabels(
  page: Page,
  path: string,
  sentinels: readonly { readonly zh: string; readonly en: string }[],
): Promise<void> {
  const article = page.getByRole("article")
  const isEnglish = path.startsWith("/en/")

  for (const sentinel of sentinels) {
    await expect(
      article.getByText(isEnglish ? sentinel.en : sentinel.zh, { exact: true }),
    ).toBeVisible()
    await expect(
      article.getByText(isEnglish ? sentinel.zh : sentinel.en, { exact: true }),
    ).toHaveCount(0)
  }
}

function localizedCrsListLabel(path: string): string {
  return localized(path, "坐标参考系列表", "Coordinate reference systems")
}

export async function assertBlockInteraction(
  page: Page,
  block: string,
  path: string,
): Promise<void> {
  if (block === "app-top-bar") {
    const demo = page.locator('[data-demo="app-top-bar"]')
    await demo.getByRole("button", { name: localized(path, "保存", "Save"), exact: true }).click()
    await expect(demo.locator('[data-demo-status="app-top-bar"]')).toContainText(
      localized(path, "状态已保存", "Status saved"),
    )
    await demo.locator('[data-demo-action="app-top-bar-save-as"]').click()
    await expect(demo.locator('[data-demo-status="app-top-bar"]')).toContainText(
      localized(path, "状态已标脏", "Status marked dirty"),
    )
    await demo.locator('[data-demo-action="app-top-bar-snapshot"]').click()
    await expect(demo.locator('[data-demo-status="app-top-bar"]')).toContainText(
      localized(path, "快照", "Snapshot"),
    )
    await activateByKeyboard(
      demo.getByRole("button", { name: localized(path, "返回", "Back"), exact: true }),
    )
    await expect(demo.locator('[data-demo-status="app-top-bar"]')).toContainText(
      localized(path, "返回", "Back"),
    )
  }

  if (block === "custom-colormap") {
    const demo = page.locator('[data-demo="custom-colormap"]')
    await expect(demo).toContainText(
      localized(path, "3 个色停 · 线性 · OKLCH", "3 stops · Linear · OKLCH"),
    )
    await expect(demo.locator('[data-slot="custom-colormap-preview"]')).toHaveCSS(
      "border-top-width",
      "1px",
    )

    await demo
      .getByRole("button", { name: localized(path, "编辑配色", "Edit colormap"), exact: true })
      .click()
    const dialog = page.getByRole("dialog", {
      name: localized(path, "自定义配色方案", "Custom colormap"),
      exact: true,
    })
    await expect(dialog).toBeVisible()
    await expect(
      dialog.getByRole("button", { name: localized(path, "关闭", "Close"), exact: true }),
    ).toBeVisible()
    await expect(dialog.locator('[data-slot="custom-colormap-editor-preview"]')).toHaveCSS(
      "border-top-width",
      "1px",
    )

    const removeButtons = dialog.getByRole("button", {
      name: localized(path, "删除色停", "Remove stop"),
      exact: true,
    })
    await expect(removeButtons).toHaveCount(3)
    for (const removeButton of await removeButtons.all()) {
      await expect(removeButton).toHaveCSS("opacity", "0")
      await expect(removeButton).toHaveCSS("width", "14px")
      await expect(removeButton).toHaveCSS("height", "14px")
    }
    const firstRemoveButton = removeButtons.first()
    const restingBackground = await firstRemoveButton.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    )
    await firstRemoveButton.locator("xpath=..").hover()
    await expect(firstRemoveButton).toHaveCSS("opacity", "1")
    await firstRemoveButton.hover()
    expect(
      await firstRemoveButton.evaluate((element) => getComputedStyle(element).backgroundColor),
    ).toBe(restingBackground)

    const presetGrid = dialog.locator('[data-slot="custom-colormap-presets"]')
    const columnCount = await presetGrid.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length,
    )
    expect(columnCount).toBe((page.viewportSize()?.width ?? 0) < 640 ? 2 : 4)
    const firstPreset = dialog.getByRole("button", {
      name: localized(path, "蓝-米-橙", "Blue–Cream–Orange"),
      exact: true,
    })
    await expect(firstPreset).toBeVisible()
    await expect(firstPreset.locator("span").last()).toHaveCSS("font-size", "13px")
    await assertNoHorizontalOverflow(presetGrid, `${path} custom colormap preset grid`)

    const sectionIcons = dialog.locator('[data-slot="custom-colormap-section-heading"] svg')
    await expect(sectionIcons).toHaveCount(4)
    for (const icon of await sectionIcons.all()) {
      await expect(icon).toHaveAttribute("aria-hidden", "true")
    }

    await page.emulateMedia({ reducedMotion: "reduce" })
    await expect(dialog).toHaveCSS("animation-name", "none")
    await expect(page.locator('[data-slot="dialog-overlay"]')).toHaveCSS("animation-name", "none")
    await page.emulateMedia({ reducedMotion: "no-preference" })

    await dialog
      .getByRole("button", { name: localized(path, "取消", "Cancel"), exact: true })
      .click()
  }

  if (block === "crs-picker") {
    const demo = page.locator('[data-demo="crs-picker"]')
    const controlled = demo
      .locator("section")
      .filter({ hasText: localized(path, "受控模式", "Controlled mode") })
      .last()
    const listbox = controlled.getByRole("listbox", {
      name: localizedCrsListLabel(path),
      exact: true,
    })
    await expect(listbox).toBeVisible()
    await assertNoHorizontalOverflow(listbox, `${path} controlled CrsPicker list`)

    const projectedOption = listbox.getByRole("option", { name: "EPSG:3857", exact: true })
    await projectedOption.focus()
    await expect(projectedOption).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(demo.locator('[data-demo-status="crs-picker"]')).toContainText("EPSG:3857")

    await listbox.getByRole("option", { name: "EPSG:4326", exact: true }).click()
    await expect(demo.locator('[data-demo-status="crs-picker"]')).toContainText("EPSG:4326")
    await assertNoHorizontalOverflow(demo, `${path} crs picker`)
  }

  if (block === "layer-editor-group") {
    const demo = page.locator('[data-demo="layer-editor-group"]')
    const panel = demo.locator('[data-demo-panel="layer-editor-group"]')
    await assertNoHorizontalOverflow(panel, `${path} layer editor group`)
    await panel.scrollIntoViewIfNeeded()
    await demo
      .getByRole("button", { name: localized(path, "绘制属性", "Paint"), exact: true })
      .click()
    await expect(demo.locator('input[value="rgb(242,243,240)"]')).toBeHidden()
    await activateByKeyboard(
      demo.getByRole("button", { name: localized(path, "绘制属性", "Paint"), exact: true }),
    )
    await expect(demo.locator('input[value="rgb(242,243,240)"]')).toBeVisible()
  }

  if (block === "layer-style-editor") {
    const demo = page.locator('[data-demo="layer-style-editor"]')
    await assertNoHorizontalOverflow(
      demo.locator('[data-slot="layer-style-editor"]'),
      `${path} layer style editor`,
    )
    await demo.getByRole("tab", { name: localized(path, "数据", "Data"), exact: true }).click()
    await expect(demo.locator('input[value="[\\"==\\", \\"class\\", \\"park\\"]"]')).toBeVisible()
    await demo.getByRole("tab", { name: "JSON", exact: true }).click()
    await expect(demo).toContainText("background-color")
    const actionTrigger = demo.getByRole("button", {
      name: localized(path, "图层选项", "Layer options"),
      exact: true,
    })
    await openMenuWithKeyboard(
      page,
      actionTrigger,
      page.locator('[data-slot="dropdown-menu-content"]').last(),
    )
    await page
      .getByRole("menuitem", { name: localized(path, "复制图层", "Duplicate layer"), exact: true })
      .click()
    await expect(demo.locator('[data-demo-status="layer-style-editor"]')).toContainText(
      localized(path, "复制图层", "Duplicate layer"),
    )
    await activateByKeyboard(
      demo.getByRole("button", {
        name: localized(path, "关闭图层编辑器", "Close layer editor"),
        exact: true,
      }),
    )
    await expect(demo.locator('[data-demo-status="layer-style-editor"]')).toContainText(
      localized(path, "已关闭", "Closed"),
    )
  }

  if (block === "layout") {
    const demo = page.locator('[data-demo="layout"]')
    await assertNoHorizontalOverflow(demo, `${path} layout demo`)
    await assertNoHorizontalOverflow(
      demo.locator('[data-demo-panel="layout-scroll"]'),
      `${path} layout scroll`,
    )
    await demo.locator('[data-demo-action="layout-field-action"]').click()
    await expect(demo.locator('[data-demo-status="layout"]')).toContainText(
      localized(path, "函数按钮已触发", "Function action triggered"),
    )
    await activateByKeyboard(demo.locator('[data-demo-action="layout-collapse"]'))
    await expect(demo.locator('[data-demo-status="layout"]')).toContainText(
      localized(path, "展开", "Expand"),
    )
  }

  if (block === "add-field-form") {
    const demo = page.locator('[data-demo="add-field-form"]')
    await expect(demo.locator('[data-demo-status="validation"]')).toContainText(
      localized(path, "字段名必填", "Field name is required"),
    )
    await demo
      .getByPlaceholder(localized(path, "例如 build_year", "e.g. build_year"))
      .fill("build_year")
    await expect(demo.locator('[data-demo-status="validation"]')).toContainText(
      localized(path, "可提交", "Ready to submit"),
    )
    await demo.getByRole("button", { name: "Enum", exact: true }).click()
    await expect(
      demo.getByPlaceholder(
        localized(path, "例如 居住,商业,工业,绿地", "e.g. residential,commercial,industrial,park"),
      ),
    ).toBeVisible()
    await activateByKeyboard(demo.getByRole("button", { name: localized(path, "重置", "Reset") }))
    await expect(demo.locator('[data-demo-status="validation"]')).toContainText(
      localized(path, "字段名必填", "Field name is required"),
    )
  }

  if (block === "attr-inspector") {
    const demo = page.locator('[data-demo="attr-inspector"]')
    await demo.locator('[data-demo-action="mode-read"]').click()
    await expect(demo.locator('[data-demo-action="mode-read"]')).toHaveClass(/bg-primary/)
    await demo.locator('[data-demo-action="mode-edit"]').click()
    await demo
      .getByRole("button", { name: localized(path, "GeoJSON", "GeoJSON"), exact: true })
      .click()
    await expect(demo.locator('[data-demo-status="attr-inspector"]')).toContainText(
      localized(path, "打开 GeoJSON", "Open GeoJSON"),
    )
    await demo.getByRole("button", { name: localized(path, "取消", "Cancel"), exact: true }).click()
    await expect(demo.locator('[data-demo-status="attr-inspector"]')).toContainText(
      localized(path, "已取消", "Cancelled"),
    )
  }

  if (block === "attr-table") {
    const demo = page.locator('[data-demo="attr-table"]')
    await demo.locator('[data-demo-action="section-data"]').click()
    await demo
      .getByRole("checkbox", { name: localized(path, "模拟空数据", "Simulate empty") })
      .check()
    await expect(demo).toContainText(localized(path, "无数据", "No rows"))
    await demo
      .getByRole("checkbox", { name: localized(path, "模拟空数据", "Simulate empty") })
      .uncheck()
    await demo
      .getByRole("checkbox", { name: localized(path, "模拟错误", "Simulate error") })
      .check()
    await expect(demo.getByRole("button", { name: localized(path, "重试", "Retry") })).toBeVisible()
    await demo.getByRole("button", { name: localized(path, "重试", "Retry") }).click()
    await demo.locator('[data-demo-action="section-schema"]').click()
    const copyButton = demo.locator('[data-slot="copy-button"]').first()
    await copyButton.click()
    await expect(copyButton.locator(".tabler-icon-check")).toBeVisible()
    await demo.getByPlaceholder(localized(path, "搜索字段", "Search fields")).fill("name")
    await expect(demo).toContainText("name")
    await demo.locator('[data-demo-action="section-sheet"]').click()
    await demo.locator('[data-demo-action="open-sheet"]').click()
    const sheet = page.locator('[data-demo="attr-table-sheet"]')
    await expect(sheet).toBeVisible()
    await assertWithinViewport(sheet, `${path} attr table sheet`)
    await assertNoHorizontalOverflow(sheet, `${path} attr table sheet`)
    const resize = sheet.getByRole("button", { name: "Resize attribute table", exact: true })
    await resize.focus()
    await page.keyboard.press("ArrowUp")
    await assertWithinViewport(sheet, `${path} attr table sheet after keyboard resize`)
    await sheet.getByRole("button", { name: localized(path, "关闭", "Close") }).click()
    await expect(sheet).toBeHidden()
  }

  if (block === "filter-panel") {
    const demo = page.locator('[data-demo="filter-panel"]')
    await expect(demo.locator('[data-demo-status="filter-mode"]')).toContainText("builder")
    const field = demo.getByRole("combobox").first()
    const initialFieldWidth = await field.evaluate(
      (element) => element.getBoundingClientRect().width,
    )
    await field.click()
    await page.getByRole("option", { name: "area_m2", exact: true }).click()
    const selectedFieldWidth = await field.evaluate(
      (element) => element.getBoundingClientRect().width,
    )
    expect(selectedFieldWidth).toBeGreaterThan(initialFieldWidth)
    const selectedFieldValue = field.locator('[data-slot="select-value"]')
    const selectedFieldValueWidth = await selectedFieldValue.evaluate((element) => {
      return { clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }
    })
    expect(selectedFieldValueWidth.scrollWidth).toBeLessThanOrEqual(
      selectedFieldValueWidth.clientWidth,
    )

    for (const action of [
      demo.getByRole("button", { name: /^(添加条件|Add condition)$/ }),
      demo.getByRole("button", { name: /^(清空|Clear)$/ }),
      demo.getByRole("button", { name: /^(应用|Apply)$/ }),
    ]) {
      const actionStyle = await action.evaluate((element) => {
        const style = getComputedStyle(element)

        return {
          fontSize: style.fontSize,
          height: Math.round(element.getBoundingClientRect().height),
        }
      })
      expect(actionStyle).toEqual({ fontSize: "13px", height: 24 })
    }

    const removeCondition = demo.getByRole("button", {
      name: /^(删除条件|Remove condition)$/,
    })
    const removeConditionSize = await removeCondition.evaluate((element) => {
      const rect = element.getBoundingClientRect()

      return { height: Math.round(rect.height), width: Math.round(rect.width) }
    })
    expect(removeConditionSize).toEqual({ height: 24, width: 24 })

    const estimate = demo.locator('[data-slot="filter-panel-footer"] > span')
    await expect(estimate).toHaveCSS("font-size", "11px")

    const operator = demo.getByRole("combobox").nth(1)
    const conditionRow = operator.locator("..")
    const valueInput = conditionRow.locator('[data-slot="input"]')
    const initialWidths = await Promise.all([
      conditionRow.evaluate((element) => element.getBoundingClientRect().width),
      operator.evaluate((element) => element.getBoundingClientRect().width),
      valueInput.evaluate((element) => element.getBoundingClientRect().width),
    ])
    await operator.click()
    await page.getByRole("option", { name: "contains", exact: true }).click()
    const selectedWidths = await Promise.all([
      conditionRow.evaluate((element) => element.getBoundingClientRect().width),
      operator.evaluate((element) => element.getBoundingClientRect().width),
      valueInput.evaluate((element) => element.getBoundingClientRect().width),
    ])
    expect(Math.abs(selectedWidths[0] - initialWidths[0])).toBeLessThanOrEqual(1)
    expect(selectedWidths[1]).toBeGreaterThan(initialWidths[1])
    expect(selectedWidths[2]).toBeLessThan(initialWidths[2])
    await demo.getByRole("tab", { name: "SQL", exact: true }).click()
    await expect(demo.locator('[data-demo-status="filter-mode"]')).toContainText("sql")
    await demo.locator("textarea").fill('code = "R2"')
    await expect(demo.locator("pre")).toContainText("R2")
    await demo.locator('[data-demo-action="external-clear"]').click()
    await expect(demo.locator("pre")).toContainText('"rows": []')
  }

  if (block === "form-inputs") {
    const demo = page.locator('[data-demo="form-inputs"]')
    const stringInput = demo.getByLabel(localized(path, "字符串", "String"), { exact: true })
    await stringInput.fill("Buildings")
    await stringInput.blur()
    await expect(demo.locator("pre")).toContainText("Buildings")
    const numberInput = demo.getByLabel(localized(path, "数字", "Number"), { exact: true })
    await numberInput.fill("24")
    await numberInput.blur()
    await expect(demo.locator("pre")).toContainText('"num": 24')
    await expect(
      demo.getByRole("checkbox", { name: localized(path, "复选框", "Checkbox") }),
    ).toBeVisible()
    await expect(
      demo.getByRole("radiogroup", { name: localized(path, "短枚举", "Short enum") }),
    ).toBeVisible()
    await activateByKeyboard(demo.locator('[data-demo-action="reset-inputs"]'))
    await expect(demo.locator("pre")).toContainText('"checked": false')
  }

  if (block === "geojson-view") {
    const demo = page.locator('[data-demo="geojson-view"]')
    const emptyToggle = demo.getByRole("checkbox", {
      name: localized(path, "模拟无选中", "Simulate no selection"),
    })
    const invalidToggle = demo.getByRole("checkbox", {
      name: localized(path, "模拟解析失败", "Simulate parse failure"),
    })
    await expect(demo).toContainText("Feature")
    await emptyToggle.click()
    await expect(demo).toContainText(localized(path, "无选中要素", "No selected feature"))
    await emptyToggle.click()
    await invalidToggle.click()
    await expect(demo.getByRole("alert")).toContainText(
      localized(path, "GeoJSON 解析失败", "GeoJSON could not be parsed"),
    )
    await expect(demo).toContainText("{ invalid geojson")
    await demo
      .getByRole("checkbox", {
        name: localized(path, "模拟 primitive 值", "Simulate primitive value"),
      })
      .click()
    await expect(demo.getByRole("status")).toContainText(
      localized(path, "GeoJSON 必须是对象或数组", "GeoJSON must be an object or array"),
    )
  }

  if (block === "json-editor") {
    const demo = page.locator('[data-demo="json-editor"]')
    await demo.locator('[data-demo-action="theme-dark"]').click()
    await expect(demo).toContainText(`${localized(path, "当前主题", "Current theme")} · dark`)
    await demo.locator('[data-demo-action="theme-none"]').click()
    await expect(demo).toContainText(`${localized(path, "当前主题", "Current theme")} · none`)
    await demo.locator(".cm-content").first().click()
    await expect(demo.locator('[data-demo-status="json-editor"]')).toContainText(
      localized(path, "已聚焦", "Focused"),
    )
  }

  if (block === "map-controls") {
    const demo = page.locator('[data-demo="map-controls"]')
    await demo
      .getByRole("button", { name: localized(path, "放大", "Zoom in"), exact: true })
      .click()
    await expect(demo.locator('[data-demo-status="map-controls"]')).toContainText(
      localized(path, "已放大", "Zoomed in"),
    )
    await activateByKeyboard(
      demo.getByRole("button", { name: localized(path, "定位", "Locate"), exact: true }),
    )
    await expect(demo.locator('[data-demo-status="map-controls"]')).toContainText(
      localized(path, "已定位", "Located"),
    )
    await demo.getByRole("button", { name: localized(path, "归位", "Home"), exact: true }).click()
    await expect(demo.locator('[data-demo-status="map-controls"]')).toContainText(
      localized(path, "已归位", "Returned home"),
    )
  }

  if (block === "map-search") {
    const demo = page.locator('[data-demo="map-search"]')
    const placeInput = demo.getByRole("textbox", {
      name: localized(path, "地名", "Place"),
      exact: true,
    })
    await placeInput.fill(localized(path, "北京", "Beijing"))
    await page.waitForTimeout(320)
    await placeInput.fill(localized(path, "上海", "Shanghai"))
    await demo.getByRole("option", { name: /上海 Shanghai/ }).click()
    await expect(demo.getByRole("option", { name: /北京 Beijing/ })).toHaveCount(0)
    await expect(demo.locator('[data-demo-status="map-search"]')).toContainText(
      localized(path, "飞行至：上海 Shanghai", "Fly to: 上海 Shanghai"),
    )
    await demo
      .getByRole("button", { name: localized(path, "清除", "Clear place"), exact: true })
      .click()
    await expect(placeInput).toHaveValue("")

    await demo
      .getByRole("tab", { name: localized(path, "经纬度搜索", "Coordinates"), exact: true })
      .click()
    const longitude = demo.getByRole("textbox", {
      name: localized(path, "经度", "Longitude"),
      exact: true,
    })
    const latitude = demo.getByRole("textbox", {
      name: localized(path, "纬度", "Latitude"),
      exact: true,
    })
    await longitude.fill("181")
    await expect(demo.getByRole("alert")).toContainText(
      localized(path, "经度必须在 -180 至 180 之间", "Longitude must be between -180 and 180"),
    )
    await longitude.fill("116.4074")
    await latitude.fill("39.9042")
    await demo
      .getByRole("button", { name: localized(path, "定位", "Locate coordinates"), exact: true })
      .click()
    await expect(demo.locator('[data-demo-status="map-search"]')).toContainText("116.4074, 39.9042")
    await demo
      .getByRole("button", { name: localized(path, "清除", "Clear coordinates"), exact: true })
      .click()
    await expect(longitude).toHaveValue("")
    await expect(latitude).toHaveValue("")

    await demo
      .getByRole("button", { name: localized(path, "收起", "Collapse search"), exact: true })
      .click()
    const expand = demo.getByRole("button", {
      name: localized(path, "展开", "Expand search"),
      exact: true,
    })
    await expect(expand).toBeFocused()
    await expand.click()
    await expect(demo.getByRole("tablist")).toBeVisible()
  }

  if (block === "map-coordinate-status") {
    const demo = page.locator('[data-demo="map-coordinate-status"]')
    const coordinateStatus = demo.locator('[data-slot="map-coordinate-status"]')
    const mapPlaceholder = coordinateStatus.locator("..")
    if ((page.viewportSize()?.width ?? 0) >= 768) {
      await expect
        .poll(() => mapPlaceholder.evaluate((element) => element.getBoundingClientRect().width))
        .toBeGreaterThanOrEqual(560)
    }
    if ((page.viewportSize()?.width ?? 0) >= 640) {
      await expect
        .poll(() =>
          coordinateStatus.evaluate((element) => {
            const statusRect = element.getBoundingClientRect()
            return Array.from(element.children).every((child) => {
              const childRect = child.getBoundingClientRect()
              return childRect.top >= statusRect.top && childRect.bottom <= statusRect.bottom
            })
          }),
        )
        .toBe(true)
    }
    await assertNoHorizontalOverflow(coordinateStatus, `${path} MapCoordinateStatus readout`)
    await expect(demo).toContainText("EPSG:3857")
    await expect(demo).toContainText("13,522,425.02 m")
    await demo.locator('[data-demo-action="map-coordinate-status-update-view"]').click()
    await expect(demo.locator('[data-demo-status="map-coordinate-status"]')).toContainText(
      localized(path, "已更新 view", "View updated"),
    )
    const statusTrigger = demo.getByRole("button", {
      name: localized(path, "切换坐标参考系", "Switch coordinate reference system"),
      exact: true,
    })
    const popover = page.locator('[data-slot="popover-content"]').last()
    await statusTrigger.scrollIntoViewIfNeeded()
    const scrollBeforeMouseOpen = await page.evaluate(() => window.scrollY)
    await statusTrigger.click()
    await expect(popover).toBeVisible()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollBeforeMouseOpen)
    await statusTrigger.click()
    await expect(popover).toBeHidden()

    await statusTrigger.click()
    await expect(popover).toBeVisible()
    const hoveredGeographicOption = popover.getByRole("option", { name: /^EPSG:4326\b/ })
    await hoveredGeographicOption.hover()
    await expect(hoveredGeographicOption).toHaveAttribute("aria-selected", "true")
    await statusTrigger.hover()
    await expect(hoveredGeographicOption).not.toHaveAttribute("aria-selected", "true")
    await statusTrigger.click()
    await expect(popover).toBeHidden()

    await openMenuWithKeyboard(page, statusTrigger, popover)
    const picker = popover.locator('[data-slot="crs-picker"]')
    await expect(picker).toBeVisible()
    await assertNoHorizontalOverflow(picker, `${path} MapCoordinateStatus CRS picker`)
    const geographicOption = picker.getByRole("option", { name: /^EPSG:4326\b/ })
    await expect(geographicOption).toHaveAttribute("aria-selected", "true")
    await page.keyboard.press("Enter")
    await expect(demo.locator('[data-demo-status="map-coordinate-status"]')).toContainText(
      "EPSG:4326",
    )
    await expect(demo).toContainText("121.4737° E")

    await statusTrigger.click()
    await assertPortalFits(popover, `${path} MapCoordinateStatus CRS popover`)
    await popover.getByRole("option", { name: /^EPSG:3857\b/ }).click()
    await expect(demo.locator('[data-demo-status="map-coordinate-status"]')).toContainText(
      "EPSG:3857",
    )
    await expect(demo).toContainText("13,522,425.02 m")

    await demo.locator('[data-demo-action="map-coordinate-status-copy"]').click()
    await expect(demo.locator('[data-demo-status="map-coordinate-status"]')).toContainText(
      localized(path, "已复制读数", "Readout copied"),
    )
  }

  if (block === "map-switcher") {
    const demo = page.locator('[data-demo="map-switcher"]')
    const imageMode = demo.locator('[data-demo-section="map-switcher-image"]')
    const imageTrigger = imageMode.locator('[data-slot="map-switcher"] > button')
    const triggerBox = await imageTrigger.boundingBox()
    expect(triggerBox?.height).toBeGreaterThanOrEqual(68)
    await expect(imageTrigger).toHaveCSS("box-shadow", "none")
    const triggerBorderColor = await imageTrigger.evaluate(
      (element) => getComputedStyle(element).borderTopColor,
    )
    expect(triggerBorderColor).not.toBe("rgba(0, 0, 0, 0)")
    await expect(imageTrigger.locator("img")).toHaveCSS("object-fit", "contain")
    await expect(imageTrigger.locator("div").first()).toHaveCSS("border-bottom-width", "0px")
    await imageTrigger.click()
    const imageOptions = imageMode.locator('[role="option"]')
    await expect(imageOptions).toHaveCount(4)
    const optionBoxes = await imageOptions.evaluateAll((options) =>
      options.map((option) => {
        const box = option.getBoundingClientRect()
        return { top: box.top, bottom: box.bottom, height: box.height }
      }),
    )
    expect(optionBoxes[0]?.height).toBeGreaterThanOrEqual(64)
    expect(optionBoxes[0]?.bottom).toBeLessThanOrEqual(optionBoxes[2]?.top ?? 0)

    const buttonMode = demo.locator('[data-demo-section="map-switcher-button"]')
    const buttonTrigger = buttonMode.locator('[data-slot="map-switcher"] > button')
    const buttonTriggerBox = await buttonTrigger.boundingBox()
    expect(buttonTriggerBox?.height).toBeLessThanOrEqual(32)
    await buttonTrigger.click()
    const buttonOptionOffsets = await buttonMode.locator('[role="option"]').evaluateAll((options) =>
      options.map((option) => {
        const optionBox = option.getBoundingClientRect()
        const firstContentBox = option.firstElementChild?.getBoundingClientRect()
        return firstContentBox ? firstContentBox.left - optionBox.left : Number.POSITIVE_INFINITY
      }),
    )
    expect(buttonOptionOffsets.every((offset) => offset <= 10)).toBe(true)

    const controlled = demo.locator('[data-demo-section="map-switcher-controlled"]')
    await controlled.locator('[data-demo-action="map-switcher-toggle-open"]').click()
    const panel = controlled.locator('[data-slot="map-switcher-panel"]')
    await expect(panel).toBeVisible()
    await assertWithinViewport(panel, `${path} map switcher panel`)
    await assertNoHorizontalOverflow(panel, `${path} map switcher panel`)
    await panel
      .locator("button")
      .filter({ hasText: localized(path, "地形", "Terrain") })
      .click()
    await expect(demo.locator('[data-demo-status="map-switcher"]')).toContainText("terrain")
    await controlled.locator('[data-demo-action="map-switcher-next"]').click()
    await expect(demo.locator('[data-demo-status="map-switcher"]')).toContainText("dark")
  }

  if (block === "pixel-probe") {
    const demo = page.locator('[data-demo="pixel-probe"]')
    const probe = demo.locator('[data-testid="pixel-probe"]')
    const stage = probe.locator("..")
    await expect(probe).toBeVisible()
    await expect
      .poll(() => probe.evaluate((element) => getComputedStyle(element).boxShadow))
      .toBe("none")
    if ((page.viewportSize()?.width ?? 0) >= 768) {
      await expect
        .poll(() => stage.evaluate((element) => element.getBoundingClientRect().width))
        .toBeGreaterThanOrEqual(600)
    }
    await expect
      .poll(async () => {
        const [stageBox, statusBox] = await Promise.all([
          stage.boundingBox(),
          demo.locator('[data-demo-status="pixel-probe"]').boundingBox(),
        ])
        if (!stageBox || !statusBox) return Number.POSITIVE_INFINITY
        return Math.abs(stageBox.x + stageBox.width - (statusBox.x + statusBox.width))
      })
      .toBeLessThanOrEqual(2)
    const copyButton = probe.locator('[data-slot="copy-button"]')
    await expect(copyButton).toHaveCount(1)
    await copyButton.click()
    await expect(copyButton).toHaveAttribute("aria-label", localized(path, "已复制", "Copied"))
    await expect(copyButton.locator("svg")).toHaveClass(/tabler-icon-check/)
    await expect(demo.locator('[data-demo-status="pixel-probe"]')).toContainText(
      localized(path, "已复制 JSON", "Copied JSON"),
    )
    await demo.locator('[data-slot="icon-button"]').last().click()
    await expect(demo.locator('[data-demo-status="pixel-probe"]')).toContainText(
      localized(path, "像元 2", "Pixel 2"),
    )
    await demo.getByTitle(localized(path, "关闭", "Close")).click()
    await demo
      .getByRole("button", { name: localized(path, "重新打开", "Reopen"), exact: true })
      .click()
    await expect(demo.locator('[data-testid="pixel-probe"]')).toBeVisible()
    await demo.locator('[data-demo-action="pixel-probe-clear-selection"]').click()
    await expect(demo.locator('[data-demo-empty="pixel-probe"]')).toContainText(
      localized(path, "暂无选中像元", "No selected pixel"),
    )
  }

  if (block === "split-tool-picker") {
    const demo = page.locator('[data-demo="split-tool-picker"]')
    const selectPicker = demo.locator('[data-demo-action="split-tool-picker-select"]')
    await activateByKeyboard(
      selectPicker.getByRole("button", {
        name: localized(path, "点选", "Point select"),
        exact: true,
      }),
    )
    await expect(demo.locator('[data-demo-status="split-tool-picker"]')).toContainText(
      localized(path, "主按钮", "Primary button"),
    )
    const selectMenuTrigger = selectPicker.getByRole("button").nth(1)
    const selectMenu = page.locator('[data-slot="popover-content"]').last()
    await openMenuWithKeyboard(page, selectMenuTrigger, selectMenu)
    const menuItemsFitContent = await selectMenu
      .locator('[role="option"]')
      .evaluateAll((options) =>
        options.every((option) => option.scrollHeight <= option.clientHeight),
      )
    expect(menuItemsFitContent).toBe(true)
    await page.getByRole("option", { name: localized(path, "框选", "Box select") }).focus()
    await page.keyboard.press("Enter")
    await expect(demo.locator('[data-demo-status="split-tool-picker"]')).toContainText(
      localized(path, "下拉菜单", "Menu"),
    )
    await expect(demo).toContainText(localized(path, "框选", "Box select"))
    await expect(
      demo.locator('[data-demo-action="split-tool-picker-disabled"]').getByRole("button").first(),
    ).toBeDisabled()
  }

  if (block === "number-range-input") {
    const demo = page.locator('[data-demo="number-range-input"]')
    const percent = demo.getByLabel("percent").last()
    await percent.fill("60")
    await percent.blur()
    await expect(demo.locator("pre")).toContainText('"percent": 60')
    const zoomSlider = demo.getByRole("slider").nth(1)
    await zoomSlider.focus()
    await page.keyboard.press("ArrowRight")
    await expect(demo.locator("pre")).toContainText('"zoom": 12.5')
    await activateByKeyboard(demo.locator('[data-demo-action="clear-ranges"]'))
    await expect(demo.locator("pre")).toContainText("{}")
  }

  if (block === "schema-form") {
    const demo = page.locator('[data-demo="schema-form"]')
    await expect(demo.locator('[data-demo-status="schema-validity"]')).toContainText(
      localized(path, "invalid", "invalid"),
    )
    await demo.getByLabel(localized(path, "缓冲半径", "Buffer radius")).fill("25")
    await demo.getByRole("checkbox", { name: localized(path, "roads", "roads") }).check()
    await demo.getByRole("checkbox", { name: localized(path, "rivers", "rivers") }).check()
    await expect(demo.locator('[data-demo-status="schema-validity"]')).toContainText(
      localized(path, "valid", "valid"),
    )
    await demo.getByLabel(localized(path, "切换为空图层选项", "Toggle empty layer options")).check()
    await expect(demo).toContainText(localized(path, "暂无图层", "No layers"))
  }

  if (block === "layer-panel") {
    const demo = page.locator('[data-demo="layer-panel"]')
    const panel = demo.locator('[data-slot="layer-panel"]').first()
    await panel.getByLabel(localized(path, "搜索图层", "Search layers")).fill("no-match")
    const emptyTitle = panel.getByText(localized(path, "没有匹配的图层", "No matching layers"), {
      exact: true,
    })
    await expect(emptyTitle).toBeVisible()
    await assertNoHorizontalOverflow(panel, `${path} LayerPanel empty state`)
  }

  if (block === "band-stat") {
    const demo = page.locator('[data-demo="band-stat"]')
    await expect(demo.locator('[data-demo-status="band-stat"]')).toContainText("B1")
    await expect(demo).toContainText(localized(path, "海岸气溶胶", "Coastal aerosol"))
    await demo.locator('[data-demo-action="band-stat-next"]').click()
    await expect(demo.locator('[data-demo-status="band-stat"]')).toContainText("B4")
    await expect(demo).toContainText(localized(path, "近红外", "Near infrared"))
    await assertNoHorizontalOverflow(demo, `${path} band stat`)
  }

  if (block === "linked-ref-list") {
    const demo = page.locator('[data-demo="linked-ref-list"]')
    await expect(demo).toContainText(
      localized(path, "派生或关联的数据集", "Derived or associated datasets"),
    )
    await demo
      .getByRole("button", { name: new RegExp(localized(path, "工作流", "Workflows")) })
      .click()
    await expect(demo).toContainText(localized(path, "栅格预处理", "Raster preprocessing"))
    await expect(demo).toContainText("workflow.5f01-72cd")
    await demo
      .getByRole("button", { name: new RegExp(localized(path, "地图集", "Mapsets")) })
      .click()
    await expect(demo).toContainText(localized(path, "城市绿地监测", "Urban green-space monitor"))
    await expect(demo).toContainText("mapset.18bd-44f0")
    await assertNoHorizontalOverflow(demo, `${path} linked refs`)
  }

  if (block === "loading-screen") {
    const demo = page.locator('[data-demo="loading-screen"]')
    await expect(demo.getByRole("status")).toHaveCount(3)
    for (const variant of ["spinner", "refresh", "pulse"] as const) {
      const loadingState = demo.locator(`[data-loading-variant="${variant}"]`)
      await expect(loadingState).toBeVisible()
      await expect(loadingState.locator('[data-slot="loading-screen-indicator"]')).toBeVisible()
    }
    await expect(demo).toContainText(
      localized(path, "正在初始化图层与样式", "Initializing layers and styles"),
    )
    await demo.locator('[data-demo-action="loading-screen-toggle"]').click()
    await expect(demo.locator('[data-demo-status="loading-screen"]')).toContainText(
      localized(path, "加载中...", "Loading..."),
    )
  }

  if (block === "notification-center") {
    const demo = page.locator('[data-demo="notification-center"]')
    const trigger = demo.getByRole("button", {
      name: localized(path, "通知中心", "Notification center"),
      exact: true,
    })
    await openMenuWithKeyboard(
      page,
      trigger,
      page.locator('[data-slot="dropdown-menu-content"]').last(),
    )
    const menu = page.locator('[data-slot="dropdown-menu-content"]').last()
    await expect(menu).toContainText("TOTAL")
    const notificationRows = menu.locator("li")
    await expect(notificationRows.first()).toContainText(
      localized(path, "PMTiles · 边界瓦片", "PMTiles · boundary tiles"),
    )
    const clearAllButton = menu.getByRole("button", {
      name: localized(path, "全部清除", "Clear all"),
      exact: true,
    })
    await expect(clearAllButton).toHaveClass(/text-destructive/)
    const firstNotification = notificationRows.first()
    await firstNotification.hover()
    await expect(firstNotification).toHaveClass(/hover:bg-destructive/)
    await expect(
      firstNotification.getByRole("button", {
        name: localized(path, "清除", "Clear"),
        exact: true,
      }),
    ).toHaveClass(/text-destructive/)
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()

    await demo.locator('[data-demo-action="notification-center-loading"]').click()
    await trigger.click()
    await expect(
      page
        .locator('[data-slot="dropdown-menu-content"]')
        .last()
        .getByRole("status", {
          name: localized(path, "正在加载通知", "Loading notifications"),
          exact: true,
        }),
    ).toBeVisible()
    await trigger.click()
    await expect(menu).toBeHidden()

    await activateByKeyboard(demo.locator('[data-demo-action="notification-center-error"]'))
    await trigger.click()
    await page.getByRole("button", { name: localized(path, "重试", "Retry"), exact: true }).click()
    await expect(demo.locator('[data-demo-status="notification-center"]')).toContainText(
      localized(path, "已重试", "Retried"),
    )
    await page.keyboard.press("Escape")

    await activateByKeyboard(demo.locator('[data-demo-action="notification-center-empty"]'))
    await trigger.click()
    await expect(page.locator('[data-slot="dropdown-menu-content"]').last()).toContainText(
      localized(path, "暂无新通知", "No new notifications"),
    )
    await page.keyboard.press("Escape")
    await activateByKeyboard(demo.locator('[data-demo-action="notification-center-reset"]'))
  }

  if (block === "placeholder-glyph") {
    const demo = page.locator('[data-demo="placeholder-glyph"]')
    const glyphs = demo.locator("svg")
    const toggle = demo.locator('[data-demo-action="placeholder-glyph-toggle"]')
    const status = demo.locator('[data-demo-status="placeholder-glyph"]')
    const captions = demo.locator('[data-demo-caption="placeholder-glyph"]')

    await expect(glyphs).toHaveCount(13)
    await expect(demo.getByRole("img")).toHaveCount(0)
    await expect(demo.locator("svg title")).toHaveCount(0)
    for (const glyph of await glyphs.all()) {
      await expect(glyph).toHaveAttribute("stroke-width", "2")
    }
    await expect(demo).toContainText(localized(path, "搜索", "search"))
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
    await expect(status).toHaveAttribute("role", "status")
    await expect(status).toHaveCSS("font-size", "11px")
    await expect(captions).toHaveCount(13)
    for (const caption of await captions.all()) {
      await expect(caption).toHaveCSS("font-size", "11px")
    }
    await expect(demo.getByText("16px", { exact: true })).toHaveCSS(
      "font-variant-numeric",
      "tabular-nums",
    )
    await toggle.click()
    await expect(toggle).toHaveAttribute("aria-pressed", "true")
    await expect(status).toContainText("muted")
    await assertNoHorizontalOverflow(demo, `${path} placeholder glyph`)
  }

  if (block === "processing-timeline") {
    const demo = page.locator('[data-demo="processing-timeline"]')
    await expect(demo).toContainText(localized(path, "处理栅格数据", "Process raster data"))
    await expect(demo).toContainText(
      localized(
        path,
        "正在重投影栅格并写入 Cloud-Optimized GeoTIFF",
        "Reprojecting raster and writing Cloud-Optimized GeoTIFF",
      ),
    )
    await demo.locator('[data-demo-action="processing-timeline-advance"]').click()
    await expect(demo.locator('[data-demo-status="processing-timeline"]')).toContainText("55%")
    const logButton = demo.getByRole("button", {
      name: localized(path, "日志", "Log"),
      exact: true,
    })
    const progress = demo.getByRole("progressbar")
    await expect(progress).toHaveAttribute(
      "aria-label",
      localized(path, "处理栅格数据", "Process raster data"),
    )
    await expect(demo.locator('[data-slot="tag"]')).toHaveCount(5)
    await expect(
      demo.getByRole("button", { name: localized(path, "复制", "Copy"), exact: true }),
    ).toHaveCount(0)

    await logButton.click()
    await expect(demo.locator('[data-demo-status="processing-timeline"]')).toContainText(
      localized(path, "已选择日志", "Log selected"),
    )
  }

  if (block === "product-logo") {
    const demo = page.locator('[data-demo="product-logo"]')
    await expect(demo).toContainText("Mapseek Cloud")
    await expect(demo).toContainText(localized(path, "主项目入口", "Primary project entry"))
    await demo.locator('[data-demo-action="product-logo-toggle"]').click()
    await expect(demo.locator('[data-demo-status="product-logo"]')).toContainText(
      localized(path, "隐藏文字", "Text hidden"),
    )
  }

  if (block === "resource-detail-drawer") {
    const demo = page.locator('[data-demo="resource-detail-drawer"]')
    const sheet = page.locator('[data-slot="sheet-content"]').last()
    await demo
      .getByRole("button", {
        name: localized(path, "图标详情", "Icon detail"),
        exact: true,
      })
      .click()
    await assertPortalFits(sheet, `${path} resource detail drawer`)
    await expect(sheet).toContainText(localized(path, "搜索", "Search"))
    await expect(sheet).toContainText(localized(path, "基础操作", "Basic operations"))
    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="sheet-content"]')).toBeHidden()
    await expect(demo.locator('[data-demo-status="resource-detail-drawer"]')).toContainText(
      localized(path, "已关闭", "Closed"),
    )

    await demo
      .getByRole("button", {
        name: localized(path, "字体详情", "Font detail"),
        exact: true,
      })
      .click()
    await assertPortalFits(sheet, `${path} resource font drawer`)
    await expect(sheet).toContainText(
      localized(path, "城市规划用地分析与可视化呈现", "Urban planning land-use analysis"),
    )
    await sheet
      .getByRole("button", {
        name: localized(path, "配置切片", "Configure slice"),
        exact: true,
      })
      .click()
    await sheet
      .getByRole("button", { name: localized(path, "执行切片", "Run slice"), exact: true })
      .click()
    await expect(demo.locator('[data-demo-status="resource-detail-drawer"]')).toContainText(
      localized(path, "已执行切片", "Ran font slice"),
    )
    await sheet
      .getByRole("button", {
        name: /关闭|Close/,
        exact: true,
      })
      .click()
    await expect(page.locator('[data-slot="sheet-content"]')).toBeHidden()
  }

  if (block === "resource-grid") {
    const demo = page.locator('[data-demo="resource-grid"]')
    const iconGrid = demo.locator('[data-testid="resource-icon-grid"]')
    await expect(demo).toContainText(localized(path, "搜索", "Search"))
    const initialGridWidth = await iconGrid.evaluate(
      (element) => element.getBoundingClientRect().width,
    )
    await demo.getByRole("button", { name: new RegExp(localized(path, "搜索", "Search")) }).click()
    await expect(demo.locator('[data-demo-status="resource-grid"]')).toContainText(
      localized(path, "已打开", "Opened"),
    )
    await expect
      .poll(() => iconGrid.evaluate((element) => element.getBoundingClientRect().width))
      .toBe(initialGridWidth)
    await demo
      .getByRole("checkbox", { name: new RegExp(localized(path, "定位", "Locate")) })
      .check()
    await expect(demo.locator('[data-demo-status="resource-grid"]')).toContainText(
      localized(path, "已选择", "Selected"),
    )
    await demo.locator('[data-demo-action="resource-grid-tab-sprite"]').click()
    await expect(demo).toContainText(localized(path, "32 个图标", "32 icons"))
    await demo
      .getByRole("button", { name: new RegExp(localized(path, "基础图标 32", "basic-icons-32")) })
      .click()
    await expect(demo.locator('[data-demo-status="resource-grid"]')).toContainText(
      localized(path, "已打开", "Opened"),
    )
    await demo.locator('[data-demo-action="resource-grid-empty"]').click()
    await expect(demo).toContainText(localized(path, "暂无资源", "No resources"))
    await assertNoHorizontalOverflow(demo, `${path} resource grid`)
  }

  if (block === "resource-sidebar") {
    const demo = page.locator('[data-demo="resource-sidebar"]')
    const typeRow = demo.getByRole("button", {
      name: new RegExp(`^${localized(path, "图标", "Icons")}`),
    })
    const categoryRow = demo.getByRole("button", {
      name: localized(path, "全部图标", "All icons"),
    })
    const categoryList = demo.locator('[data-slot="resource-sidebar-category-list"]')
    const [typeRowBox, categoryRowBox] = await Promise.all([
      typeRow.boundingBox(),
      categoryRow.boundingBox(),
    ])
    expect(typeRowBox?.height).toBe(categoryRowBox?.height)
    await expect(categoryList).toHaveCSS("padding-bottom", "6px")
    await demo
      .getByRole("button", { name: new RegExp(`^${localized(path, "字体", "Fonts")}`) })
      .click()
    await expect(demo.locator('[data-demo-status="resource-sidebar"]')).toContainText("font")
    await expect(demo).toContainText(localized(path, "拉丁", "Latin"))
    await demo.getByRole("button", { name: localized(path, "拉丁", "Latin") }).click()
    await expect(demo.locator('[data-demo-status="resource-sidebar"]')).toContainText("fc_latin")
    await demo.getByRole("button", { name: localized(path, "新建分类", "New category") }).click()
    await expect(demo.locator('[data-demo-status="resource-sidebar"]')).toContainText(
      localized(path, "已新建分类", "Created category"),
    )
    await assertNoHorizontalOverflow(demo, `${path} resource sidebar`)
  }

  if (block === "resource-status") {
    const demo = page.locator('[data-demo="resource-status"]')
    await expect(demo.locator('[data-demo-status="resource-status"]')).toContainText("ready")
    await expect(demo).toContainText(localized(path, "已就绪", "Ready"))
    await demo.locator('[data-demo-action="resource-status-next"]').click()
    await expect(demo.locator('[data-demo-status="resource-status"]')).toContainText("processing")
    await expect(demo).toContainText(localized(path, "处理中", "Processing"))
  }

  if (block === "service-endpoint-row") {
    const demo = page.locator('[data-demo="service-endpoint-row"]')
    await expect(demo).toContainText(localized(path, "栅格瓦片服务", "Raster tile service"))
    await expect(demo).toContainText(
      localized(path, "云优化 GeoTIFF · HTTP Range", "Cloud Optimized GeoTIFF · HTTP Range"),
    )
    await demo
      .getByRole("button", { name: localized(path, "复制 URL", "Copy URL"), exact: true })
      .first()
      .click()
    await expect(demo.locator('[data-demo-status="service-endpoint-row"]')).toContainText(
      localized(path, "已复制 URL", "Copied URL"),
    )
    await demo
      .getByRole("button", {
        name: localized(path, "新窗口打开", "Open in new window"),
        exact: true,
      })
      .nth(1)
      .click()
    await expect(demo.locator('[data-demo-status="service-endpoint-row"]')).toContainText(
      localized(path, "已打开服务", "Opened service"),
    )
  }

  if (block === "service-status") {
    const demo = page.locator('[data-demo="service-status"]')
    await expect(demo.locator('[data-demo-status="service-status"]')).toContainText("true")
    await demo.getByRole("switch").nth(2).click()
    await expect(demo.locator('[data-demo-status="service-status"]')).toContainText("false")
  }

  if (block === "stat-strip") {
    const demo = page.locator('[data-demo="stat-strip"]')
    await expect(demo).toContainText(localized(path, "要素", "Features"))
    await expect(demo.locator('[data-demo-status="stat-strip"]')).toContainText(
      localized(path, "数据集统计", "Dataset stats"),
    )
    await demo.locator('[data-demo-action="stat-strip-toggle"]').click()
    await expect(demo).toContainText(localized(path, "分辨率", "Resolution"))
    await expect(demo.locator('[data-demo-status="stat-strip"]')).toContainText(
      localized(path, "栅格统计", "Raster stats"),
    )
    await assertNoHorizontalOverflow(demo, `${path} stat strip`)
  }

  if (block === "storage-meter") {
    const demo = page.locator('[data-demo="storage-meter"]')
    await expect(demo.locator('[data-demo-status="storage-meter"]')).toContainText(
      localized(path, "正常", "Normal"),
    )
    await demo.locator('[data-demo-action="storage-meter-full"]').click()
    await expect(demo.locator('[data-demo-status="storage-meter"]')).toContainText(
      localized(path, "接近上限", "Near limit"),
    )
    const trigger = demo.getByRole("button", { name: new RegExp(localized(path, "已用", "Used")) })
    await trigger.click()
    const popover = page.locator('[data-slot="popover-content"]').last()
    await assertPortalFits(popover, `${path} storage meter popover`)
    await expect(popover).toContainText(
      localized(
        path,
        "源私有文件系统说明通过 footer 插槽注入。",
        "Origin-private storage notes are injected through the footer slot.",
      ),
    )
    await popover.getByRole("button", { name: localized(path, "刷新", "Refresh") }).click()
    await expect(demo.locator('[data-demo-status="storage-meter"]')).toContainText(
      localized(path, "已刷新", "Refreshed"),
    )
    await page.keyboard.press("Escape")
    await demo.locator('[data-demo-action="storage-meter-unsupported"]').click()
    await expect(demo).toContainText(localized(path, "不支持", "Unsupported"))
  }

  if (block === "toolbox") {
    const demo = page.locator('[data-demo="toolbox"]')
    const toolboxLabel = localized(path, "工具箱", "Toolbox")
    const bufferLabel = localized(path, "缓冲区", "Buffer")
    const requiredLabel = localized(path, "请输入缓冲距离", "Enter a buffer distance")
    const validLabel = localized(
      path,
      "参数有效，可以运行工具",
      "Parameters are valid. The tool is ready to run.",
    )
    const completedLabel = localized(
      path,
      "已完成，结果已添加为新图层。",
      "Completed. The result was added as a new layer.",
    )
    const runLabel = localized(path, "运行 缓冲区", "Run Buffer")
    const toolbox = demo.getByRole("complementary", { name: toolboxLabel, exact: true })

    await expect(toolbox).toBeVisible()
    await expect(toolbox.getByRole("heading", { level: 2, name: toolboxLabel })).toBeVisible()
    const quickGrid = toolbox.locator("section").first().locator(":scope > div")
    const quickColumnCount = await quickGrid.evaluate(
      (element) => getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length,
    )
    expect(quickColumnCount).toBe((page.viewportSize()?.width ?? 0) < 640 ? 1 : 2)

    await toolbox.getByRole("button", { name: bufferLabel, exact: true }).first().click()
    const headerButtons = toolbox.locator("header button")
    await expect(headerButtons).toHaveCount(3)
    for (const button of await headerButtons.all()) {
      await expect(button).toHaveCSS("height", "28px")
    }

    const distance = toolbox.locator('input[name="toolbox-distance"]')
    await distance.fill("")
    await expect(distance).toHaveAttribute("aria-invalid", "true")
    await expect(toolbox.getByText(requiredLabel, { exact: true })).toBeVisible()
    await expect(toolbox.getByText(validLabel, { exact: true })).toHaveCount(0)
    await expect(toolbox.getByRole("button", { name: runLabel, exact: true })).toBeDisabled()

    await distance.fill("100")
    await expect(distance).toHaveAttribute("aria-invalid", "false")
    await expect(toolbox.getByText(requiredLabel, { exact: true })).toHaveCount(0)
    await expect(toolbox.getByText(validLabel, { exact: true })).toBeVisible()
    await toolbox.getByRole("button", { name: runLabel, exact: true }).click()
    await expect(toolbox.getByText(completedLabel, { exact: true })).toBeVisible()
    await distance.fill("250")
    await expect(toolbox.getByText(completedLabel, { exact: true })).toHaveCount(0)
    await assertNoHorizontalOverflow(demo, `${path} toolbox`)
  }

  if (block === "raster-style-panel") {
    const demo = page.locator('[data-demo="raster-style-panel"]')
    await assertNoHorizontalOverflow(demo, `${path} raster style panel`)
    await expect(demo).toContainText(localized(path, "波段数", "BANDS"))
    await expect(demo).toContainText(localized(path, "尺寸", "SIZE"))
    await expect(demo).toContainText(localized(path, "最小值", "MIN"))
    await expect(demo).toContainText(localized(path, "最大值", "MAX"))
    await demo.getByRole("button", { name: localized(path, "RGB 合成", "RGB composite") }).click()
    await expect(demo.locator('[data-demo-status="raster-style-panel"]')).toContainText(
      localized(path, "RGB 合成", "RGB composite"),
    )
    await demo.locator('[data-demo-action="raster-style-panel-save"]').click()
    await expect(demo.locator('[data-demo-status="raster-style-panel"]')).toContainText(
      localized(path, "已保存样式", "Saved style"),
    )
    await demo.locator('[data-demo-action="raster-style-panel-reset"]').click()
    await expect(demo.locator('[data-demo-status="raster-style-panel"]')).toContainText(
      localized(path, "重置", "Reset"),
    )
  }

  if (block === "style-color-input") {
    const demo = page.locator('[data-demo="style-color-input"]')
    const trigger = demo.getByRole("button", {
      name: localized(path, "打开: 按钮和输入框", "Open: Button and input"),
      exact: true,
    })
    const popover = page.locator('[data-slot="popover-content"]').last()
    await openMenuWithKeyboard(page, trigger, popover)
    await popover.getByRole("slider").first().press("ArrowRight")
    await expect(demo.locator('[data-demo-status="style-color-input"]')).not.toContainText(
      "#22c55e",
    )
    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="popover-content"]')).toBeHidden()
  }

  if (block === "style-editor-modal") {
    const demo = page.locator('[data-demo="style-editor-modal"]')
    const trigger = demo.locator('[data-demo-action="style-editor-modal-open"]')
    await openAndAssertDialog(page, trigger)
    const dialog = page.locator('[data-slot="dialog-content"]').last()
    await dialog
      .getByRole("button", { name: localized(path, "关闭提示", "Dismiss alert"), exact: true })
      .click()
    await dialog.getByRole("button", { name: "OpenMapTiles", exact: true }).click()
    await expect(demo.locator('[data-demo-status="style-editor-modal"]')).toContainText(
      localized(path, "已选择模板", "Selected template"),
    )
    await dialog.getByRole("button", { name: localized(path, "保存", "Save"), exact: true }).click()
    await expect(demo.locator('[data-demo-status="style-editor-modal"]')).toContainText(
      localized(path, "已保存样式", "Saved style"),
    )
  }

  if (block === "style-editor-panel") {
    const demo = page.locator('[data-demo="style-editor-panel"]')
    await assertNoHorizontalOverflow(demo, `${path} style editor panel`)
    await expect(demo).toContainText(localized(path, "地表覆盖", "Landcover"))
    await expect(
      demo.getByRole("textbox", { name: localized(path, "类型", "Type") }).nth(1),
    ).toHaveValue(localized(path, "栅格", "Raster"))
    await demo.locator('[data-demo-action="style-editor-panel-add"]').click()
    await expect(demo).toContainText(localized(path, "分析网格", "Analysis Grid"))
    await expect(demo.locator('[data-demo-status="style-editor-panel"]')).toContainText(
      localized(path, "已添加临时数据源", "Added temporary source"),
    )
    await demo.locator('[data-demo-action="style-editor-panel-remove-openmaptiles"]').click()
    await expect(demo.locator('[data-demo-status="style-editor-panel"]')).toContainText(
      localized(path, "已删除", "Removed"),
    )
  }

  if (block === "style-filter-editor") {
    const demo = page.locator('[data-demo="style-filter-editor"]')
    await demo.locator('[data-demo-action="style-filter-editor-add"]').click()
    await expect(demo.locator('[data-demo-status="style-filter-editor"]')).toContainText(
      localized(path, "已添加过滤器", "Added filter"),
    )
    await demo.locator('[data-demo-action="style-filter-editor-remove-0"]').click()
    await expect(demo.locator('[data-demo-status="style-filter-editor"]')).toContainText(
      localized(path, "已删除过滤器", "Removed filter"),
    )
    await expect(demo).toContainText(
      localized(path, "不支持嵌套过滤器。", "Nested filters are not supported."),
    )
  }

  if (block === "style-function-editor") {
    const demo = page.locator('[data-demo="style-function-editor"]')
    await expect(demo).toContainText(localized(path, "基数", "Base"))
    await expect(demo).toContainText(localized(path, "停靠点", "Stops"))
    await expect(demo).toContainText(localized(path, "层级", "Zoom"))
    await demo.locator('[data-demo-action="style-function-editor-add"]').click()
    await expect(demo.locator('[data-demo-status="style-function-editor"]')).toContainText(
      localized(path, "已添加停靠点", "Added stop"),
    )
    await demo.locator('[data-demo-action="style-function-editor-remove-0"]').click()
    await expect(demo.locator('[data-demo-status="style-function-editor"]')).toContainText(
      localized(path, "已删除停靠点", "Removed stop"),
    )
    await demo.locator('[data-demo-action="style-function-editor-expression"]').click()
    await expect(demo.locator('[data-demo-status="style-function-editor"]')).toContainText(
      localized(path, "已转为表达式", "Converted to expression"),
    )
  }

  if (block === "style-panel") {
    const demo = page.locator('[data-demo="style-panel"]')
    await demo
      .getByRole("button", {
        name: `${localized(path, "填充颜色", "Fill color")} #2563eb`,
        exact: true,
      })
      .click()
    await expect(demo.locator('[data-demo-status="style-panel"]')).toContainText(
      localized(path, "已更新样式", "Updated style"),
    )
    const slider = demo.getByRole("slider").first()
    await slider.focus()
    await page.keyboard.press("ArrowRight")
    await expect(demo.locator('[data-demo-status="style-panel"]')).toContainText(
      localized(path, "已更新样式", "Updated style"),
    )
    await demo.locator('[data-demo-action="style-panel-reset"]').click()
    await expect(demo.locator('[data-demo-status="style-panel"]')).toContainText(
      localized(path, "重置", "Reset"),
    )
  }

  if (block === "style-source-picker-dialog") {
    const demo = page.locator('[data-demo="style-source-picker-dialog"]')
    const trigger = demo.locator('[data-demo-action="style-source-picker-dialog-open"]')
    await openAndAssertDialog(page, trigger)
    const dialog = page.locator('[data-slot="dialog-content"]').last()
    await expect(dialog).toContainText(localized(path, "道路网络", "Road Network"))
    await expect(dialog).toContainText(localized(path, "地形 DEM", "Terrain DEM"))
    await dialog
      .getByPlaceholder(
        localized(path, "搜索名称、路径或 UID...", "Search by name, path, or UID..."),
      )
      .fill(localized(path, "道路", "road"))
    await dialog.getByRole("button", { name: localized(path, "道路网络", "Road Network") }).click()
    await expect(dialog).toContainText(localized(path, "已选择 1 个源", "Selected 1 source(s)"))
    await dialog
      .getByRole("button", { name: localized(path, "确认", "Confirm"), exact: true })
      .click()
    await expect(demo.locator('[data-demo-status="style-source-picker-dialog"]')).toContainText(
      localized(path, "已添加源", "Added sources"),
    )
    await expect(demo.locator('[data-demo-status="style-source-picker-dialog"]')).toContainText(
      localized(path, "道路网络", "Road Network"),
    )
  }

  if (block === "toggle-config-popover") {
    const demo = page.locator('[data-demo="toggle-config-popover"]')
    const switchButton = demo.getByRole("switch", {
      name: localized(path, "顶点和边吸附", "Vertex and edge snapping"),
      exact: true,
    })
    await switchButton.click()
    await expect(demo.locator('[data-demo-status="toggle-config-popover"]')).toContainText(
      localized(path, "已关闭", "Disabled"),
    )
    await switchButton.click()
    const trigger = demo.getByRole("button", {
      name: localized(path, "打开吸附设置", "Open snapping settings"),
      exact: true,
    })
    await openMenuWithKeyboard(page, trigger, page.locator('[data-slot="popover-content"]').last())
    const popover = page.locator('[data-slot="popover-content"]').last()
    const threshold = popover.getByRole("slider")
    await threshold.focus()
    await page.keyboard.press("ArrowRight")
    await popover.getByRole("checkbox").first().click()
    await assertPortalFits(popover, `${path} toggle config popover`)
  }
}

async function runPrimitiveCategoryCase(
  baseUrl: string,
  browserChannel?: string,
  only?: readonly string[],
): Promise<void> {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await launchBrowser(browserChannel)
  const viewports: Record<DocsViewportName, { width: number; height: number }> = {
    desktop: { width: 1280, height: 720 },
    mobile: { width: 390, height: 760 },
  }

  try {
    for (const viewport of Object.values(viewports)) {
      const page = await (
        await browser.newContext({
          baseURL: baseUrl,
          permissions: ["clipboard-read", "clipboard-write"],
          viewport,
        })
      ).newPage()
      try {
        for (const primitive of only
          ? primitivePages.filter((name) => only.includes(name))
          : primitivePages) {
          for (const path of [`/components/${primitive}`, `/en/components/${primitive}`] as const) {
            for (const theme of ["light", "dark"] as const) {
              await page.goto(path)
              await setDocsTheme(page, theme)
              await expect(page.getByRole("heading", { level: 1, exact: true })).toBeVisible()
              await assertLocalizedSentinelLabels(page, path, registryWidgetSentinels)
              await assertInstallWidget(page, path)
              await assertDemoPreviewAndSource(page, primitive)
              await assertPrimitiveInteraction(page, primitive, path)
            }
          }
        }
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
}

async function runBlockCategoryCase(
  baseUrl: string,
  browserChannel?: string,
  only?: readonly string[],
): Promise<void> {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await launchBrowser(browserChannel)
  const viewports: Record<DocsViewportName, { width: number; height: number }> = {
    desktop: { width: 1280, height: 720 },
    mobile: { width: 390, height: 760 },
  }

  try {
    for (const viewport of Object.values(viewports)) {
      const page = await (
        await browser.newContext({
          baseURL: baseUrl,
          permissions: ["clipboard-read", "clipboard-write"],
          viewport,
        })
      ).newPage()
      try {
        for (const block of only
          ? blockPages.filter((entry) => only.includes(entry.name))
          : blockPages) {
          for (const path of [`/blocks/${block.name}`, `/en/blocks/${block.name}`] as const) {
            for (const theme of ["light", "dark"] as const) {
              await page.goto(path)
              await setDocsTheme(page, theme)
              await expect(page.getByRole("heading", { level: 1, exact: true })).toBeVisible()
              await assertBlockDemoPreviewAndSource(page, block)
              await assertBlockInteraction(page, block.name, path)
              await assertNoHorizontalOverflow(page.getByRole("article"), `${path} article`)
            }
          }
        }
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
}

async function main() {
  const options = readCliOptions()
  const preview = options.baseUrl ? undefined : await startStaticPreview(options.port)
  const baseUrl = options.baseUrl ?? preview?.baseUrl
  if (!baseUrl) throw new Error("Docs visual QA did not receive or start a preview URL.")

  try {
    if (options.category === "primitive") {
      await runPrimitiveCategoryCase(baseUrl, options.browserChannel, options.only)
      return
    }
    if (options.category === "block") {
      await runBlockCategoryCase(baseUrl, options.browserChannel, options.only)
      return
    }

    if (options.caseName === "smoke") {
      await runSmokeCase(baseUrl, options.browserChannel)
    }
    if (options.caseName === "button") {
      await runButtonCase(baseUrl, options.browserChannel)
    }
    if (options.caseName === "dialog") {
      await runDialogCase(baseUrl, options.browserChannel)
    }
    if (options.caseName === "color-input") {
      await runColorInputCase(baseUrl, options.browserChannel)
    }
    if (options.caseName === "pilots") {
      await runPilotsCase(baseUrl, options.browserChannel)
    }
    if (options.caseName === "onboarding") {
      await runOnboardingCase(baseUrl, options.browserChannel)
    }
    if (options.caseName === "release") {
      await runReleaseCase(baseUrl, options.browserChannel)
    }
  } finally {
    preview?.stop()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
