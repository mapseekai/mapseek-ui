import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import { Slider } from "@workspace/ui/components/slider"
import type {
  StylePanelContextValue,
  StylePanelProps,
  StyleValue,
} from "./types"

const StylePanelContext = React.createContext<StylePanelContextValue | null>(
  null,
)

function useStylePanelContext(): StylePanelContextValue {
  const ctx = React.useContext(StylePanelContext)
  if (!ctx) {
    throw new Error(
      "StylePanel sub-components must be used inside <StylePanel>.",
    )
  }
  return ctx
}

function patch(
  value: StyleValue,
  onChange: (v: StyleValue) => void,
  delta: Partial<StyleValue>,
) {
  onChange({ ...value, ...delta })
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function StylePanelRoot({
  geometryType,
  value,
  onChange,
  className,
  children,
}: StylePanelProps) {
  const ctx = React.useMemo(
    () => ({ geometryType, value, onChange }),
    [geometryType, value, onChange],
  )
  return (
    <StylePanelContext.Provider value={ctx}>
      <div
        data-slot="style-panel"
        className={cn(
          "grid grid-cols-[56px_1fr] gap-x-3 gap-y-2.5",
          className,
        )}
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
  <label className="self-center text-[11px] font-medium uppercase leading-[14px] tracking-[0.06em] text-muted-foreground">
    {children}
  </label>
)

function StylePanelFill({
  swatches,
  className,
}: {
  swatches: string[]
  className?: string
}) {
  const { value, onChange } = useStylePanelContext()
  const current = value.fill
  return (
    <>
      <FieldLabel>填充</FieldLabel>
      <div
        data-slot="style-panel-fill"
        className={cn("flex items-center gap-1.5", className)}
      >
        {swatches.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => patch(value, onChange, { fill: c })}
            aria-label={`填充 ${c}`}
            className="size-[18px] cursor-pointer border"
            style={{
              background: c,
              borderColor:
                "color-mix(in oklch, currentColor 30%, var(--border))",
              boxShadow:
                c === current
                  ? "0 0 0 1px var(--card), 0 0 0 2px var(--primary)"
                  : "none",
            }}
          />
        ))}
      </div>
    </>
  )
}

function StylePanelOpacity({
  min = 0,
  max = 100,
}: {
  min?: number
  max?: number
}) {
  const { value, onChange } = useStylePanelContext()
  const v = value.opacity ?? max
  return (
    <>
      <FieldLabel>透明度</FieldLabel>
      <div className="flex items-center gap-2.5">
        <Slider
          min={min}
          max={max}
          value={[v]}
          onValueChange={(next) =>
            patch(value, onChange, {
              opacity: Array.isArray(next) ? next[0] : (next as number),
            })
          }
        />
        <span className="min-w-8 text-right font-mono text-[11px] tabular-nums text-foreground">
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
}: {
  min?: number
  max?: number
  step?: number
}) {
  const { value, onChange } = useStylePanelContext()
  const v = value.stroke?.width ?? 1
  return (
    <>
      <FieldLabel>描边</FieldLabel>
      <div className="flex items-center gap-2.5">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[v]}
          onValueChange={(next) =>
            patch(value, onChange, {
              stroke: {
                ...value.stroke,
                width: Array.isArray(next) ? next[0] : (next as number),
              },
            })
          }
        />
        <span className="min-w-8 text-right font-mono text-[11px] tabular-nums text-foreground">
          {v.toFixed(1)} px
        </span>
      </div>
    </>
  )
}

type MarkerShape = NonNullable<NonNullable<StyleValue["marker"]>["shape"]>

function StylePanelMarker({ shapes }: { shapes: MarkerShape[] }) {
  const { value, onChange } = useStylePanelContext()
  const cur = value.marker?.shape
  return (
    <>
      <FieldLabel>符号</FieldLabel>
      <div className="flex items-center gap-1">
        {shapes.map((s) => {
          const isCur = cur === s
          return (
            <button
              type="button"
              key={s}
              onClick={() =>
                patch(value, onChange, {
                  marker: { ...value.marker, shape: s },
                })
              }
              className={cn(
                "inline-flex size-6 items-center justify-center border text-[10px] font-mono",
                isCur
                  ? "border-primary bg-selection-bg text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted",
              )}
              aria-label={s}
              title={s}
            >
              {s === "circle" ? "●" : s === "square" ? "■" : "▲"}
            </button>
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
