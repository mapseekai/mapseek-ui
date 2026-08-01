import {
  StyleColorInput,
  type StyleColorInputLayout,
  type StyleColorInputMode,
} from "@registry/blocks/style-color-input"
import { Button } from "@registry/ui/button"
import { useState } from "react"

type ColorInputRow = {
  readonly id: string
  readonly label: string
  readonly mode: StyleColorInputMode
  readonly layout?: StyleColorInputLayout
}

export const zhStyleColorInputLabels = {
  rows: [
    { id: "button-input", label: "按钮和输入框", mode: "button-input" },
    { id: "input-swatch", label: "输入框和按钮", mode: "button-input", layout: "input-swatch" },
    { id: "button", label: "仅颜色按钮", mode: "button" },
    { id: "input", label: "仅输入框", mode: "input" },
  ] satisfies readonly ColorInputRow[],
  preset: "套用",
  close: "关闭",
  open: "打开",
  statusPrefix: "当前颜色",
  placeholder: "输入颜色值",
}

export const enStyleColorInputLabels = {
  rows: [
    { id: "button-input", label: "Button and input", mode: "button-input" },
    { id: "input-swatch", label: "Input and button", mode: "button-input", layout: "input-swatch" },
    { id: "button", label: "Button only", mode: "button" },
    { id: "input", label: "Input only", mode: "input" },
  ] satisfies readonly ColorInputRow[],
  preset: "Apply",
  close: "Close",
  open: "Open",
  statusPrefix: "Current color",
  placeholder: "Enter a color",
}

const presets = ["#22c55e", "#2563eb", "#f59e0b", "#dc2626"] as const

export function StyleColorInputDemo({
  labels,
}: {
  readonly labels: typeof zhStyleColorInputLabels
}) {
  const [values, setValues] = useState<Record<string, string>>({
    "button-input": "#22c55e",
    "input-swatch": "#2563eb",
    button: "#f59e0b",
    input: "#dc2626",
  })
  const [openId, setOpenId] = useState<string | undefined>()
  const [status, setStatus] = useState(`${labels.statusPrefix}: #22c55e`)

  function setColor(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }))
    setStatus(`${labels.statusPrefix}: ${value}`)
  }

  return (
    <section data-demo="style-color-input" className="flex max-w-xl flex-col gap-3">
      {labels.rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-[132px_minmax(0,1fr)] items-center gap-3 border border-border bg-card p-3"
        >
          <span className="font-mono text-xs text-muted-foreground">{row.label}</span>
          <StyleColorInput
            aria-label={row.label}
            inputPlaceholder={labels.placeholder}
            swatchLabel={`${labels.open}: ${row.label}`}
            mode={row.mode}
            layout={row.layout}
            open={openId === row.id}
            value={values[row.id]}
            onOpenChange={(open) => setOpenId(open ? row.id : undefined)}
            onTextChange={(value) => setColor(row.id, value)}
            renderPicker={({ close }) => (
              <div className="flex w-60 flex-col gap-3">
                <div className="grid grid-cols-4 gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label={`${labels.preset}: ${preset}`}
                      data-demo-action={`style-color-input-${row.id}-${preset}`}
                      style={{ backgroundColor: preset }}
                      onClick={() => setColor(row.id, preset)}
                    />
                  ))}
                </div>
                <Button type="button" size="sm" onClick={close}>
                  {labels.close}
                </Button>
              </div>
            )}
          />
        </div>
      ))}
      <p data-demo-status="style-color-input" className="m-0 font-mono text-xs">
        {status}
      </p>
    </section>
  )
}
