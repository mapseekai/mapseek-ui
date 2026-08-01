import { type Browser, chromium, expect, type Locator, type Page } from "@playwright/test"

type DocsVisualCase = "smoke" | "button" | "dialog" | "pilots" | "onboarding"
type DocsVisualCategory = "primitive"
type DocsTheme = "dark" | "light"
type DocsViewportName = "desktop" | "mobile"

type CliOptions = {
  readonly baseUrl: string
  readonly browserChannel?: string
  readonly category?: DocsVisualCategory
  readonly caseName: DocsVisualCase
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

  if (!baseUrl) {
    throw new Error("Missing required --base-url option.")
  }

  if (
    caseName !== "smoke" &&
    caseName !== "button" &&
    caseName !== "dialog" &&
    caseName !== "pilots" &&
    caseName !== "onboarding"
  ) {
    throw new Error(`Unsupported docs visual QA case: ${caseName}`)
  }

  if (category !== undefined && category !== "primitive") {
    throw new Error(`Unsupported docs visual QA category: ${category}`)
  }

  return { baseUrl, browserChannel, category, caseName }
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
    const page = await browser.newPage({ baseURL: baseUrl })

    await page.goto("/components/_smoke")
    await expect(page.getByRole("heading", { level: 1, name: "Smoke", exact: true })).toBeVisible()
    await expect(page.getByText("Smoke demo rendered")).toBeVisible()

    await page.locator('[data-demo-action="source"]').click()
    await expect(page.locator("pre code")).toContainText("export function SmokeDemo")

    await page.locator('[data-demo-action="copy"]').click()
    await expect(page.locator('[data-copy-status="copied"]')).toHaveText(/\S/)

    await page.locator('[data-demo-action="reset"]').click()
    await expect(page.locator('[data-reset-revision="1"]')).toHaveText(/\S/)

    const themeToggle = page.locator('button[class*="toggleButton"]').first()
    await expect(themeToggle).toBeVisible()
    await themeToggle.click()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
    await themeToggle.click()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
  } finally {
    await browser.close()
  }
}

async function runButtonCase(baseUrl: string, browserChannel?: string) {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await launchBrowser(browserChannel)

  try {
    const page = await browser.newPage({ baseURL: baseUrl })

    await page.goto("/components/button")
    await assertButtonPilot(page)
  } finally {
    await browser.close()
  }
}

async function assertButtonPilot(page: Page): Promise<void> {
  await expect(page.getByRole("heading", { level: 1, name: "Button", exact: true })).toBeVisible()

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
  await expect(page.locator('[data-demo="button-press-count"]')).toHaveText("Presses: 1")

  const basicDemo = basicPreview.locator("xpath=ancestor::section")
  await basicDemo.locator('[data-demo-action="source"]').click()
  await expect(basicDemo.locator("pre code")).toContainText("export function ButtonBasicDemo")
  await expect(basicDemo.locator("pre code")).toContainText(
    'import { Button } from "@registry/ui/button"',
  )

  await basicDemo.locator('[data-demo-action="reset"]').click()
  await expect(basicDemo.locator('[data-reset-revision="1"]')).toBeVisible()
  await expect(page.locator('[data-demo="button-press-count"]')).toHaveText("Presses: 0")
}

async function setDocsTheme(page: Page, theme: DocsTheme): Promise<void> {
  const currentTheme = await page.locator("html").getAttribute("data-theme")
  if (currentTheme !== theme) {
    const themeToggle = page.locator('button[class*="toggleButton"]').first()
    if (await themeToggle.isVisible()) {
      await themeToggle.click()
    } else {
      await page.evaluate((nextTheme) => {
        document.documentElement.setAttribute("data-theme", nextTheme)
        localStorage.setItem("theme", nextTheme)
      }, theme)
    }
  }
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
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
    const page = await browser.newPage({ baseURL: baseUrl, viewport: { width: 1280, height: 720 } })

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
  const overflow = await locator.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }))
  if (overflow.scrollWidth > overflow.clientWidth + 1) {
    throw new Error(`${label} has horizontal overflow: ${JSON.stringify(overflow)}`)
  }
}

