import { MapSwitcher } from "@registry/blocks/map-switcher"
import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

function mapThumbnailDataUri(primary: string, accent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 152 104"><rect width="152" height="104" fill="${primary}"/><path d="M-10 84C24 62 42 70 72 48s54-28 92-18" fill="none" stroke="${accent}" stroke-width="14" stroke-linecap="round"/><path d="M8 18h136M18 8v88M76 0v104M128 4v96" stroke="rgba(255,255,255,.38)" stroke-width="2"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const mapThumbnails = {
  road: mapThumbnailDataUri("#eef2f7", "#64748b"),
  satellite: mapThumbnailDataUri("#173b2f", "#84cc16"),
  terrain: mapThumbnailDataUri("#d9e5c7", "#7c8f3f"),
  dark: mapThumbnailDataUri("#111827", "#38bdf8"),
} as const

const labels = {
  "zh-CN": {
    iconVariant: "变体 1:图标触发",
    imageVariant: "变体 2:图片触发",
    controlled: "受控模式",
    mapPlaceholder: "地图背景占位",
    basemap: "底图切换",
    current: "当前选中",
    panelState: "面板状态",
    open: "open",
    closed: "closed",
    expand: "展开",
    collapse: "收起",
    next: "切换下一个",
    logTitle: "回调日志",
    emptyLog: "-",
    items: [
      {
        id: "road",
        label: "标准",
        image: mapThumbnails.road,
        color: "var(--muted)",
      },
      {
        id: "satellite",
        label: "卫星",
        image: mapThumbnails.satellite,
        color: "var(--cat-2)",
      },
      {
        id: "terrain",
        label: "地形",
        image: mapThumbnails.terrain,
        color: "var(--cat-3)",
      },
      {
        id: "dark",
        label: "暗色",
        image: mapThumbnails.dark,
        color: "var(--cat-4)",
      },
    ],
  },
  en: {
    iconVariant: "Variant 1: icon trigger",
    imageVariant: "Variant 2: image trigger",
    controlled: "Controlled mode",
    mapPlaceholder: "Map background placeholder",
    basemap: "Basemap",
    current: "Current",
    panelState: "Panel state",
    open: "open",
    closed: "closed",
    expand: "Expand",
    collapse: "Collapse",
    next: "Next item",
    logTitle: "Callback log",
    emptyLog: "-",
    items: [
      {
        id: "road",
        label: "Road",
        image: mapThumbnails.road,
        color: "var(--muted)",
      },
      {
        id: "satellite",
        label: "Satellite",
        image: mapThumbnails.satellite,
        color: "var(--cat-2)",
      },
      {
        id: "terrain",
        label: "Terrain",
        image: mapThumbnails.terrain,
        color: "var(--cat-3)",
      },
      {
        id: "dark",
        label: "Dark",
        image: mapThumbnails.dark,
        color: "var(--cat-4)",
      },
    ],
  },
}

function MapFrame({
  demoLabels,
  children,
}: {
  readonly demoLabels: (typeof labels)["zh-CN"] | (typeof labels)["en"]
  readonly children: React.ReactNode
}) {
  return (
    <div className="relative flex h-48 w-80 max-w-full items-end justify-center border border-border bg-muted p-3">
      <span className="absolute top-2 left-2 font-mono text-[10px] text-muted-foreground">
        {demoLabels.mapPlaceholder}
      </span>
      {children}
    </div>
  )
}

export function MapSwitcherDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [iconActive, setIconActive] = useState("road")
  const [imageActive, setImageActive] = useState("road")
  const [controlledActive, setControlledActive] = useState("satellite")
  const [open, setOpen] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const handleControlledChange = (id: string) => {
    setControlledActive(id)
    setLog((current) => [`onChange("${id}")`, ...current].slice(0, 5))
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    setLog((current) => [`onOpenChange(${nextOpen})`, ...current].slice(0, 5))
  }

  const handleNextItem = () => {
    const currentIndex = demoLabels.items.findIndex((item) => item.id === controlledActive)
    const nextItem = demoLabels.items[(currentIndex + 1) % demoLabels.items.length]
    handleControlledChange(nextItem.id)
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3" data-demo-section="map-switcher-icon">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {demoLabels.iconVariant}
        </h3>
        <MapFrame demoLabels={demoLabels}>
          <MapSwitcher value={iconActive} onChange={setIconActive} variant="icon">
            <MapSwitcher.Trigger label={demoLabels.basemap} />
            <MapSwitcher.Panel>
              {demoLabels.items.map(({ id, label, color }) => (
                <MapSwitcher.Item key={id} id={id} label={label} color={color} />
              ))}
            </MapSwitcher.Panel>
          </MapSwitcher>
        </MapFrame>
        <p className="m-0 text-xs text-muted-foreground">
          {demoLabels.current}: <code className="font-mono text-[11px]">{iconActive}</code>
        </p>
      </section>

      <section className="space-y-3" data-demo-section="map-switcher-image">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {demoLabels.imageVariant}
        </h3>
        <MapFrame demoLabels={demoLabels}>
          <MapSwitcher value={imageActive} onChange={setImageActive} variant="image">
            <MapSwitcher.Trigger />
            <MapSwitcher.Panel>
              {demoLabels.items.map((item) => (
                <MapSwitcher.Item key={item.id} {...item} />
              ))}
            </MapSwitcher.Panel>
          </MapSwitcher>
        </MapFrame>
        <p className="m-0 text-xs text-muted-foreground">
          {demoLabels.current}: <code className="font-mono text-[11px]">{imageActive}</code>
        </p>
      </section>

      <section className="space-y-3" data-demo-section="map-switcher-controlled">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {demoLabels.controlled}
        </h3>
        <div className="flex flex-wrap items-start gap-4">
          <MapFrame demoLabels={demoLabels}>
            <MapSwitcher
              value={controlledActive}
              open={open}
              onChange={handleControlledChange}
              onOpenChange={handleOpenChange}
              variant="image"
            >
              <MapSwitcher.Trigger />
              <MapSwitcher.Panel>
                {demoLabels.items.map((item) => (
                  <MapSwitcher.Item key={item.id} {...item} />
                ))}
              </MapSwitcher.Panel>
            </MapSwitcher>
          </MapFrame>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                type="button"
                data-demo-action="map-switcher-toggle-open"
                variant="outline"
                size="xs"
                onClick={() => handleOpenChange(!open)}
              >
                {open ? demoLabels.collapse : demoLabels.expand}
              </Button>
              <Button
                type="button"
                data-demo-action="map-switcher-next"
                variant="outline"
                size="xs"
                onClick={handleNextItem}
              >
                {demoLabels.next}
              </Button>
            </div>
            <div className="min-h-[80px] w-48 space-y-0.5 border border-border bg-card p-2">
              <p className="mb-1 font-mono text-[10px] text-muted-foreground">
                {demoLabels.logTitle}
              </p>
              {log.length === 0 ? (
                <p className="font-mono text-[10px] text-muted-foreground">{demoLabels.emptyLog}</p>
              ) : (
                log.map((entry) => (
                  <p key={entry} className="font-mono text-[10px] text-foreground">
                    {entry}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
        <p data-demo-status="map-switcher" className="m-0 text-xs text-muted-foreground">
          {demoLabels.current}: <code className="font-mono text-[11px]">{controlledActive}</code>{" "}
          {demoLabels.panelState}:{" "}
          <code className="font-mono text-[11px]">
            {open ? demoLabels.open : demoLabels.closed}
          </code>
        </p>
      </section>
    </div>
  )
}
