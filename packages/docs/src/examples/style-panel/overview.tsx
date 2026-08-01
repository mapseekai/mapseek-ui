import { StylePanel, type StyleValue } from "@registry/blocks/style-panel"
import { Button } from "@registry/ui/button"
import { useState } from "react"

const initialStyle: StyleValue = {
  fill: "#00a63d",
  opacity: 80,
  stroke: { color: "#166534", width: 1.5 },
  marker: { shape: "circle", size: 8 },
}

export const zhStylePanelLabels = {
  labels: {
    fill: "填充",
    fillColor: "填充颜色",
    opacity: "透明度",
    stroke: "描边",
    marker: "符号",
  },
  reset: "重置",
  changed: "已更新样式",
  summary: "当前样式",
}

export const enStylePanelLabels = {
  labels: {
    fill: "Fill",
    fillColor: "Fill color",
    opacity: "Opacity",
    stroke: "Stroke",
    marker: "Marker",
  },
  reset: "Reset",
  changed: "Updated style",
  summary: "Current style",
}

const swatches = ["#00a63d", "#2563eb", "#f59e0b", "#dc2626"]

export function StylePanelDemo({ labels }: { readonly labels: typeof zhStylePanelLabels }) {
  const [value, setValue] = useState<StyleValue>(initialStyle)
  const [status, setStatus] = useState(labels.summary)

  return (
    <section data-demo="style-panel" className="max-w-lg border border-border bg-card p-4">
      <StylePanel
        geometryType="polygon"
        value={value}
        onChange={(next) => {
          setValue(next)
          setStatus(labels.changed)
        }}
        labels={labels.labels}
      >
        <StylePanel.Fill swatches={swatches} />
        <StylePanel.Opacity />
        <StylePanel.Stroke />
        <StylePanel.Marker shapes={["circle", "square", "triangle"]} />
      </StylePanel>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <p data-demo-status="style-panel" className="m-0 font-mono text-xs">
          {status}
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-demo-action="style-panel-reset"
          onClick={() => {
            setValue(initialStyle)
            setStatus(labels.reset)
          }}
        >
          {labels.reset}
        </Button>
      </div>
      <pre className="mt-3 overflow-x-auto text-xs text-muted-foreground">
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  )
}
