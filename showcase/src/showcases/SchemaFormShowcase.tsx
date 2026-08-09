import {
  isSchemaFormValid,
  SchemaForm,
  type SchemaFormField,
  seedSchemaFormValues,
} from "@registry/blocks/schema-form"
import { Button } from "@registry/ui/button"
import { Checkbox } from "@registry/ui/checkbox"
import { useMemo, useState } from "react"
import type { LocalizedDemoProps } from "./types"

type SchemaFormDemoLabels = {
  readonly intro: string
  readonly valid: string
  readonly invalid: string
  readonly emptyOptions: string
  readonly toggleEmptyOptions: string
  readonly radiusError: string
  readonly targetsError: string
  readonly reset: string
  readonly fields: SchemaFormField[]
}

const labels = {
  "zh-CN": {
    intro: "schema 驱动表单。调用方播种 values、保存变化，并用 isSchemaFormValid 驱动提交按钮。",
    valid: "valid",
    invalid: "invalid",
    emptyOptions: "暂无选项",
    toggleEmptyOptions: "切换为空选项",
    radiusError: "输入 0 或更大的缓冲半径。",
    targetsError: "至少选择 2 个图层。",
    reset: "重置",
    fields: [
      { key: "radius", label: "缓冲半径", required: true, type: "number", min: 0 },
      {
        key: "method",
        label: "算法",
        type: "select",
        default: "dp",
        emptyHint: "暂无选项",
        options: [
          { value: "dp", label: "Douglas-Peucker" },
          { value: "visvalingam", label: "Visvalingam" },
        ],
      },
      { key: "crs", label: "目标 CRS", type: "text", placeholder: "EPSG:3857 / proj4 / WKT…" },
      {
        key: "targets",
        label: "要合并的图层",
        required: true,
        type: "multiselect",
        min: 2,
        options: [
          { value: "roads", label: "roads" },
          { value: "rivers", label: "rivers" },
          { value: "parcels", label: "parcels" },
        ],
      },
    ],
  } satisfies SchemaFormDemoLabels,
  en: {
    intro:
      "Schema-driven form. The caller seeds values, stores changes, and uses isSchemaFormValid for submit state.",
    valid: "valid",
    invalid: "invalid",
    emptyOptions: "No options",
    toggleEmptyOptions: "Toggle empty options",
    radiusError: "Enter a buffer radius of 0 or greater.",
    targetsError: "Select at least 2 layers.",
    reset: "Reset",
    fields: [
      { key: "radius", label: "Buffer radius", required: true, type: "number", min: 0 },
      {
        key: "method",
        label: "Algorithm",
        type: "select",
        default: "dp",
        emptyHint: "No options",
        options: [
          { value: "dp", label: "Douglas-Peucker" },
          { value: "visvalingam", label: "Visvalingam" },
        ],
      },
      { key: "crs", label: "Target CRS", type: "text", placeholder: "EPSG:3857 / proj4 / WKT…" },
      {
        key: "targets",
        label: "Layers to merge",
        required: true,
        type: "multiselect",
        min: 2,
        options: [
          { value: "roads", label: "roads" },
          { value: "rivers", label: "rivers" },
          { value: "parcels", label: "parcels" },
        ],
      },
    ],
  } satisfies SchemaFormDemoLabels,
}

export function SchemaFormDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [emptyOptions, setEmptyOptions] = useState(false)
  const fields = useMemo<SchemaFormField[]>(
    () =>
      demoLabels.fields.map((field) =>
        (field.type === "select" || field.type === "multiselect") && emptyOptions
          ? { ...field, options: [] }
          : field,
      ),
    [emptyOptions, demoLabels.fields],
  )
  const [values, setValues] = useState<Record<string, unknown>>(() => seedSchemaFormValues(fields))
  const radius = values.radius
  const targets = values.targets
  const errors = {
    radius:
      typeof radius === "number" && Number.isFinite(radius) && radius >= 0
        ? undefined
        : demoLabels.radiusError,
    targets: Array.isArray(targets) && targets.length >= 2 ? undefined : demoLabels.targetsError,
  }
  const valid = isSchemaFormValid(fields, values)

  return (
    <div className="flex w-full max-w-[460px] flex-col gap-4">
      <p className="m-0 text-xs text-muted-foreground">{demoLabels.intro}</p>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="schema-form-empty-options" className="flex items-center gap-2 text-xs">
          <Checkbox
            id="schema-form-empty-options"
            checked={emptyOptions}
            onCheckedChange={(checked) => {
              setEmptyOptions(checked === true)
              setValues(seedSchemaFormValues(fields))
            }}
          />
          {demoLabels.toggleEmptyOptions}
        </label>
        <Button
          type="button"
          data-demo-action="reset-schema"
          variant="outline"
          size="xs"
          onClick={() => setValues(seedSchemaFormValues(fields))}
        >
          {demoLabels.reset}
        </Button>
      </div>
      <div className="border border-border p-3">
        <SchemaForm
          fields={fields}
          values={values}
          onChange={(key, value) => setValues((current) => ({ ...current, [key]: value }))}
          errors={errors}
          labels={{ emptyOptions: demoLabels.emptyOptions }}
        />
      </div>
      <span
        data-demo-status="schema-validity"
        role="status"
        aria-live="polite"
        className={[
          "w-fit border px-2 py-1 font-mono text-xs",
          valid
            ? "border-primary/25 bg-primary/10 text-primary"
            : "border-border bg-muted text-muted-foreground",
        ].join(" ")}
      >
        {valid ? demoLabels.valid : demoLabels.invalid}
      </span>
      <pre className="overflow-auto border border-border bg-muted/30 p-2 font-mono !text-xs !leading-4">
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  )
}
