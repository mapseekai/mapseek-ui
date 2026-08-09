import type { ComponentProps, ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, size, ...props }: { children?: ReactNode; size?: string }) => (
    <button {...props} data-size={size}>
      {children}
    </button>
  ),
}))
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children?: ReactNode }) => <>{children}</>,
  TooltipContent: () => null,
  TooltipTrigger: ({ render }: { render?: ReactNode }) => <>{render}</>,
}))
vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

import { AppTopBar } from "./AppTopBar"

function renderAppTopBar(size?: string) {
  const props = {
    projectName: "Land plan",
    labels: { back: "Back", save: "Save" },
    onBack: () => {},
    onSave: () => {},
    ...(size ? { size } : {}),
  } as ComponentProps<typeof AppTopBar> & { size?: string }

  return renderToStaticMarkup(<AppTopBar {...props} />)
}

describe("AppTopBar", () => {
  it("renders the primary save action with the interactive control type scale", () => {
    const html = renderToStaticMarkup(
      <AppTopBar
        projectName="Land plan"
        labels={{ back: "Back", save: "Save" }}
        onBack={() => {}}
        onSave={() => {}}
      />,
    )

    expect(html).toMatch(/<button[^>]*aria-label="Save"[^>]*class="[^"]*text-body-md-medium[^"]*"/)
    expect(html).not.toMatch(
      /<button[^>]*aria-label="Save"[^>]*class="[^"]*text-body-sm-medium[^"]*"/,
    )
  })

  it("uses a 48px desktop header shell around a 40px toolbar row", () => {
    const html = renderToStaticMarkup(
      <AppTopBar
        projectName="Land plan"
        status={<span>Unsaved changes</span>}
        labels={{ back: "Back", save: "Save" }}
        onBack={() => {}}
      />,
    )

    expect(html).toMatch(
      /^<header(?=[^>]*class="[^"]*md:h-12[^"]*")(?=[^>]*class="[^"]*py-1[^"]*")[^>]*><div(?=[^>]*class="[^"]*md:h-10[^"]*")[^>]*>/,
    )
    expect(html).toMatch(/<button[^>]*aria-label="Back"/)
    expect(html).toContain("Land plan")
    expect(html).toContain("Unsaved changes")
  })

  it("reserves equal desktop columns for center actions and collapses secondary context first", () => {
    const html = renderToStaticMarkup(
      <AppTopBar
        brand={<span>Mapseek</span>}
        projectName="Land plan"
        status={<span>Unsaved changes</span>}
        centerActions={<span>Center actions</span>}
        labels={{ back: "Back", save: "Save" }}
        onBack={() => {}}
      />,
    )

    expect(html).toContain("md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]")
    expect(html).toContain("md:col-start-2")
    expect(html).toContain("md:col-start-3")
    expect(html).toContain("md:hidden")
    expect(html).toContain("lg:inline-flex")
    expect(html).not.toContain("md:absolute")
  })

  it("keeps the status immediately after the title in centered bars", () => {
    const html = renderToStaticMarkup(
      <AppTopBar
        projectName="Land plan"
        status={<span>Unsaved changes</span>}
        centerActions={<span>Center actions</span>}
        labels={{ back: "Back", save: "Save" }}
        onBack={() => {}}
      />,
    )

    expect(html).toContain(
      '<span class="min-w-0 truncate text-body-lg-medium leading-none text-foreground">Land plan</span><span class="shrink-0 md:hidden lg:inline-flex"><span>Unsaved changes</span></span>',
    )
  })

  it.each([
    ["xs", "md:h-8", "md:h-6", "icon-xs", "xs"],
    ["sm", "md:h-9", "md:h-7", "icon-sm", "sm"],
    ["default", "md:h-12", "md:h-10", "icon", "default"],
    ["lg", "md:h-14", "md:h-12", "icon-lg", "lg"],
  ] as const)(
    "uses the %s semantic scale for the toolbar and built-in actions",
    (size, headerHeight, toolbarHeight, backButtonSize, saveButtonSize) => {
      const html = renderAppTopBar(size)

      expect(html).toMatch(
        new RegExp(
          `<header[^>]*class="[^"]*${headerHeight}[^"]*"[^>]*><div[^>]*class="[^"]*${toolbarHeight}[^"]*"`,
        ),
      )
      expect(html).toMatch(
        new RegExp(`<button[^>]*aria-label="Back"[^>]*data-size="${backButtonSize}"`),
      )
      expect(html).toMatch(
        new RegExp(`<button[^>]*aria-label="Save"[^>]*data-size="${saveButtonSize}"`),
      )
    },
  )
})
