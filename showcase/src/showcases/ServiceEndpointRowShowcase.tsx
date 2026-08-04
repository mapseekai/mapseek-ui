import { ServiceEndpointRow } from "@registry/blocks/service-endpoint-row"
import { IconBraces, IconFileZip, IconGridDots } from "@tabler/icons-react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

type ServiceEndpointRowDemoLabels = {
  readonly copied: string
  readonly opened: string
  readonly copy: string
  readonly open: string
  readonly pending: string
  readonly tilesTitle: string
  readonly tilesSubtitle: string
  readonly tilejsonTitle: string
  readonly tilejsonSubtitle: string
  readonly cogTitle: string
  readonly cogSubtitle: string
}

const labels = {
  "zh-CN": {
    copied: "已复制 URL",
    opened: "已打开服务",
    copy: "复制 URL",
    open: "新窗口打开",
    pending: "接口待接入",
    tilesTitle: "栅格瓦片服务",
    tilesSubtitle: "XYZ · PNG / WEBP",
    tilejsonTitle: "TileJSON 元数据",
    tilejsonSubtitle: "TileJSON 3.0 · 元数据",
    cogTitle: "COG 源文件",
    cogSubtitle: "云优化 GeoTIFF · HTTP Range",
  } satisfies ServiceEndpointRowDemoLabels,
  en: {
    copied: "Copied URL",
    opened: "Opened service",
    copy: "Copy URL",
    open: "Open in new window",
    pending: "Endpoint pending",
    tilesTitle: "Raster tile service",
    tilesSubtitle: "XYZ · PNG / WEBP",
    tilejsonTitle: "TileJSON",
    tilejsonSubtitle: "TileJSON 3.0 · metadata",
    cogTitle: "COG source",
    cogSubtitle: "Cloud Optimized GeoTIFF · HTTP Range",
  } satisfies ServiceEndpointRowDemoLabels,
}

export function ServiceEndpointRowDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [status, setStatus] = useState(demoLabels.pending)

  return (
    <div className="flex flex-col gap-3">
      <span
        data-demo-status="service-endpoint-row"
        className="font-mono text-xs text-muted-foreground"
      >
        {status}
      </span>
      <ServiceEndpointRow
        title={demoLabels.tilesTitle}
        subtitle={demoLabels.tilesSubtitle}
        method="GET"
        url="https://api.mapseek.io/v1/raster/{uid}/tiles/{z}/{x}/{y}.png"
        icon={
          <span className="flex size-9 items-center justify-center border border-warning/25 bg-warning/10 text-warning">
            <IconGridDots size={16} stroke={1.75} />
          </span>
        }
        onCopy={() => setStatus(`${demoLabels.copied}: tiles`)}
        copyLabel={demoLabels.copy}
        openDisabled
        openLabel={demoLabels.open}
        openTooltip={demoLabels.pending}
      />
      <ServiceEndpointRow
        title={demoLabels.tilejsonTitle}
        subtitle={demoLabels.tilejsonSubtitle}
        method="GET"
        url="https://api.mapseek.io/v1/raster/{uid}/tilejson.json"
        icon={
          <span className="flex size-9 items-center justify-center border border-info/25 bg-info/10 text-info">
            <IconBraces size={16} stroke={1.75} />
          </span>
        }
        onCopy={() => setStatus(`${demoLabels.copied}: tilejson`)}
        copyLabel={demoLabels.copy}
        openLabel={demoLabels.open}
        openTooltip={demoLabels.open}
        onOpen={() => setStatus(`${demoLabels.opened}: tilejson`)}
      />
      <ServiceEndpointRow
        title={demoLabels.cogTitle}
        subtitle={demoLabels.cogSubtitle}
        method="GET"
        url="https://api.mapseek.io/v1/raster/{uid}/source.tif"
        icon={
          <span className="flex size-9 items-center justify-center border border-info/25 bg-info/10 text-info">
            <IconFileZip size={16} stroke={1.75} />
          </span>
        }
        onCopy={() => setStatus(`${demoLabels.copied}: cog`)}
        copyLabel={demoLabels.copy}
        openDisabled
        openLabel={demoLabels.open}
        openTooltip={demoLabels.pending}
      />
    </div>
  )
}
