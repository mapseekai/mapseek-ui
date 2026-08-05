import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { SchemaFormField, SchemaFormProps } from "./types"

function nextMulti(current: unknown, value: string): string[] {
  const cur = Array.isArray(current) ? (current as string[]) : []
  return cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]
}

/**
 * Schema-driven form body: renders a list of fields (number / text / select /
 * multiselect) as labelled controls. Uncontrolled-with-seed — the caller owns
 * `values` (seed via `seedSchemaFormValues`) and validates via
 * `isSchemaFormValid`. No Dialog/engine/i18n. See BLOCKS-EXTRACTION.md § SchemaForm.
 */
export function SchemaForm({
  fields,
  values,
  onChange,
  idPrefix = "field",
  className,
}: SchemaFormProps) {
  return (
    <FieldGroup className={cn("gap-3", className)}>
      {fields.map((f: SchemaFormField) => {
        const id = `${idPrefix}-${f.key}`
        const label = (
          <>
            {f.label}
            {f.required && <span className="text-destructive"> *</span>}
          </>
        )

        if (f.type === "multiselect") {
          return (
            <FieldSet key={f.key} className="gap-2">
              <FieldLegend variant="label" className="mb-0 text-xs">
                {label}
              </FieldLegend>
              <FieldGroup className="max-h-[140px] gap-0 overflow-auto border border-border bg-background py-1">
                {f.options.length === 0 ? (
                  <FieldDescription className="px-2 py-1.5">{f.emptyHint}</FieldDescription>
                ) : (
                  f.options.map((o) => {
                    const optionId = `${id}-${o.value}`
                    const checked =
                      Array.isArray(values[f.key]) && (values[f.key] as string[]).includes(o.value)
                    return (
                      <Field
                        key={o.value}
                        orientation="horizontal"
                        className="h-7 items-center gap-2 px-2 hover:bg-muted"
                      >
                        <Checkbox
                          id={optionId}
                          checked={checked}
                          onCheckedChange={() => onChange(f.key, nextMulti(values[f.key], o.value))}
                        />
                        <FieldLabel
                          htmlFor={optionId}
                          className="cursor-pointer text-xs font-normal"
                        >
                          {o.label}
                        </FieldLabel>
                      </Field>
                    )
                  })
                )}
              </FieldGroup>
            </FieldSet>
          )
        }

        return (
          <Field key={f.key} className="gap-1.5">
            <FieldLabel htmlFor={id} className="text-xs">
              {label}
            </FieldLabel>
            {f.type === "number" && (
              <Input
                id={id}
                type="number"
                aria-label={f.label}
                min={f.min}
                max={f.max}
                defaultValue={typeof f.default === "number" ? f.default : ""}
                onChange={(e) =>
                  onChange(f.key, e.target.value === "" ? undefined : Number(e.target.value))
                }
              />
            )}

            {f.type === "text" && (
              <Input
                id={id}
                type="text"
                aria-label={f.label}
                placeholder={f.placeholder}
                defaultValue={f.default ?? ""}
                onChange={(e) => onChange(f.key, e.target.value || undefined)}
              />
            )}

            {f.type === "select" && (
              <Select
                defaultValue={f.default}
                onValueChange={(v) => onChange(f.key, v || undefined)}
              >
                <SelectTrigger id={id} aria-label={f.label}>
                  <SelectValue placeholder={f.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {f.options.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </Field>
        )
      })}
    </FieldGroup>
  )
}
