import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@registry/ui/sidebar"
import { IconFiles, IconLayoutSidebar, IconMap2 } from "@tabler/icons-react"

import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    title: "可折叠侧边栏",
    workspace: "工作区",
    map: "地图",
    layers: "图层",
    files: "文件",
    settings: "设置",
    content: "在受限容器中预览侧边栏。",
  },
  en: {
    title: "Collapsible sidebar",
    workspace: "Workspace",
    map: "Map",
    layers: "Layers",
    files: "Files",
    settings: "Settings",
    content: "Preview the sidebar inside a bounded container.",
  },
}

export function SidebarOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const copy = labels[locale]

  return (
    <section className="space-y-3" data-demo="sidebar-overview">
      <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
        {copy.title}
      </h4>
      <div className="relative h-64 overflow-hidden border border-border">
        <SidebarProvider className="min-h-0">
          <Sidebar collapsible="icon" className="absolute inset-y-0">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>{copy.workspace}</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip={copy.map}>
                      <IconMap2 />
                      <span>{copy.map}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={copy.layers}>
                      <IconLayoutSidebar />
                      <span>{copy.layers}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={copy.files}>
                      <IconFiles />
                      <span>{copy.files}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="min-h-0">
            <div className="flex h-8 items-center gap-2 border-b border-border px-2">
              <SidebarTrigger />
              <span className="text-body-md-medium">{copy.settings}</span>
            </div>
            <p className="p-4 text-body-md text-muted-foreground">{copy.content}</p>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </section>
  )
}
