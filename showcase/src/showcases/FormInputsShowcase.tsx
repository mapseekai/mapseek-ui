import {
  InputAutocomplete,
  InputCheckbox,
  InputEnum,
  InputFont,
  InputMultiInput,
  InputNumber,
  InputSelect,
  InputString,
} from "@registry/blocks/form-inputs"
import { NumberRangeInput } from "@registry/blocks/number-range-input"
import type { ReactNode } from "react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

function Row({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

const enumOptions: [string, string][] = [
  ["visible", "visible"],
  ["none", "none"],
]

const selectOptions: [string, string][] = [
  ["mercator", "Web Mercator"],
  ["globe", "Globe"],
  ["equalEarth", "Equal Earth"],
  ["naturalEarth", "Natural Earth"],
]

const labels = {
  "zh-CN": {
    intro: "commit-on-blur 输入件集合；短枚举使用内联选项，长枚举使用下拉或自动补全。",
    reset: "重置值",
  },
  en: {
    intro:
      "Commit-on-blur inputs; short enums use inline choices and longer sets use select/autocomplete.",
    reset: "Reset values",
  },
}

export function FormInputsDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [text, setText] = useState("Roads · OSM")
  const [multi, setMulti] = useState("line one\nline two")
  const [num, setNum] = useState<number | undefined>(12)
  const [range, setRange] = useState<number | undefined>(50)
  const [checked, setChecked] = useState(true)
  const [selected, setSelected] = useState("globe")
  const [visibility, setVisibility] = useState("visible")
  const [font, setFont] = useState("Open Sans Regular")
  const [fontStack, setFontStack] = useState<string[]>(["Open Sans Regular"])

  return (
    <div className="flex w-full max-w-[520px] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs text-muted-foreground">{demoLabels.intro}</p>
        <button
          type="button"
          data-demo-action="reset-inputs"
          className="border border-border bg-background px-2 py-1 font-mono text-xs hover:bg-muted"
          onClick={() => {
            setText("")
            setMulti("")
            setNum(undefined)
            setRange(undefined)
            setChecked(false)
            setSelected("mercator")
            setVisibility("none")
            setFont("")
            setFontStack([])
          }}
        >
          {demoLabels.reset}
        </button>
      </div>
      <div className="flex flex-col gap-3 border border-border p-3">
        <Row label="string">
          <InputString
            aria-label="string"
            value={text}
            onChange={(value) => setText(value ?? "")}
          />
        </Row>
        <Row label="string · multi">
          <InputString
            aria-label="multiline string"
            multi
            value={multi}
            onChange={(value) => setMulti(value ?? "")}
          />
        </Row>
        <Row label="number">
          <InputNumber aria-label="number" value={num} min={0} onChange={setNum} />
        </Row>
        <Row label="number · range">
          <NumberRangeInput
            aria-label="range"
            value={range}
            min={0}
            max={100}
            step={1}
            onChange={setRange}
          />
        </Row>
        <Row label="checkbox">
          <InputCheckbox value={checked} onChange={(value) => setChecked(Boolean(value))} />
        </Row>
        <Row label="select">
          <InputSelect value={selected} options={selectOptions} onChange={setSelected} />
        </Row>
        <Row label="enum · <=3">
          <InputEnum value={visibility} options={enumOptions} onChange={setVisibility} />
        </Row>
        <Row label="multiInput">
          <InputMultiInput value={visibility} options={enumOptions} onChange={setVisibility} />
        </Row>
        <Row label="autocomplete">
          <InputAutocomplete
            value={font}
            options={[["Open Sans Regular"], ["Arial Unicode MS Regular"], ["Roboto Mono"]]}
            onChange={(value) => setFont(value ?? "")}
          />
        </Row>
        <Row label="font · stack">
          <InputFont
            name="text-font"
            value={fontStack}
            fonts={[
              "Open Sans Regular",
              "Noto Sans Regular",
              "Roboto Mono",
              "Arial Unicode MS Regular",
            ]}
            onChange={setFontStack}
          />
        </Row>
      </div>
      <pre className="m-0 border border-border bg-muted/30 p-2 font-mono !text-[10px] !leading-4 !overflow-auto">
        {JSON.stringify(
          { text, multi, num, range, checked, selected, visibility, font, fontStack },
          null,
          2,
        )}
      </pre>
    </div>
  )
}
