import { AppTopBar, type AppTopBarSize } from "@registry/blocks/app-top-bar"
import { ProductLogo } from "@registry/blocks/product-logo"
import { Button } from "@registry/ui/button"
import { IconButton } from "@registry/ui/icon-button"
import { Separator } from "@registry/ui/separator"
import { Tag } from "@registry/ui/tag"
import {
  IconChartBar,
  IconCircleCheck,
  IconCircleDashed,
  IconCloudUp,
  IconHistory,
  IconMap2,
  IconPencil,
  IconSettings,
} from "@tabler/icons-react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    brandAlt: "Mapseek Loom",
    projectName: "珠江三角洲用地规划",
    saved: "已保存",
    dirty: "未保存的更改",
    saveAs: "另存为",
    snapshot: "快照",
    statusReady: "状态已保存",
    statusDirty: "状态已标脏",
    centerProjectName: "城市更新分析",
    centerStatus: "草稿",
    centerActionsLabel: "地图工具",
    centerActionLabels: {
      edit: "编辑",
      map: "地图",
      publish: "发布",
      analyze: "分析",
      settings: "设置",
    },
    sizeExamplesTitle: "尺寸对比",
    sizeProjectName: "示例工程",
    sizeStatus: "草稿",
    totalHeight: (height: string) => `总高 ${height}`,
    labels: { back: "返回", save: "保存" },
  },
  en: {
    brandAlt: "Mapseek Loom",
    projectName: "Pearl River Delta land-use plan",
    saved: "Saved",
    dirty: "Unsaved changes",
    saveAs: "Save as",
    snapshot: "Snapshot",
    statusReady: "Status saved",
    statusDirty: "Status marked dirty",
    centerProjectName: "Urban renewal analysis",
    centerStatus: "Draft",
    centerActionsLabel: "Map tools",
    centerActionLabels: {
      edit: "Edit",
      map: "Map",
      publish: "Publish",
      analyze: "Analyze",
      settings: "Settings",
    },
    sizeExamplesTitle: "Size comparison",
    sizeProjectName: "Sample project",
    sizeStatus: "Draft",
    totalHeight: (height: string) => `Total ${height}`,
    labels: { back: "Back", save: "Save" },
  },
}

const sizeExamples: ReadonlyArray<{
  size: AppTopBarSize
  outerHeight: string
  actionSize: "xs" | "sm" | "default" | "lg"
}> = [
  { size: "xs", outerHeight: "32px", actionSize: "xs" },
  { size: "sm", outerHeight: "36px", actionSize: "sm" },
  { size: "default", outerHeight: "48px", actionSize: "default" },
  { size: "lg", outerHeight: "56px", actionSize: "lg" },
]

const centerActionItems = [
  { id: "edit", icon: IconPencil },
  { id: "map", icon: IconMap2 },
  { id: "publish", icon: IconCloudUp },
  { id: "analyze", icon: IconChartBar },
  { id: "settings", icon: IconSettings },
] as const

export function AppTopBarDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [dirty, setDirty] = useState(true)
  const [status, setStatus] = useState(demoLabels.statusDirty)

  const brand = (
    <span className="inline-flex items-center gap-1.5 text-foreground">
      <ProductLogo src="/img/mapseek.png" alt={demoLabels.brandAlt} size={28} />
    </span>
  )

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-3">
        <div className="border-x border-t border-border">
          <AppTopBar
            brand={brand}
            projectName={demoLabels.projectName}
            status={
              <Tag color={dirty ? "gray" : "green"}>
                {dirty ? (
                  <IconCircleDashed data-icon="inline-start" stroke={1.8} />
                ) : (
                  <IconCircleCheck data-icon="inline-start" stroke={1.8} />
                )}
                {dirty ? demoLabels.dirty : demoLabels.saved}
              </Tag>
            }
            labels={demoLabels.labels}
            onBack={() => setStatus(demoLabels.labels.back)}
            onSave={() => {
              setDirty(false)
              setStatus(demoLabels.statusReady)
            }}
            afterSaveActions={
              <Button
                type="button"
                data-demo-action="app-top-bar-save-as"
                variant="outline"
                size="default"
                onClick={() => {
                  setDirty(true)
                  setStatus(demoLabels.statusDirty)
                }}
              >
                {demoLabels.saveAs}
              </Button>
            }
            endActions={
              <Button
                type="button"
                data-demo-action="app-top-bar-snapshot"
                variant="outline"
                size="default"
                onClick={() => setStatus(demoLabels.snapshot)}
              >
                <IconHistory data-icon="inline-start" className="text-primary" />
                {demoLabels.snapshot}
              </Button>
            }
          />
        </div>
        <span data-demo-status="app-top-bar" className="font-mono text-xs text-muted-foreground">
          {status}
        </span>
      </div>

      <Separator />

      <div className="flex flex-col gap-3" data-demo="app-top-bar-sizes">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.sizeExamplesTitle}
        </h4>
        <div className="flex flex-col gap-3">
          {sizeExamples.map(({ size, outerHeight, actionSize }) => (
            <div className="flex flex-col gap-1.5" key={size}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-foreground">{size}</span>
                <span className="text-muted-foreground">{demoLabels.totalHeight(outerHeight)}</span>
              </div>
              <div className="border-x border-t border-border" data-demo-size={size}>
                <AppTopBar
                  size={size}
                  projectName={demoLabels.sizeProjectName}
                  status={<Tag color="gray">{demoLabels.sizeStatus}</Tag>}
                  labels={demoLabels.labels}
                  onBack={() => {}}
                  onSave={() => {}}
                  afterSaveActions={
                    <Button type="button" variant="outline" size={actionSize}>
                      {demoLabels.saveAs}
                    </Button>
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AppTopBarCenterActionsDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <section className="flex w-full flex-col gap-3" data-demo="app-top-bar-center-actions">
      <div className="border-x border-t border-border">
        <AppTopBar
          projectName={demoLabels.centerProjectName}
          status={<Tag color="gray">{demoLabels.centerStatus}</Tag>}
          labels={demoLabels.labels}
          onBack={() => {}}
          onSave={() => {}}
          centerActions={
            <div
              role="toolbar"
              aria-label={demoLabels.centerActionsLabel}
              className="flex items-center gap-1"
            >
              {centerActionItems.map(({ id, icon: Icon }) => (
                <IconButton
                  key={id}
                  label={demoLabels.centerActionLabels[id]}
                  tooltip
                  size="xl"
                  data-demo-action={`app-top-bar-center-${id}`}
                >
                  <Icon />
                </IconButton>
              ))}
            </div>
          }
        />
      </div>
    </section>
  )
}
