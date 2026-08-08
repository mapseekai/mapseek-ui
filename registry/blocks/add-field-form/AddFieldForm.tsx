import { IconCalendar } from "@tabler/icons-react"
import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputNumber } from "@/components/ui/input-number"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import type { AddFieldFormProps, AddFieldType } from "./types"

const formInput = "w-full rounded-none border-input bg-input-surface px-2.5 text-body-md"

function parseDateValue(value: string): Date | undefined {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined

  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : undefined
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function defaultValueForType(type: AddFieldType) {
  if (type === "boolean") return false
  if (type === "date") return formatDateValue(new Date())
  return null
}

function DateDefaultInput({
  id,
  labelledBy,
  value,
  onValueChange,
}: {
  id: string
  labelledBy: string
  value: string
  onValueChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedDate = parseDateValue(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-labelledby={labelledBy}
            className={cn(formInput, "justify-between font-mono font-normal")}
          >
            <span>{value || "—"}</span>
            <IconCalendar data-icon="inline-end" />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          required
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={(date) => {
            onValueChange(formatDateValue(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

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
  const id = useId()
  const nameId = `${id}-name`
  const defaultId = `${id}-default`
  const defaultLabelId = `${defaultId}-label`
  const descId = `${id}-desc`
  const nullableId = useId()
  const numericDefaultValue = typeof value.defaultVal === "number" ? value.defaultVal : null
  const textDefaultValue = typeof value.defaultVal === "string" ? value.defaultVal : ""
  const dateDefaultValue =
    value.type === "date" && !parseDateValue(textDefaultValue)
      ? formatDateValue(new Date())
      : textDefaultValue
  const booleanDefaultValue = value.defaultVal === true ? "true" : "false"
  const booleanDefaultOptions = [
    { label: labels.booleanTrueLabel, value: "true" },
    { label: labels.booleanFalseLabel, value: "false" },
  ]

  return (
    <FieldGroup className={cn("gap-3", className)}>
      <Field className="gap-1.5">
        <FieldLabel required htmlFor={nameId} className="font-medium">
          {labels.nameLabel}
        </FieldLabel>
        <Input
          id={nameId}
          name="field-name"
          autoComplete="off"
          spellCheck={false}
          required
          className={cn(formInput, "font-mono")}
          placeholder={labels.namePlaceholder}
          value={value.name}
          onChange={(e) => set({ name: e.target.value })}
        />
      </Field>

      <FieldSet className="gap-1.5">
        <FieldLegend variant="label" className="mb-0">
          {labels.typeLabel}
        </FieldLegend>
        <ToggleGroup
          aria-label={labels.typeLabel}
          value={[value.type]}
          onValueChange={([type]) => {
            const nextType = fieldTypes.find((fieldType) => fieldType.id === type)
            if (nextType) {
              set({ type: nextType.id, defaultVal: defaultValueForType(nextType.id) })
            }
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
                className="h-14 w-full flex-col gap-1 px-1 py-1.5 text-body-sm leading-none"
              >
                <TypeIcon />
                <span className="font-medium">{t.label}</span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      </FieldSet>

      <Field className="gap-1.5">
        <FieldLabel
          id={defaultLabelId}
          htmlFor={value.type === "integer" || value.type === "float" ? undefined : defaultId}
          className="font-medium"
        >
          {labels.defaultLabel}
        </FieldLabel>
        {value.type === "integer" || value.type === "float" ? (
          <InputNumber
            aria-labelledby={defaultLabelId}
            className="font-mono tabular-nums"
            placeholder={value.type === "integer" ? "0" : "0.0"}
            step={value.type === "integer" ? 1 : 0.1}
            value={numericDefaultValue}
            onValueChange={(defaultVal) => set({ defaultVal })}
          />
        ) : value.type === "boolean" ? (
          <Select
            items={booleanDefaultOptions}
            value={booleanDefaultValue}
            onValueChange={(defaultVal) => {
              set({ defaultVal: defaultVal === "true" })
            }}
          >
            <SelectTrigger id={defaultId} aria-labelledby={defaultLabelId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {booleanDefaultOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : value.type === "date" ? (
          <DateDefaultInput
            id={defaultId}
            labelledBy={defaultLabelId}
            value={dateDefaultValue}
            onValueChange={(defaultVal) => set({ defaultVal })}
          />
        ) : (
          <Input
            id={defaultId}
            type="text"
            className={cn(formInput, "font-mono")}
            placeholder="—"
            value={textDefaultValue}
            onChange={(e) => set({ defaultVal: e.target.value })}
          />
        )}
      </Field>

      <Field orientation="horizontal" className="items-center gap-2">
        <Checkbox
          id={nullableId}
          checked={value.nullable}
          onCheckedChange={(c) => set({ nullable: c === true })}
        />
        <FieldLabel htmlFor={nullableId} className="cursor-pointer font-medium leading-none">
          {labels.nullableLabel}
        </FieldLabel>
      </Field>

      <Field className="gap-1.5">
        <FieldLabel htmlFor={descId} className="font-medium">
          {labels.descLabel}
        </FieldLabel>
        <Textarea
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
