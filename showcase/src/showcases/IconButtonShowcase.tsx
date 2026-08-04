import { IconButton } from "@registry/ui/icon-button"
import { IconDownload, IconPencil, IconRefresh, IconTrash } from "@tabler/icons-react"

const iconProps = { stroke: 1.75 } as const

import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    defaultMd: "默认 md",
    editLayer: "编辑图层",
    downloadLayer: "下载图层",
    refreshLayer: "刷新图层",
    small: "小尺寸",
    editSmallLayer: "编辑小尺寸图层",
    downloadSmallLayer: "下载小尺寸图层",
    danger: "危险操作",
    deleteLayer: "删除图层",
    deleteSmallLayer: "删除小尺寸图层",
    disabledRefresh: "禁用刷新",
  },
  en: {
    defaultMd: "Default md",
    editLayer: "Edit layer",
    downloadLayer: "Download layer",
    refreshLayer: "Refresh layer",
    small: "Small",
    editSmallLayer: "Edit small layer",
    downloadSmallLayer: "Download small layer",
    danger: "Danger",
    deleteLayer: "Delete layer",
    deleteSmallLayer: "Delete small layer",
    disabledRefresh: "Disabled refresh",
  },
}

export function IconButtonOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <div className="space-y-8">
      <section className="space-y-3" data-demo="icon-button-default">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.defaultMd}
        </h4>
        <div className="flex gap-2">
          <IconButton aria-label={demoLabels.editLayer} title={demoLabels.editLayer}>
            <IconPencil {...iconProps} />
          </IconButton>
          <IconButton aria-label={demoLabels.downloadLayer} title={demoLabels.downloadLayer}>
            <IconDownload {...iconProps} />
          </IconButton>
          <IconButton aria-label={demoLabels.refreshLayer} title={demoLabels.refreshLayer}>
            <IconRefresh {...iconProps} />
          </IconButton>
        </div>
      </section>

      <section className="space-y-3" data-demo="icon-button-small">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.small}
        </h4>
        <div className="flex gap-2">
          <IconButton
            size="sm"
            aria-label={demoLabels.editSmallLayer}
            title={demoLabels.editSmallLayer}
          >
            <IconPencil {...iconProps} />
          </IconButton>
          <IconButton
            size="sm"
            aria-label={demoLabels.downloadSmallLayer}
            title={demoLabels.downloadSmallLayer}
          >
            <IconDownload {...iconProps} />
          </IconButton>
        </div>
      </section>

      <section className="space-y-3" data-demo="icon-button-danger">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.danger}
        </h4>
        <div className="flex items-center gap-2">
          <IconButton danger aria-label={demoLabels.deleteLayer} title={demoLabels.deleteLayer}>
            <IconTrash {...iconProps} />
          </IconButton>
          <IconButton
            danger
            size="sm"
            aria-label={demoLabels.deleteSmallLayer}
            title={demoLabels.deleteSmallLayer}
          >
            <IconTrash {...iconProps} />
          </IconButton>
          <IconButton
            aria-label={demoLabels.disabledRefresh}
            title={demoLabels.disabledRefresh}
            disabled
          >
            <IconRefresh {...iconProps} />
          </IconButton>
        </div>
      </section>
    </div>
  )
}
