import * as React from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { DEFAULT_STYLE_PANEL_LABELS } from "./defaults"
import type { StylePanelContextValue, StylePanelProps, StyleValue } from "./types"

const StylePanelContext = React.createContext<StylePanelContextValue | null>(null)

function useStylePanelContext(): StylePanelContextValue {
  const ctx = React.useContext(StylePanelContext)
  if (!ctx) {
    throw new Error("StylePanel sub-components must be used inside <StylePanel>.")
  }
  return ctx
}

function patch(value: StyleValue, onChange: (v: StyleValue) => void, delta: Partial<StyleValue>) {
  onChange({ ...value, ...delta })
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function StylePanelRoot({
  geometryType,
  value,
  onChange,
  labels,
  className,
  children,
}: StylePanelProps) {
  const resolvedLabels = resolveLabels(DEFAULT_STYLE_PANEL_LABELS, labels)
  const ctx = React.useMemo(
    () => ({ geometryType, value, onChange, labels: resolvedLabels }),
    [geometryType, value, onChange, resolvedLabels],
  )
  return (
    <StylePanelContext.Provider value={ctx}>
      <div
        data-slot="style-panel"
        className={cn("grid grid-cols-[56px_1fr] gap-x-3 gap-y-2.5", className)}
      >
        {children}
      </div>
    </StylePanelContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Sub-controls
// ---------------------------------------------------------------------------

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="self-center text-[11px] leading-[14px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
    {children}
  </span>
)

function StylePanelFill({
  swatches,
  label,
  className,
}: {
  swatches: string[]
  label?: string
  className?: string
}) {
  const { value, onChange, labels } = useStylePanelContext()
  const current = value.fill
  return (
    <>
      <FieldLabel>{label ?? labels.fill}</FieldLabel>
      <div data-slot="style-panel-fill" className={cn("flex items-center gap-1.5", className)}>
        {swatches.map((c) => (
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            key={c}
            onClick={() => patch(value, onChange, { fill: c })}
            aria-label={`${labels.fillColor} ${c}`}
            className="size-[18px] cursor-pointer border"
            style={{
              background: c,
              borderColor: "color-mix(in oklch, currentColor 30%, var(--border))",
              boxShadow: c === current ? "0 0 0 1px var(--card), 0 0 0 2px var(--primary)" : "none",
            }}
          />
        ))}
      </div>
    </>
  )
}

function StylePanelOpacity({ min = 0, max = 100 }: { min?: number; max?: number }) {
  const { value, onChange, labels } = useStylePanelContext()
  const v = value.opacity ?? max
  return (
    <>
      <FieldLabel>{labels.opacity}</FieldLabel>
      <div className="flex items-center gap-2.5">
        <Slider
          min={min}
          max={max}
          value={v}
          onValueChange={(next) =>
            patch(value, onChange, {
              opacity: Array.isArray(next) ? next[0] : (next as number),
            })
          }
        />
        <span className="min-w-8 text-right font-mono text-[11px] text-foreground tabular-nums">
          {v}%
        </span>
      </div>
    </>
  )
}

function StylePanelStroke({
  min = 0,
  max = 8,
  step = 0.5,
  label,
}: {
  min?: number
  max?: number
  step?: number
  label?: string
}) {
  const { value, onChange, labels } = useStylePanelContext()
  const v = value.stroke?.width ?? 1
  return (
    <>
      <FieldLabel>{label ?? labels.stroke}</FieldLabel>
      <div className="flex items-center gap-2.5">
        <Slider
          min={min}
          max={max}
          step={step}
          value={v}
          onValueChange={(next) =>
            patch(value, onChange, {
              stroke: {
                ...value.stroke,
                width: Array.isArray(next) ? next[0] : (next as number),
              },
            })
          }
        />
        <span className="min-w-8 text-right font-mono text-[11px] text-foreground tabular-nums">
          {v.toFixed(1)} px
        </span>
      </div>
    </>
  )
}

type MarkerShape = NonNullable<NonNullable<StyleValue["marker"]>["shape"]>

function StylePanelMarker({ shapes }: { shapes: MarkerShape[] }) {
  const { value, onChange, labels } = useStylePanelContext()
  const cur = value.marker?.shape
  return (
    <>
      <FieldLabel>{labels.marker}</FieldLabel>
      <div className="flex items-center gap-1">
        {shapes.map((s) => {
          const isCur = cur === s
          return (
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              key={s}
              onClick={() =>
                patch(value, onChange, {
                  marker: { ...value.marker, shape: s },
                })
              }
              className={cn(
                "inline-flex size-6 items-center justify-center border font-mono text-[10px]",
                isCur
                  ? "border-primary bg-selection-bg text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted",
              )}
              aria-label={s}
              title={s}
            >
              {s === "circle" ? "●" : s === "square" ? "■" : "▲"}
            </Button>
          )
        })}
      </div>
    </>
  )
}

export const StylePanel = Object.assign(StylePanelRoot, {
  Fill: StylePanelFill,
  Opacity: StylePanelOpacity,
  Stroke: StylePanelStroke,
  Marker: StylePanelMarker,
})
