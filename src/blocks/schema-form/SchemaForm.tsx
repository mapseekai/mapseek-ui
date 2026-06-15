import { Checkbox } from "../../components/checkbox"
import { Input } from "../../components/input"
import { Label } from "../../components/label"
import { Select } from "../../components/select"
import { cn } from "../../lib/utils"
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
    <div className={cn("flex flex-col gap-3", className)}>
      {fields.map((f: SchemaFormField) => {
        const id = `${idPrefix}-${f.key}`
        return (
          <div key={f.key} className="flex flex-col gap-1.5">
            <Label htmlFor={id} className="text-xs">
              {f.label}
              {f.required && <span className="text-destructive"> *</span>}
            </Label>

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
                aria-label={f.label}
                defaultValue={f.default}
                placeholder={f.placeholder}
                onValueChange={(v) => onChange(f.key, v || undefined)}
              >
                {f.options.map((o) => (
                  <Select.Item key={o.value} value={o.value}>
                    {o.label}
                  </Select.Item>
                ))}
              </Select>
            )}

            {f.type === "multiselect" && (
              <div className="max-h-[140px] overflow-auto border border-border bg-background">
                {f.options.length === 0 ? (
                  <p className="px-2 py-1.5 text-[11px] text-muted-foreground">{f.emptyHint}</p>
                ) : (
                  f.options.map((o) => {
                    const checked =
                      Array.isArray(values[f.key]) && (values[f.key] as string[]).includes(o.value)
                    return (
                      <label
                        key={o.value}
                        className="flex h-7 cursor-pointer items-center gap-2 px-2 hover:bg-muted"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => onChange(f.key, nextMulti(values[f.key], o.value))}
                        />
                        <span className="text-xs">{o.label}</span>
                      </label>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
