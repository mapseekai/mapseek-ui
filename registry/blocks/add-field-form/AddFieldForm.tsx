import { useId } from "react"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import type { AddFieldFormProps } from "./types"

const fieldOptional = "text-[10px] text-muted-foreground"
const formInput = "h-7 w-full rounded-none border-border bg-background px-2 text-xs"

/**
 * Controlled "add attribute field" form body — no dialog chrome or footer.
 * The consumer wraps it (e.g. in a dialog) and owns the submit action.
 */
export function AddFieldForm({
  value,
  onChange,
  fieldTypes,
  labels,
  className,
}: AddFieldFormProps) {
  const set = (patch: Partial<typeof value>) => onChange({ ...value, ...patch })
  const selectedType = fieldTypes.find((t) => t.id === value.type)
  const id = useId()
  const nameId = `${id}-name`
  const enumId = `${id}-enum`
  const defaultId = `${id}-default`
  const descId = `${id}-desc`
  const nullableId = useId()

  return (
    <FieldGroup className={cn("gap-3", className)}>
      <Field className="gap-1.5">
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor={nameId} className="text-[11px] uppercase tracking-[0.06em]">
            {labels.nameLabel}
          </FieldLabel>
          <span className={fieldOptional}>{labels.nameRequiredHint}</span>
        </div>
        <Input
          id={nameId}
          className={cn(formInput, "font-mono")}
          placeholder={labels.namePlaceholder}
          value={value.name}
          onChange={(e) => set({ name: e.target.value })}
        />
        <FieldDescription>{labels.nameHint}</FieldDescription>
      </Field>

      <FieldSet className="gap-1.5">
        <FieldLegend variant="label" className="mb-0 text-[11px] uppercase tracking-[0.06em]">
          {labels.typeLabel}
        </FieldLegend>
        <ToggleGroup
          aria-label={labels.typeLabel}
          value={[value.type]}
          onValueChange={([type]) => {
            if (type) set({ type })
          }}
          size="sm"
          spacing={1}
          className="grid w-full grid-cols-5"
        >
          {fieldTypes.map((t) => {
            const TypeIcon = t.icon
            return (
              <ToggleGroupItem
                key={t.id}
                value={t.id}
                className="h-14 w-full flex-col gap-1 px-1 py-1.5 text-[11px] leading-none"
              >
                <TypeIcon />
                <span className="font-medium">{t.label}</span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      </FieldSet>

      {selectedType?.hasOptions && (
        <Field className="gap-1.5">
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor={enumId} className="text-[11px] uppercase tracking-[0.06em]">
              {labels.enumLabel}
            </FieldLabel>
            <span className={fieldOptional}>{labels.enumOptionalHint}</span>
          </div>
          <Input
            id={enumId}
            className={cn(formInput, "font-mono")}
            placeholder={labels.enumPlaceholder}
            value={value.enumValues}
            onChange={(e) => set({ enumValues: e.target.value })}
          />
        </Field>
      )}

      <Field className="gap-1.5">
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor={defaultId} className="text-[11px] uppercase tracking-[0.06em]">
            {labels.defaultLabel}
          </FieldLabel>
          <span className={fieldOptional}>{labels.defaultOptionalHint}</span>
        </div>
        <Input
          id={defaultId}
          className={cn(formInput, "font-mono")}
          placeholder={selectedType?.defaultPlaceholder ?? "—"}
          value={value.defaultVal}
          onChange={(e) => set({ defaultVal: e.target.value })}
        />
      </Field>

      <Field orientation="horizontal" className="items-center gap-2">
        <Checkbox
          id={nullableId}
          checked={value.nullable}
          onCheckedChange={(c) => set({ nullable: c === true })}
        />
        <FieldLabel
          htmlFor={nullableId}
          className="cursor-pointer text-xs font-medium leading-none"
        >
          {labels.nullableLabel}
        </FieldLabel>
        <FieldDescription className="leading-none">{labels.nullableHint}</FieldDescription>
      </Field>

      <Field className="gap-1.5">
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor={descId} className="text-[11px] uppercase tracking-[0.06em]">
            {labels.descLabel}
          </FieldLabel>
          <span className={fieldOptional}>{labels.descOptionalHint}</span>
        </div>
        <Input
          id={descId}
          className={formInput}
          placeholder={labels.descPlaceholder}
          value={value.desc}
          onChange={(e) => set({ desc: e.target.value })}
        />
      </Field>
    </FieldGroup>
  )
}
