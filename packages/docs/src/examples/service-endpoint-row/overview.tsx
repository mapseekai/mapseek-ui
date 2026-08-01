import { ServiceEndpointRow } from "@registry/blocks/service-endpoint-row"
import { IconBraces, IconFileZip, IconGridDots } from "@tabler/icons-react"
import { useState } from "react"

export const zhServiceEndpointRowLabels = {
  copied: "已复制 URL",
  opened: "已打开服务",
  copy: "复制 URL",
  open: "新窗口打开",
  pending: "接口待接入",
}

export const enServiceEndpointRowLabels = {
  copied: "Copied URL",
  opened: "Opened service",
  copy: "Copy URL",
  open: "Open in new window",
  pending: "Endpoint pending",
}

export function ServiceEndpointRowDemo({
  labels,
}: {
  readonly labels: typeof zhServiceEndpointRowLabels
}) {
  const [status, setStatus] = useState(labels.pending)

  return (
    <div data-demo="service-endpoint-row" className="flex flex-col gap-3">
      <span
        data-demo-status="service-endpoint-row"
        className="font-mono text-xs text-muted-foreground"
      >
        {status}
      </span>
      <ServiceEndpointRow
        title="Raster tile service"
        subtitle="XYZ · PNG / WEBP"
        method="GET"
        url="https://api.mapseek.io/v1/raster/{uid}/tiles/{z}/{x}/{y}.png"
        icon={
          <span className="flex size-9 items-center justify-center border border-warning/25 bg-warning/10 text-warning">
            <IconGridDots size={16} stroke={1.75} />
          </span>
        }
        onCopy={() => setStatus(`${labels.copied}: tiles`)}
        copyLabel={labels.copy}
        openDisabled
        openLabel={labels.open}
        openTooltip={labels.pending}
      />
      <ServiceEndpointRow
        title="TileJSON"
        subtitle="TileJSON 3.0 · metadata"
        method="GET"
        url="https://api.mapseek.io/v1/raster/{uid}/tilejson.json"
        icon={
          <span className="flex size-9 items-center justify-center border border-info/25 bg-info/10 text-info">
            <IconBraces size={16} stroke={1.75} />
          </span>
        }
        onCopy={() => setStatus(`${labels.copied}: tilejson`)}
        copyLabel={labels.copy}
        openLabel={labels.open}
        openTooltip={labels.open}
        onOpen={() => setStatus(`${labels.opened}: tilejson`)}
      />
      <ServiceEndpointRow
        title="COG source"
        subtitle="Cloud Optimized GeoTIFF · HTTP Range"
        method="GET"
        url="https://api.mapseek.io/v1/raster/{uid}/source.tif"
        icon={
          <span className="flex size-9 items-center justify-center border border-info/25 bg-info/10 text-info">
            <IconFileZip size={16} stroke={1.75} />
          </span>
        }
        onCopy={() => setStatus(`${labels.copied}: cog`)}
        copyLabel={labels.copy}
        openDisabled
        openLabel={labels.open}
        openTooltip={labels.pending}
      />
    </div>
  )
}