async function assertWithinViewport(locator: Locator, label: string): Promise<void> {
  const page = locator.page()
  await expect
    .poll(
      async () => {
        const viewport = page.viewportSize()
        const box = await locator.boundingBox()
        if (!viewport || !box) return { fits: false, viewport, box }
        return {
          fits:
            box.x >= -1 &&
            box.y >= -1 &&
            box.x + box.width <= viewport.width + 1 &&
            box.y + box.height <= viewport.height + 1,
          viewport,
          box,
        }
      },
      { message: `${label} stays within the viewport` },
    )
    .toMatchObject({ fits: true })
}

async function activateByKeyboard(locator: Locator): Promise<void> {
  await locator.focus()
  await locator.page().keyboard.press("Enter")
}

async function assertLayerPanelDemoFits(root: Locator, label: string): Promise<void> {
  await assertNoHorizontalOverflow(root, `${label} demo`)
  await assertWithinViewport(root.locator('[data-slot="layer-panel"]'), `${label} panel`)
}

async function assertLayerPanelPilot(page: Page, path: string): Promise<void> {
  await expect(
    page.getByRole("heading", { level: 1, name: "LayerPanel", exact: true }),
  ).toBeVisible()

  const basic = page.locator('[data-demo="layer-panel-basic"]')
  const groups = page.locator('[data-demo="layer-panel-groups"]')
  await expect(basic).toBeVisible()
  await expect(groups).toBeVisible()
  await basic.scrollIntoViewIfNeeded()
  await assertLayerPanelDemoFits(basic, `${path} basic LayerPanel`)

  await activateByKeyboard(
    basic.locator('button[aria-label="Toggle visibility for Transit corridors"]'),
  )
  await expect(basic.locator('[data-demo="layer-panel-basic-status"]')).toContainText(
    path.startsWith("/en/") ? "Hidden" : "已隐藏",
  )

  await basic.getByRole("button", { name: "Field assets", exact: true }).click()
  await expect(basic.locator('[data-demo="layer-panel-basic-status"]')).toContainText(
    "Field assets",
  )

  const styleButton = basic.getByRole("button", {
    name: path.startsWith("/en/") ? "Style" : "样式",
    exact: true,
  })
  await styleButton.click()
  await styleButton.click()

  await groups.scrollIntoViewIfNeeded()
  await assertLayerPanelDemoFits(groups, `${path} grouped LayerPanel`)

  const operationsCollapse = groups.locator('[data-demo="layer-panel-group-collapse-operations"]')
  await operationsCollapse.click()
  await expect(groups.getByRole("button", { name: "Water mains", exact: true })).toBeHidden()
  await assertLayerPanelDemoFits(groups, `${path} grouped LayerPanel after collapse`)
  await operationsCollapse.click()
  await expect(groups.getByRole("button", { name: "Water mains", exact: true })).toBeVisible()
  await assertLayerPanelDemoFits(groups, `${path} grouped LayerPanel after expand`)

  await groups.locator('[data-demo="layer-panel-group-rename-operations"]').click()
  const renameInput = groups.locator('[data-demo="layer-panel-group-rename-input-operations"]')
  await renameInput.fill(path.startsWith("/en/") ? "Response" : "响应")
  await groups.locator('[data-demo="layer-panel-group-rename-save-operations"]').click()
  await expect(groups.locator('[data-demo="layer-panel-group-operations"]')).toContainText(
    path.startsWith("/en/") ? "Response" : "响应",
  )
  await assertLayerPanelDemoFits(groups, `${path} grouped LayerPanel after rename`)

  await groups.locator('[data-demo="layer-panel-group-menu-trigger-operations"]').click()
  const menu = groups.locator('[data-demo="layer-panel-group-menu-operations"]')
  await expect(menu).toBeVisible()
  await assertNoHorizontalOverflow(menu, `${path} LayerPanel group menu`)
  await assertLayerPanelDemoFits(groups, `${path} grouped LayerPanel with menu`)
  await groups.locator('[data-demo="layer-panel-group-menu-zoom-operations"]').click()
  await expect(groups.locator('[data-demo="layer-panel-groups-status"]')).toContainText(
    path.startsWith("/en/") ? "Menu action" : "已执行菜单",
  )
  await assertLayerPanelDemoFits(groups, `${path} grouped LayerPanel after menu action`)

  await activateByKeyboard(
    groups.locator('button[aria-label="Toggle visibility for Inspection points"]'),
  )
  await expect(groups.locator('[data-demo="layer-panel-groups-status"]')).toContainText(
    path.startsWith("/en/") ? "Shown" : "已显示",
  )
  await assertLayerPanelDemoFits(groups, `${path} grouped LayerPanel after visibility`)
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
      const page = await browser.newPage({ baseURL: baseUrl, viewport })
      try {
        for (const path of ["/components/button", "/en/components/button"] as const) {
          for (const theme of ["light", "dark"] as const) {
            await page.goto(path)
            await setDocsTheme(page, theme)
            await assertButtonPilot(page)
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
  await expect(page).toHaveURL(new RegExp(`/en${path.replaceAll("/", "\\/")}$`))
  await expect(
    page.getByRole("heading", { level: 1, name: "Install Mapseek UI", exact: true }),
  ).toBeVisible()
}

async function runOnboardingCase(baseUrl: string, browserChannel?: string): Promise<void> {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await launchBrowser(browserChannel)

  try {
    const page = await browser.newPage({ baseURL: baseUrl, viewport: { width: 1280, height: 720 } })

    await page.goto("/")
    await page.getByRole("link", { name: "安装", exact: true }).click()
    await expect(
      page.getByRole("heading", { level: 1, name: "安装 Mapseek UI", exact: true }),
    ).toBeVisible()
    const article = page.getByRole("article")
    await expect(article.getByRole("link", { name: "主题", exact: true })).toHaveAttribute(
      "href",
      "/getting-started/theming",
    )
    await expect(article.getByRole("link", { name: "Registry", exact: true })).toHaveAttribute(
      "href",
      "/getting-started/registry",
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

const primitivePages = [
  "accordion",
  "avatar",
  "badge",
  "card",
  "chart",
  "checkbox",
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
  const source = section.locator("xpath=./pre/code")
  await expect(source).toContainText(`export function ${titleFromName(primitive)}OverviewDemo`)
  await expect(source).toContainText(`@registry/ui/${primitive}`)
}

async function assertPortalFits(locator: Locator, label: string): Promise<void> {
  await expect(locator).toBeVisible()
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

async function assertPrimitiveInteraction(page: Page, primitive: string): Promise<void> {
  if (primitive === "accordion") {
    const single = page.locator('[data-demo="accordion-single"]')
    await single.getByRole("button", { name: "Supported formats?", exact: true }).click()
    await expect(single).toContainText("GeoJSON, TopoJSON")
  }

  if (primitive === "checkbox") {
    const controlled = page.locator('[data-demo="checkbox-controlled"]')
    const checkbox = controlled.getByRole("checkbox", { name: "Include in export", exact: true })
    await checkbox.focus()
    await page.keyboard.press("Space")
    await expect(controlled.getByRole("checkbox", { name: "Included in export" })).toBeChecked()
  }

  if (primitive === "combobox") {
    const combobox = page.locator('[data-demo="combobox-format"]')
    await combobox.getByLabel("Select format").fill("geo")
    await expect(page.getByText("GeoJSON", { exact: true })).toBeVisible()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(combobox.locator('[data-demo="combobox-format-value"]')).toContainText("geojson")
  }

  if (primitive === "command") {
    const command = page.locator('[data-demo="command-palette"]')
    await command.getByPlaceholder("Type a command...").fill("line")
    await expect(command.getByText("Add Line Layer", { exact: true })).toBeVisible()
    await expect(command.getByText("Add Point Layer", { exact: true })).toBeHidden()
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
    await page.getByRole("button", { name: "全部收起", exact: true }).click()
    await expect(viewer).toContainText("Feature")
    await page.getByRole("button", { name: "全部展开", exact: true }).click()
    await expect(viewer).toContainText("coordinates")
    await viewer.locator('button[title="复制"]').click()
    await expect(viewer.locator('button[title="已复制"]')).toBeVisible()
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
    const input = page.locator('[data-demo="input-controlled"]').getByLabel("Dataset file")
    await input.fill("buildings-2026.geojson")
    await expect(page.locator('[data-demo="input-value"]')).toHaveText(
      "Value: buildings-2026.geojson",
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
    await expect(select.locator('[data-demo="select-value"]')).toHaveText("Value: 3857")
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
    await expect(slider.locator('[data-demo="slider-value"]')).toHaveText("Opacity: 51%")
  }

  if (primitive === "switch") {
    const controlledSwitch = page.getByRole("switch", { name: "Enable tile cache" })
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
      .getByLabel("Layer description")
    await textarea.fill("Updated notes")
    await expect(page.locator('[data-demo="textarea-count"]')).toHaveText("Characters: 13")
    await expect(page.locator('[data-demo="textarea-readonly"] textarea')).toHaveAttribute(
      "readonly",
      "",
    )
  }

  if (primitive === "toggle") {
    const toggle = page.locator('[data-demo="toggle-controlled"]').getByRole("button", {
      name: "Snap",
      exact: true,
    })
    await toggle.focus()
    await page.keyboard.press("Enter")
    await expect(page.locator('[data-demo="toggle-value"]')).toHaveText("pressed = true")
  }

  if (primitive === "toggle-group") {
    const single = page.locator('[data-demo="toggle-group-single"]')
    await single.getByRole("button", { name: "Center", exact: true }).focus()
    await page.keyboard.press("Enter")
    await expect(single.locator('[data-demo="toggle-group-alignment"]')).toHaveText(
      "Alignment: center",
    )
    const multiple = page.locator('[data-demo="toggle-group-multiple"]')
    await multiple.getByRole("button", { name: "Italic", exact: true }).focus()
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

async function runPrimitiveCategoryCase(baseUrl: string, browserChannel?: string): Promise<void> {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await launchBrowser(browserChannel)
  const viewports: Record<DocsViewportName, { width: number; height: number }> = {
    desktop: { width: 1280, height: 720 },
    mobile: { width: 390, height: 760 },
  }

  try {
    for (const viewport of Object.values(viewports)) {
      const page = await browser.newPage({ baseURL: baseUrl, viewport })
      try {
        for (const primitive of primitivePages) {
          for (const path of [`/components/${primitive}`, `/en/components/${primitive}`] as const) {
            for (const theme of ["light", "dark"] as const) {
              await page.goto(path)
              await setDocsTheme(page, theme)
              await expect(page.getByRole("heading", { level: 1, exact: true })).toBeVisible()
              await assertDemoPreviewAndSource(page, primitive)
              await assertPrimitiveInteraction(page, primitive)
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

  if (options.category === "primitive") {
    await runPrimitiveCategoryCase(options.baseUrl, options.browserChannel)
    return
  }

  if (options.caseName === "smoke") {
    await runSmokeCase(options.baseUrl, options.browserChannel)
  }
  if (options.caseName === "button") {
    await runButtonCase(options.baseUrl, options.browserChannel)
  }
  if (options.caseName === "dialog") {
    await runDialogCase(options.baseUrl, options.browserChannel)
  }
  if (options.caseName === "pilots") {
    await runPilotsCase(options.baseUrl, options.browserChannel)
  }
  if (options.caseName === "onboarding") {
    await runOnboardingCase(options.baseUrl, options.browserChannel)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
