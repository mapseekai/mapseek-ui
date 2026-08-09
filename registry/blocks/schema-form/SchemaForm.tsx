import { type ReactNode, useId } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  Field,
  FieldError,
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
import { SCHEMA_FORM_LABELS_EN } from "./labels"
import type { SchemaFormField, SchemaFormProps } from "./types"

function nextMulti(current: unknown, value: string): string[] {
  const cur = Array.isArray(current) ? (current as string[]) : []
  return cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]
}

function EmptyOptions({ children }: { children: ReactNode }) {
  return (
    <Empty className="min-h-0 gap-0 p-3">
      <EmptyHeader>
        <EmptyTitle>{children}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  )
}

/**
 * Schema-driven form body: renders a list of fields (number / text / select /
 * multiselect) as labelled controlled controls. The caller owns `values`
 * (seed via `seedSchemaFormValues`) and validates via `isSchemaFormValid`.
 * No Dialog/engine/i18n. See BLOCKS-EXTRACTION.md § SchemaForm.
 */
export function SchemaForm({
  fields,
  values,
  onChange,
  errors,
  labels = SCHEMA_FORM_LABELS_EN,
  idPrefix,
  className,
}: SchemaFormProps) {
  const generatedId = useId()
  const resolvedIdPrefix = idPrefix ?? generatedId

  return (
    <FieldGroup className={cn("gap-3", className)}>
      {fields.map((f: SchemaFormField) => {
        const id = `${resolvedIdPrefix}-${f.key}`
        const error = errors?.[f.key]
        const invalid = Boolean(error)
        const errorId = `${id}-error`
        const describedBy = invalid ? errorId : undefined
        const name = f.name ?? f.key

        if (f.type === "multiselect") {
          return (
            <FieldSet
              key={f.key}
              data-invalid={invalid || undefined}
              aria-required={f.required || f.min !== undefined || undefined}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              className="gap-2"
            >
              <FieldLegend required={f.required} variant="label" className="mb-0 text-body-md">
                {f.label}
              </FieldLegend>
              <FieldGroup className="max-h-[140px] gap-0 overflow-auto border border-border bg-background py-1">
                {f.options.length === 0 ? (
                  <EmptyOptions>{f.emptyHint ?? labels.emptyOptions}</EmptyOptions>
                ) : (
                  f.options.map((o) => {
                    const optionId = `${id}-${o.value}`
                    const checked =
                      Array.isArray(values[f.key]) && (values[f.key] as string[]).includes(o.value)
                    return (
                      <Field
                        key={o.value}
                        orientation="horizontal"
                        className="h-7 items-center gap-2 px-2 py-1.5 hover:bg-accent/50"
                      >
                        <Checkbox
                          id={optionId}
                          name={name}
                          value={o.value}
                          checked={checked}
                          aria-invalid={invalid || undefined}
                          aria-describedby={describedBy}
                          onCheckedChange={() => onChange(f.key, nextMulti(values[f.key], o.value))}
                        />
                        <FieldLabel htmlFor={optionId} className="cursor-pointer text-body-md">
                          {o.label}
                        </FieldLabel>
                      </Field>
                    )
                  })
                )}
              </FieldGroup>
              <FieldError id={errorId}>{error}</FieldError>
            </FieldSet>
          )
        }

        const currentValue = values[f.key]

        return (
          <Field key={f.key} data-invalid={invalid || undefined} className="gap-1.5">
            <FieldLabel required={f.required} htmlFor={id} className="text-body-md">
              {f.label}
            </FieldLabel>
            {f.type === "number" && (
              <Input
                id={id}
                name={name}
                type="number"
                aria-label={f.label}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                autoComplete={f.autoComplete ?? "off"}
                required={f.required}
                min={f.min}
                max={f.max}
                value={
                  typeof currentValue === "number" && Number.isFinite(currentValue)
                    ? currentValue
                    : ""
                }
                onChange={(e) =>
                  onChange(f.key, e.target.value === "" ? undefined : Number(e.target.value))
                }
              />
            )}

            {f.type === "text" && (
              <Input
                id={id}
                name={name}
                type="text"
                aria-label={f.label}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                autoComplete={f.autoComplete ?? "off"}
                required={f.required}
                spellCheck={f.spellCheck}
                placeholder={f.placeholder}
                value={typeof currentValue === "string" ? currentValue : ""}
                onChange={(e) => onChange(f.key, e.target.value || undefined)}
              />
            )}

            {f.type === "select" && (
              <Select
                items={f.options}
                value={
                  typeof currentValue === "string" && currentValue !== "" ? currentValue : null
                }
                name={name}
                required={f.required}
                onValueChange={(value) => onChange(f.key, value ?? undefined)}
              >
                <SelectTrigger
                  id={id}
                  aria-label={f.label}
                  aria-required={f.required || undefined}
                  aria-invalid={invalid || undefined}
                  aria-describedby={describedBy}
                >
                  <SelectValue placeholder={f.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {f.options.length === 0 ? (
                    <EmptyOptions>{f.emptyHint ?? labels.emptyOptions}</EmptyOptions>
                  ) : (
                    <SelectGroup>
                      {f.options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            )}
            <FieldError id={errorId}>{error}</FieldError>
          </Field>
        )
      })}
    </FieldGroup>
  )
}
