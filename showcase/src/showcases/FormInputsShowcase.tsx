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
import { Button } from "@registry/ui/button"
import { Field, FieldContent, FieldGroup, FieldLabel, FieldTitle } from "@registry/ui/field"
import type { ReactNode } from "react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

function Row({
  label,
  children,
  htmlFor,
  labelId,
}: {
  readonly label: string
  readonly children: ReactNode
  readonly htmlFor?: string
  readonly labelId?: string
}) {
  return (
    <Field className="grid grid-cols-1 gap-2 sm:grid-cols-[130px_minmax(0,1fr)] sm:items-center sm:gap-3">
      {htmlFor ? (
        <FieldLabel id={labelId} htmlFor={htmlFor}>
          {label}
        </FieldLabel>
      ) : (
        <FieldTitle id={labelId}>{label}</FieldTitle>
      )}
      <FieldContent className="min-w-0">{children}</FieldContent>
    </Field>
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
    string: "字符串",
    multiline: "多行字符串",
    number: "数字",
    range: "数字范围",
    checkbox: "复选框",
    select: "选择",
    enum: "短枚举",
    multiInput: "内联选项",
    autocomplete: "自动补全",
    fontStack: "字体栈",
    selectPlaceholder: "选择选项…",
    noResults: "没有匹配结果。",
  },
  en: {
    intro:
      "Commit-on-blur inputs; short enums use inline choices and longer sets use select/autocomplete.",
    reset: "Reset values",
    string: "String",
    multiline: "Multiline string",
    number: "Number",
    range: "Number range",
    checkbox: "Checkbox",
    select: "Select",
    enum: "Short enum",
    multiInput: "Inline options",
    autocomplete: "Autocomplete",
    fontStack: "Font stack",
    selectPlaceholder: "Select an option…",
    noResults: "No matching results.",
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
        <Button
          type="button"
          data-demo-action="reset-inputs"
          variant="outline"
          size="xs"
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
        </Button>
      </div>
      <FieldGroup className="gap-3 border border-border p-3">
        <Row label={demoLabels.string} htmlFor="form-inputs-string">
          <InputString
            id="form-inputs-string"
            value={text}
            onChange={(value) => setText(value ?? "")}
          />
        </Row>
        <Row label={demoLabels.multiline} htmlFor="form-inputs-multiline">
          <InputString
            id="form-inputs-multiline"
            multi
            value={multi}
            onChange={(value) => setMulti(value ?? "")}
          />
        </Row>
        <Row label={demoLabels.number} htmlFor="form-inputs-number">
          <InputNumber id="form-inputs-number" value={num} min={0} onChange={setNum} />
        </Row>
        <Row label={demoLabels.range} labelId="form-inputs-range-label">
          <NumberRangeInput
            aria-label={demoLabels.range}
            value={range}
            min={0}
            max={100}
            step={1}
            onChange={setRange}
          />
        </Row>
        <Row label={demoLabels.checkbox} htmlFor="form-inputs-checkbox">
          <InputCheckbox
            id="form-inputs-checkbox"
            value={checked}
            onChange={(value) => setChecked(Boolean(value))}
          />
        </Row>
        <Row label={demoLabels.select} htmlFor="form-inputs-select">
          <InputSelect
            id="form-inputs-select"
            value={selected}
            options={selectOptions}
            placeholder={demoLabels.selectPlaceholder}
            onChange={setSelected}
          />
        </Row>
        <Row label={demoLabels.enum} labelId="form-inputs-enum-label">
          <InputEnum
            id="form-inputs-enum"
            aria-labelledby="form-inputs-enum-label"
            value={visibility}
            options={enumOptions}
            onChange={setVisibility}
          />
        </Row>
        <Row label={demoLabels.multiInput} labelId="form-inputs-multi-input-label">
          <InputMultiInput
            id="form-inputs-multi-input"
            aria-labelledby="form-inputs-multi-input-label"
            value={visibility}
            options={enumOptions}
            onChange={setVisibility}
          />
        </Row>
        <Row label={demoLabels.autocomplete} htmlFor="form-inputs-autocomplete">
          <InputAutocomplete
            id="form-inputs-autocomplete"
            value={font}
            options={[["Open Sans Regular"], ["Arial Unicode MS Regular"], ["Roboto Mono"]]}
            emptyMessage={demoLabels.noResults}
            onChange={(value) => setFont(value ?? "")}
          />
        </Row>
        <Row label={demoLabels.fontStack} labelId="form-inputs-font-stack-label">
          <InputFont
            id="form-inputs-font-stack"
            name="text-font"
            aria-label={demoLabels.fontStack}
            aria-labelledby="form-inputs-font-stack-label"
            value={fontStack}
            fonts={[
              "Open Sans Regular",
              "Noto Sans Regular",
              "Roboto Mono",
              "Arial Unicode MS Regular",
            ]}
            emptyMessage={demoLabels.noResults}
            onChange={setFontStack}
          />
        </Row>
      </FieldGroup>
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
