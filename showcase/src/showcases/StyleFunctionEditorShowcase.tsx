import {
  StyleFunctionActions,
  StyleFunctionIconButton,
  StyleFunctionPanel,
  StyleFunctionStopsTable,
} from "@registry/blocks/style-function-editor"
import { Button } from "@registry/ui/button"
import { Input } from "@registry/ui/input"
import { Label } from "@registry/ui/label"
import { Select } from "@registry/ui/select"
import { Tooltip } from "@registry/ui/tooltip"
import { IconArrowBackUp, IconMathFunction, IconPlaylistAdd, IconTrash } from "@tabler/icons-react"
import { type ReactNode, useState } from "react"
import type { LocalizedDemoProps } from "./types"

type StopRow = {
  readonly zoom: number
  readonly output: string
}

const initialStops: StopRow[] = [
  { zoom: 0, output: "#f2f3f0" },
  { zoom: 8, output: "#d9e4dd" },
  { zoom: 14, output: "#2f6f4e" },
]

const labels = {
  "zh-CN": {
    title: "背景颜色",
    functionLabel: "函数",
    base: "基数",
    caption: "停靠点",
    zoom: "缩放级别",
    output: "输出值",
    remove: "删除停靠点",
    undo: "撤销函数",
    add: "添加停靠点",
    expression: "转为表达式",
    added: "已添加停靠点",
    removed: "已删除停靠点",
    converted: "已转为表达式",
    undone: "已撤销函数",
    functions: {
      interpolate: "插值",
      categorical: "分类",
      interval: "分段",
    },
  },
  en: {
    title: "Background color",
    functionLabel: "Function",
    base: "Base",
    caption: "Stops",
    zoom: "Zoom",
    output: "Output value",
    remove: "Remove stop",
    undo: "Undo function",
    add: "Add stop",
    expression: "Convert to expression",
    added: "Added stop",
    removed: "Removed stop",
    converted: "Converted to expression",
    undone: "Undone function",
    functions: {
      interpolate: "Interpolate",
      categorical: "Categorical",
      interval: "Interval",
    },
  },
}

function FieldRow({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <Label className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </Label>
  )
}

export function StyleFunctionEditorDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [stops, setStops] = useState(initialStops)
  const [status, setStatus] = useState(demoLabels.caption)

  function removeStop(index: number) {
    setStops((current) => current.filter((_, rowIndex) => rowIndex !== index))
    setStatus(demoLabels.removed)
  }

  function addStop() {
    setStops((current) => [...current, { zoom: 18, output: "#123c2a" }])
    setStatus(demoLabels.added)
  }

  return (
    <section className="max-w-xl border border-border bg-card p-4">
      <StyleFunctionPanel title={demoLabels.title}>
        <FieldRow label={demoLabels.functionLabel}>
          <Select value="interpolate" onValueChange={() => undefined}>
            <Select.Item value="interpolate">{demoLabels.functions.interpolate}</Select.Item>
            <Select.Item value="categorical">{demoLabels.functions.categorical}</Select.Item>
            <Select.Item value="interval">{demoLabels.functions.interval}</Select.Item>
          </Select>
        </FieldRow>
        <FieldRow label={demoLabels.base}>
          <Input value="1" readOnly />
        </FieldRow>
        <StyleFunctionStopsTable
          caption={demoLabels.caption}
          columns={[
            { id: "zoom", label: demoLabels.zoom, className: "w-16" },
            { id: "value", label: demoLabels.output, className: "px-2", colSpan: 2 },
          ]}
        >
          {stops.map((stop, index) => (
            <tr
              key={`${stop.zoom}-${stop.output}`}
              className="border-b border-border/50 last:border-0"
            >
              <td className="w-16 py-2 pr-2 align-top">
                <Input value={String(stop.zoom)} readOnly />
              </td>
              <td className="px-2 py-2 align-top">
                <Input value={stop.output} readOnly />
              </td>
              <td className="py-2 pl-2 text-right align-top">
                <Tooltip content={demoLabels.remove}>
                  <StyleFunctionIconButton
                    aria-label={`${demoLabels.remove}: ${stop.zoom}`}
                    data-demo-action={`style-function-editor-remove-${index}`}
                    onClick={() => removeStop(index)}
                  >
                    <IconTrash />
                  </StyleFunctionIconButton>
                </Tooltip>
              </td>
            </tr>
          ))}
        </StyleFunctionStopsTable>
        <StyleFunctionActions>
          <Tooltip content={demoLabels.undo}>
            <StyleFunctionIconButton
              aria-label={demoLabels.undo}
              data-demo-action="style-function-editor-undo"
              onClick={() => setStatus(demoLabels.undone)}
            >
              <IconArrowBackUp />
            </StyleFunctionIconButton>
          </Tooltip>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-demo-action="style-function-editor-add"
            onClick={addStop}
          >
            <IconPlaylistAdd />
            {demoLabels.add}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-demo-action="style-function-editor-expression"
            onClick={() => setStatus(demoLabels.converted)}
          >
            <IconMathFunction />
            {demoLabels.expression}
          </Button>
        </StyleFunctionActions>
      </StyleFunctionPanel>
      <p data-demo-status="style-function-editor" className="m-0 mt-3 font-mono text-xs">
        {status}
      </p>
    </section>
  )
}
