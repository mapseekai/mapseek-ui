import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { useIsMobile } from "../lib/use-mobile"
import { SidebarGroupLabel, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "./sidebar"

describe("Sidebar", () => {
  it("renders provider children within the sidebar wrapper", () => {
    const markup = renderToStaticMarkup(
      <SidebarProvider>
        <span>Workspace</span>
      </SidebarProvider>,
    )

    expect(markup).toContain('data-slot="sidebar-wrapper"')
    expect(markup).toContain("Workspace")
  })

  it("uses semantic spacing and typography for menu controls", () => {
    const markup = renderToStaticMarkup(
      <SidebarProvider>
        <SidebarGroupLabel>Layers</SidebarGroupLabel>
        <SidebarTrigger />
        <SidebarMenuButton>Layers</SidebarMenuButton>
      </SidebarProvider>,
    )

    expect(markup).toContain('data-slot="sidebar-group-label"')
    expect(markup).toContain('data-slot="sidebar-trigger"')
    expect(markup).toContain('data-slot="sidebar-menu-button"')
    expect(markup).toContain("text-body-sm")
    expect(markup).toContain("text-body-md")
    expect(markup).toContain("rounded-none")
  })

  it("exports a mobile hook that is safe to import during server rendering", () => {
    expect(useIsMobile).toBeTypeOf("function")
  })
})
