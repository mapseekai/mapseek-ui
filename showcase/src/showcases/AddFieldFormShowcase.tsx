import {
  AddFieldForm,
  type AddFieldValue,
  EMPTY_ADD_FIELD,
  type FieldTypeOption,
} from "@registry/blocks/add-field-form"
import { Button } from "@registry/ui/button"
import {
  IconCalendar,
  IconHash,
  IconLetterCase,
  IconMathFunction,
  IconToggleLeft,
} from "@tabler/icons-react"
import { useState } from "react"
import type { DemoLocale, LocalizedDemoProps } from "./types"

const fieldTypes: Record<DemoLocale, FieldTypeOption[]> = {
  "zh-CN": [
    { id: "text", label: "文字", icon: IconLetterCase },
    { id: "integer", label: "整型", icon: IconHash },
    { id: "float", label: "浮点型", icon: IconMathFunction },
    { id: "boolean", label: "布尔", icon: IconToggleLeft },
    { id: "date", label: "日期", icon: IconCalendar },
  ],
  en: [
    { id: "text", label: "Text", icon: IconLetterCase },
    { id: "integer", label: "Integer", icon: IconHash },
    { id: "float", label: "Float", icon: IconMathFunction },
    { id: "boolean", label: "Boolean", icon: IconToggleLeft },
    { id: "date", label: "Date", icon: IconCalendar },
  ],
}

const labels = {
  "zh-CN": {
    intro: "受控字段表单。默认值控件会随文字、整型、浮点型、布尔和日期字段类型切换。",
    reset: "重置",
    valid: "可提交",
    invalid: "字段名必填",
    form: {
      nameLabel: "字段名",
      namePlaceholder: "例如 build_year",
      typeLabel: "字段类型",
      defaultLabel: "默认值",
      booleanTrueLabel: "是",
      booleanFalseLabel: "否",
      nullableLabel: "允许为空",
      descLabel: "说明",
      descPlaceholder: "该字段的用途...",
    },
  },
  en: {
    intro:
      "Controlled field form. The default-value control changes with text, integer, float, boolean, and date types.",
    reset: "Reset",
    valid: "Ready to submit",
    invalid: "Field name is required",
    form: {
      nameLabel: "Field name",
      namePlaceholder: "e.g. build_year",
      typeLabel: "Field type",
      defaultLabel: "Default value",
      booleanTrueLabel: "Yes",
      booleanFalseLabel: "No",
      nullableLabel: "Allow null",
      descLabel: "Description",
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
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={() => setValue({ ...EMPTY_ADD_FIELD, type: "text" })}
        >
          {demoLabels.reset}
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="min-w-0 border border-border bg-card p-3.5">
          <AddFieldForm
            value={value}
            onChange={setValue}
            fieldTypes={fieldTypes[locale]}
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
          <pre className="m-0 max-h-[300px] min-w-0 overflow-auto border border-border bg-muted/30 p-2 font-mono !text-[10px] !leading-4">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
