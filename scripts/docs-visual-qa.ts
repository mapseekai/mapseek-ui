import { type Browser, chromium, expect, type Locator, type Page } from "@playwright/test"

type DocsVisualCase = "smoke" | "button" | "dialog"
type DocsTheme = "dark" | "light"

type CliOptions = {
  readonly baseUrl: string
  readonly browserChannel?: string
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
  const caseName = readOption("--case") ?? "smoke"

  if (!baseUrl) {
    throw new Error("Missing required --base-url option.")
  }

  if (caseName !== "smoke" && caseName !== "button" && caseName !== "dialog") {
    throw new Error(`Unsupported docs visual QA case: ${caseName}`)
  }

  return { baseUrl, browserChannel, caseName }
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
  } finally {
    await browser.close()
  }
}

async function setDocsTheme(page: Page, theme: DocsTheme): Promise<void> {
  const currentTheme = await page.locator("html").getAttribute("data-theme")
  if (currentTheme !== theme) {
    await page.locator('button[class*="toggleButton"]').first().click()
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
        await expect(
          page.getByRole("heading", { level: 1, name: "Dialog", exact: true }),
        ).toBeVisible()

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
    }
  } finally {
    await browser.close()
  }
}

async function main() {
  const options = readCliOptions()

  if (options.caseName === "smoke") {
    await runSmokeCase(options.baseUrl, options.browserChannel)
  }
  if (options.caseName === "button") {
    await runButtonCase(options.baseUrl, options.browserChannel)
  }
  if (options.caseName === "dialog") {
    await runDialogCase(options.baseUrl, options.browserChannel)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
