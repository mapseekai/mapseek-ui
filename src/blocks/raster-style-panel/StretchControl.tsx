import { IconWand } from "@tabler/icons-react"
import { Input } from "../../components/input"
import { cn } from "../../lib/utils"
import { Segmented } from "./Segmented"
import type { RasterBand, RasterStretch, StretchMode } from "./types"

const numInput =
  "h-[26px] flex-1 rounded-none px-1.5 text-right font-mono text-[11px] tabular-nums"
const segBtn = "font-mono text-[10px] uppercase tracking-[0.04em]"
const hint =
  "shrink-0 font-mono text-[10px] uppercase tracking-[0.04em] text-muted-foreground"

const MODES: StretchMode[] = ["custom", "minmax", "percent", "stddev"]

export interface StretchControlLabels {
  modes: Record<StretchMode, string>
  minmaxHint: string
  percentHint: string
  sigmaHint: string
  sigmaSuffix: string
  auto: string
}

export interface StretchControlProps {
  value: RasterStretch
  onChange: (next: RasterStretch) => void
  /** When more than one band, custom mode renders a per-band rescale stack. */
  bands?: RasterBand[]
  labels: StretchControlLabels
  /** Pre-fill target for the single-band "Auto" button. */
  autoRange?: [number, number]
  className?: string
}

export function StretchControl({
  value,
  onChange,
  bands,
  labels,
  autoRange,
  className,
}: StretchControlProps) {
  const multiband = (bands?.length ?? 0) > 1
  const set = (patch: Partial<RasterStretch>) => onChange({ ...value, ...patch })

  const rescale = value.rescale ?? [0, 0]
  const percent = value.percent ?? [2, 98]
  const rescaleBands = value.rescaleBands ?? []

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Segmented<StretchMode>
        options={MODES.map((m) => ({ value: m, label: labels.modes[m] }))}
        value={value.mode}
        onChange={(mode) => set({ mode })}
        buttonClassName={segBtn}
      />

      {value.mode === "custom" &&
        (multiband ? (
          <div className="flex w-full flex-col gap-1">
            {bands!.map((b, i) => {
              const pair = rescaleBands[i] ?? [0, 0]
              const update = (next: [number, number]) => {
                const copy = bands!.map((_, j) => rescaleBands[j] ?? [0, 0])
                copy[i] = next
                set({ rescaleBands: copy })
              }
              return (
                <div key={b.idx} className="flex items-center gap-1">
                  <span className={cn(hint, "w-7")}>B{b.idx}</span>
                  <Input
                    type="number"
                    className={numInput}
                    value={pair[0]}
                    onChange={(e) => update([Number(e.target.value), pair[1]])}
                  />
                  <span className={hint}>→</span>
                  <Input
                    type="number"
                    className={numInput}
                    value={pair[1]}
                    onChange={(e) => update([pair[0], Number(e.target.value)])}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              className={numInput}
              value={rescale[0]}
              onChange={(e) => set({ rescale: [Number(e.target.value), rescale[1]] })}
            />
            <span className={hint}>→</span>
            <Input
              type="number"
              className={numInput}
              value={rescale[1]}
              onChange={(e) => set({ rescale: [rescale[0], Number(e.target.value)] })}
            />
            {autoRange && (
              <button
                type="button"
                onClick={() => set({ rescale: autoRange })}
                className="inline-flex h-[26px] shrink-0 cursor-pointer items-center gap-1 border border-primary/25 bg-primary/[0.08] px-2 font-mono text-[10px] uppercase tracking-[0.04em] text-primary hover:bg-primary/15"
              >
                <IconWand size={11} stroke={1.75} /> {labels.auto}
              </button>
            )}
          </div>
        ))}

      {value.mode === "minmax" && (
        <span className={hint}>{labels.minmaxHint}</span>
      )}

      {value.mode === "percent" && (
        <div className="flex items-center gap-1">
          <span className={hint}>{labels.percentHint}</span>
          <Input
            type="number"
            min={0}
            max={50}
            step={0.1}
            className={numInput}
            value={percent[0]}
            onChange={(e) => set({ percent: [Number(e.target.value), percent[1]] })}
          />
          <span className={hint}>,</span>
          <Input
            type="number"
            min={50}
            max={100}
            step={0.1}
            className={numInput}
            value={percent[1]}
            onChange={(e) => set({ percent: [percent[0], Number(e.target.value)] })}
          />
        </div>
      )}

      {value.mode === "stddev" && (
        <div className="flex items-center gap-1">
          <span className={hint}>{labels.sigmaHint}</span>
          <Input
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            className={cn(numInput, "max-w-20 flex-none")}
            value={value.sigma ?? 2.0}
            onChange={(e) => set({ sigma: Number(e.target.value) })}
          />
          <span className={hint}>{labels.sigmaSuffix}</span>
        </div>
      )}
    </div>
  )
}
