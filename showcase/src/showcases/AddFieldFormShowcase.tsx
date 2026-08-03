import {
  AddFieldForm,
  type AddFieldFormLabels,
  type AddFieldValue,
  EMPTY_ADD_FIELD,
  type FieldTypeOption,
} from "@registry/blocks/add-field-form"
import {
  IconCalendar,
  IconHash,
  IconLetterCase,
  IconListCheck,
  IconToggleLeft,
} from "@tabler/icons-react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const fieldTypes: FieldTypeOption[] = [
  { id: "text", label: "Text", icon: IconLetterCase },
  { id: "number", label: "Number", icon: IconHash, defaultPlaceholder: "0" },
  { id: "date", label: "Date", icon: IconCalendar, defaultPlaceholder: "Today" },
  { id: "enum", label: "Enum", icon: IconListCheck, hasOptions: true },
  { id: "bool", label: "Bool", icon: IconToggleLeft, defaultPlaceholder: "false" },
]

const labels = {
  "zh-CN": {
    intro: "受控字段表单。选择枚举类型会显示枚举值输入，默认值占位符随类型变化。",
    reset: "重置",
    valid: "可提交",
    invalid: "字段名必填",
    form: {
      nameLabel: "字段名",
      nameRequiredHint: "必填 · 小写 · 下划线",
      namePlaceholder: "例如 build_year",
      nameHint: "用作 schema key，提交后不可更改",
      typeLabel: "字段类型",
      enumLabel: "枚举值",
      enumOptionalHint: "逗号分隔",
      enumPlaceholder: "例如 居住,商业,工业,绿地",
      defaultLabel: "默认值",
      defaultOptionalHint: "可选",
      nullableLabel: "允许为空",
      nullableHint: "nullable",
      descLabel: "说明",
      descOptionalHint: "可选 · 显示在属性面板",
      descPlaceholder: "该字段的用途...",
    },
  },
  en: {
    intro:
      "Controlled field form. Choosing Enum reveals option input and the default placeholder follows the selected type.",
    reset: "Reset",
    valid: "Ready to submit",
    invalid: "Field name is required",
    form: {
      nameLabel: "Field name",
      nameRequiredHint: "Required · lowercase · underscores",
      namePlaceholder: "e.g. build_year",
      nameHint: "Used as the schema key and fixed after creation.",
      typeLabel: "Field type",
      enumLabel: "Enum values",
      enumOptionalHint: "Comma separated",
      enumPlaceholder: "e.g. residential,commercial,industrial,park",
      defaultLabel: "Default value",
      defaultOptionalHint: "Optional",
      nullableLabel: "Allow null",
      nullableHint: "nullable",
      descLabel: "Description",
      descOptionalHint: "Optional · shown in inspectors",
      descPlaceholder: "What this field is for...",
    },
  },
}

export function AddFieldFormDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [value, setValue] = useState<AddFieldValue>({ ...EMPTY_ADD_FIELD, type: "text" })
  const isValid = value.name.trim().length > 0

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs text-muted-foreground">{demoLabels.intro}</p>
        <button
          type="button"
          className="border border-border bg-background px-2 py-1 font-mono text-xs hover:bg-muted"
          onClick={() => setValue({ ...EMPTY_ADD_FIELD, type: "text" })}
        >
          {demoLabels.reset}
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="min-w-0 border border-border bg-card p-3.5">
          <AddFieldForm
            value={value}
            onChange={setValue}
            fieldTypes={fieldTypes}
            labels={demoLabels.form}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <span
            data-demo-status="validation"
            className={[
              "w-fit border px-2 py-1 font-mono text-xs",
              isValid
                ? "border-primary/25 bg-primary/10 text-primary"
                : "border-destructive/30 bg-destructive/10 text-destructive",
            ].join(" ")}
          >
            {isValid ? demoLabels.valid : demoLabels.invalid}
          </span>
          <pre className="max-h-[300px] min-w-0 overflow-auto border border-border bg-muted/30 p-2 font-mono text-[11px] leading-[1.5]">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
