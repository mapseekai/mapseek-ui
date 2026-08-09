import { IconButton } from "@registry/ui/icon-button"
import { IconDownload, IconPencil, IconRefresh, IconTrash } from "@tabler/icons-react"

import type { LocalizedDemoProps } from "./types"

const iconProps = { stroke: 1.75 } as const

const labels = {
  "zh-CN": {
    default: "默认",
    editLayer: "编辑图层",
    downloadLayer: "下载图层",
    refreshLayer: "刷新图层",
    sizes: "尺寸刻度",
    editXs: "编辑图层（24px）",
    editSm: "编辑图层（28px）",
    editMd: "编辑图层（32px）",
    editLg: "编辑图层（36px）",
    editXl: "编辑图层（40px）",
    danger: "危险操作",
    deleteLayer: "删除图层",
    deleteSmallLayer: "删除小尺寸图层",
    disabledRefresh: "禁用刷新",
  },
  en: {
    default: "Default",
    editLayer: "Edit layer",
    downloadLayer: "Download layer",
    refreshLayer: "Refresh layer",
    sizes: "Size scale",
    editXs: "Edit layer (24px)",
    editSm: "Edit layer (28px)",
    editMd: "Edit layer (32px)",
    editLg: "Edit layer (36px)",
    editXl: "Edit layer (40px)",
    danger: "Danger",
    deleteLayer: "Delete layer",
    deleteSmallLayer: "Delete small layer",
    disabledRefresh: "Disabled refresh",
  },
}

export function IconButtonOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3" data-demo="icon-button-default">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.default}
        </h4>
        <div className="flex gap-2">
          <IconButton label={demoLabels.editLayer} tooltip>
            <IconPencil {...iconProps} />
          </IconButton>
          <IconButton label={demoLabels.downloadLayer} tooltip>
            <IconDownload {...iconProps} />
          </IconButton>
          <IconButton label={demoLabels.refreshLayer} tooltip>
            <IconRefresh {...iconProps} />
          </IconButton>
        </div>
      </section>

      <section className="flex flex-col gap-3" data-demo="icon-button-sizes">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.sizes}
        </h4>
        <div className="flex items-center gap-2">
          <IconButton data-demo="icon-button-size-xs" size="xs" label={demoLabels.editXs} tooltip>
            <IconPencil {...iconProps} />
          </IconButton>
          <IconButton data-demo="icon-button-size-sm" size="sm" label={demoLabels.editSm} tooltip>
            <IconPencil {...iconProps} />
          </IconButton>
          <IconButton data-demo="icon-button-size-md" size="md" label={demoLabels.editMd} tooltip>
            <IconPencil {...iconProps} />
          </IconButton>
          <IconButton data-demo="icon-button-size-lg" size="lg" label={demoLabels.editLg} tooltip>
            <IconPencil {...iconProps} />
          </IconButton>
          <IconButton data-demo="icon-button-size-xl" size="xl" label={demoLabels.editXl} tooltip>
            <IconPencil {...iconProps} />
          </IconButton>
        </div>
      </section>

      <section className="flex flex-col gap-3" data-demo="icon-button-danger">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.danger}
        </h4>
        <div className="flex items-center gap-2">
          <IconButton danger label={demoLabels.deleteLayer} tooltip>
            <IconTrash {...iconProps} />
          </IconButton>
          <IconButton danger size="xs" label={demoLabels.deleteSmallLayer} tooltip>
            <IconTrash {...iconProps} />
          </IconButton>
          <IconButton label={demoLabels.disabledRefresh} tooltip disabled>
            <IconRefresh {...iconProps} />
          </IconButton>
        </div>
      </section>
    </div>
  )
}
