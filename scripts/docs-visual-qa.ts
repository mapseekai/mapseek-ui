import { chromium, expect } from "@playwright/test"

type DocsVisualCase = "smoke"

type CliOptions = {
  readonly baseUrl: string
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
  const caseName = readOption("--case") ?? "smoke"

  if (!baseUrl) {
    throw new Error("Missing required --base-url option.")
  }

  if (caseName !== "smoke") {
    throw new Error(`Unsupported docs visual QA case: ${caseName}`)
  }

  return { baseUrl, caseName }
}

async function assertPreviewIsAvailable(baseUrl: string) {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error(`Docs preview is not ready at ${baseUrl}: HTTP ${response.status}`)
  }
}

async function runSmokeCase(baseUrl: string) {
  await assertPreviewIsAvailable(baseUrl)

  const browser = await chromium.launch({ channel: "chrome" })

  try {
    const page = await browser.newPage({ baseURL: baseUrl })

    await page.goto("/components/_smoke")
    await expect(page.getByRole("heading", { level: 1, name: "Smoke", exact: true })).toBeVisible()
    await expect(page.getByText("Smoke demo rendered")).toBeVisible()

    await page.getByRole("button", { name: "Show source" }).click()
    await expect(page.locator("pre code")).toContainText("export function SmokeDemo")

    await page.getByRole("button", { name: "Copy source" }).click()
    await expect(page.getByText("Source copied")).toBeVisible()

    await page.getByRole("button", { name: "Reset example" }).click()
    await expect(page.getByText("Reset count: 1")).toBeVisible()

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

async function main() {
  const options = readCliOptions()

  if (options.caseName === "smoke") {
    await runSmokeCase(options.baseUrl)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
