import { MapSwitcher, type MapSwitcherItemData } from "@registry/blocks/map-switcher"
import { useState } from "react"

export type MapSwitcherDemoLabels = {
  readonly imageMode: string
  readonly buttonMode: string
  readonly controlled: string
  readonly mapPlaceholder: string
  readonly current: string
  readonly panelState: string
  readonly open: string
  readonly closed: string
  readonly expand: string
  readonly collapse: string
  readonly next: string
  readonly logTitle: string
  readonly emptyLog: string
  readonly items: readonly MapSwitcherItemData[]
}

export const zhMapSwitcherLabels = {
  imageMode: "图片模式",
  buttonMode: "按钮模式",
  controlled: "受控模式",
  mapPlaceholder: "地图背景占位",
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
      image: "https://picsum.photos/seed/map-road/152/104",
      color: "var(--muted)",
    },
    {
      id: "satellite",
      label: "卫星",
      image: "https://picsum.photos/seed/map-satellite/152/104",
      color: "var(--cat-2)",
    },
    {
      id: "terrain",
      label: "地形",
      image: "https://picsum.photos/seed/map-terrain/152/104",
      color: "var(--cat-3)",
    },
    {
      id: "dark",
      label: "暗色",
      image: "https://picsum.photos/seed/map-dark/152/104",
      color: "var(--cat-4)",
    },
  ],
} satisfies MapSwitcherDemoLabels

export const enMapSwitcherLabels = {
  imageMode: "Image mode",
  buttonMode: "Button mode",
  controlled: "Controlled mode",
  mapPlaceholder: "Map background placeholder",
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
      image: "https://picsum.photos/seed/map-road/152/104",
      color: "var(--muted)",
    },
    {
      id: "satellite",
      label: "Satellite",
      image: "https://picsum.photos/seed/map-satellite/152/104",
      color: "var(--cat-2)",
    },
    {
      id: "terrain",
      label: "Terrain",
      image: "https://picsum.photos/seed/map-terrain/152/104",
      color: "var(--cat-3)",
    },
    {
      id: "dark",
      label: "Dark",
      image: "https://picsum.photos/seed/map-dark/152/104",
      color: "var(--cat-4)",
    },
  ],
} satisfies MapSwitcherDemoLabels

function MapFrame({
  labels,
  children,
}: {
  readonly labels: MapSwitcherDemoLabels
  readonly children: React.ReactNode
}) {
  return (
    <div className="relative flex h-48 w-80 max-w-full items-end justify-end border border-border bg-muted p-3">
      <span className="absolute top-2 left-2 font-mono text-[10px] text-muted-foreground">
        {labels.mapPlaceholder}
      </span>
      {children}
    </div>
  )
}

export function MapSwitcherDemo({ labels }: { readonly labels: MapSwitcherDemoLabels }) {
  const [imageActive, setImageActive] = useState("road")
  const [buttonActive, setButtonActive] = useState("road")
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
    const currentIndex = labels.items.findIndex((item) => item.id === controlledActive)
    const nextItem = labels.items[(currentIndex + 1) % labels.items.length]
    handleControlledChange(nextItem.id)
  }

  return (
    <div data-demo="map-switcher" className="space-y-8">
      <section className="space-y-3" data-demo-section="map-switcher-image">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {labels.imageMode}
        </h3>
        <MapFrame labels={labels}>
          <MapSwitcher value={imageActive} onChange={setImageActive} mode="image">
            <MapSwitcher.Trigger />
            <MapSwitcher.Panel>
              {labels.items.map((item) => (
                <MapSwitcher.Item key={item.id} {...item} />
              ))}
            </MapSwitcher.Panel>
          </MapSwitcher>
        </MapFrame>
        <p className="m-0 text-xs text-muted-foreground">
          {labels.current}: <code className="font-mono text-[11px]">{imageActive}</code>
        </p>
      </section>

      <section className="space-y-3" data-demo-section="map-switcher-button">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {labels.buttonMode}
        </h3>
        <MapFrame labels={labels}>
          <MapSwitcher value={buttonActive} onChange={setButtonActive} mode="button">
            <MapSwitcher.Trigger />
            <MapSwitcher.Panel>
              {labels.items.map(({ id, label, color }) => (
                <MapSwitcher.Item key={id} id={id} label={label} color={color} />
              ))}
            </MapSwitcher.Panel>
          </MapSwitcher>
        </MapFrame>
        <p className="m-0 text-xs text-muted-foreground">
          {labels.current}: <code className="font-mono text-[11px]">{buttonActive}</code>
        </p>
      </section>

      <section className="space-y-3" data-demo-section="map-switcher-controlled">
        <h3 className="m-0 font-mono text-xs text-muted-foreground uppercase">
          {labels.controlled}
        </h3>
        <div className="flex flex-wrap items-start gap-4">
          <MapFrame labels={labels}>
            <MapSwitcher
              value={controlledActive}
              open={open}
              onChange={handleControlledChange}
              onOpenChange={handleOpenChange}
              mode="image"
            >
              <MapSwitcher.Trigger />
              <MapSwitcher.Panel>
                {labels.items.map((item) => (
                  <MapSwitcher.Item key={item.id} {...item} />
                ))}
              </MapSwitcher.Panel>
            </MapSwitcher>
          </MapFrame>
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                data-demo-action="map-switcher-toggle-open"
                className="border border-border bg-card px-2 py-1 text-xs text-foreground hover:bg-muted"
                onClick={() => handleOpenChange(!open)}
              >
                {open ? labels.collapse : labels.expand}
              </button>
              <button
                type="button"
                data-demo-action="map-switcher-next"
                className="border border-border bg-card px-2 py-1 text-xs text-foreground hover:bg-muted"
                onClick={handleNextItem}
              >
                {labels.next}
              </button>
            </div>
            <div className="min-h-[80px] w-48 space-y-0.5 border border-border bg-card p-2">
              <p className="mb-1 font-mono text-[10px] text-muted-foreground">{labels.logTitle}</p>
              {log.length === 0 ? (
                <p className="font-mono text-[10px] text-muted-foreground">{labels.emptyLog}</p>
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
          {labels.current}: <code className="font-mono text-[11px]">{controlledActive}</code>{" "}
          {labels.panelState}:{" "}
          <code className="font-mono text-[11px]">{open ? labels.open : labels.closed}</code>
        </p>
      </section>
    </div>
  )
}
