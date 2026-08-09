import { IconCalendar, IconLock } from "@tabler/icons-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
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
import { Tag } from "@/components/ui/tag"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { inferAttrFieldKind } from "./infer-hint"
import type { AttrFieldKind, AttrFieldMeta } from "./types"

const inputBase = "w-full rounded-none border-input bg-input-surface px-2.5 text-body-md"

type Resolved = {
  kind: AttrFieldKind
  isEnum: boolean
  readOnly: boolean
  unit?: string
  badge: string
}

function resolve(name: string, value: unknown, meta?: AttrFieldMeta): Resolved {
  const kind = meta?.kind ?? inferAttrFieldKind(name, value)
  const isEnum = !!meta?.enumOptions?.length
  const readOnly = meta?.readOnly ?? kind === "id"
  const unit = meta?.unit ?? (/_m2$/i.test(name) ? "m²" : undefined)
  const badge = isEnum
    ? "ENUM"
    : kind === "id"
      ? "ID"
      : kind === "date"
        ? "DATE"
        : kind === "number"
          ? "NUMBER"
          : "TEXT"
  return { kind, isEnum, readOnly, unit, badge }
}

function formatReadValue(kind: AttrFieldKind, value: unknown): string {
  if (value == null || value === "") return "—"
  if (kind === "date" && typeof value === "string") {
    return value.replace(/\//g, "-").slice(0, 10)
  }
  return String(value)
}

function toInputNumberValue(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value !== "string" || value.trim() === "") return null

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

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

function DateEditField({
  name,
  value,
  onChange,
}: {
  name: string
  value: string
  onChange: (key: string, value: unknown) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedDate = parseDateValue(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="default"
            aria-label={name}
            className={cn(inputBase, "justify-between font-mono font-normal")}
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
            onChange(name, formatDateValue(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function FieldHeader({
  name,
  badge,
  readOnly,
  primaryKeyLabel,
}: {
  name: string
  badge: string
  readOnly: boolean
  primaryKeyLabel: string
}) {
  return (
    <div className="mb-1 flex items-center gap-1.5">
      <span className="font-mono text-label-md uppercase text-muted-foreground">{name}</span>
      <Tag color="gray" size="sm">
        {badge}
      </Tag>
      {readOnly && <span className="flex-1" />}
      {readOnly && (
        <Tooltip>
          <TooltipTrigger
            render={
              <IconLock aria-label={primaryKeyLabel} size={11} className="text-muted-foreground" />
            }
          />
          <TooltipContent>{primaryKeyLabel}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

export function ReadField({
  name,
  value,
  meta,
  primaryKeyLabel,
}: {
  name: string
  value: unknown
  meta?: AttrFieldMeta
  primaryKeyLabel: string
}) {
  const { kind, readOnly, unit, badge } = resolve(name, value, meta)
  const mono = kind !== "text"
  const readValue = formatReadValue(kind, value)
  const readInputClassName = cn(mono && "font-mono tabular-nums")
  return (
    <div>
      <FieldHeader
        name={name}
        badge={badge}
        readOnly={readOnly}
        primaryKeyLabel={primaryKeyLabel}
      />
      {unit && value != null && value !== "" ? (
        <InputGroup>
          <InputGroupInput
            aria-label={name}
            className={readInputClassName}
            disabled
            value={readValue}
          />
          <InputGroupAddon align="inline-end" disabled>
            <InputGroupText className="font-mono">{unit}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <Input aria-label={name} className={readInputClassName} disabled value={readValue} />
      )}
    </div>
  )
}

export function EditField({
  name,
  value,
  meta,
  primaryKeyLabel,
  onChange,
}: {
  name: string
  value: unknown
  meta?: AttrFieldMeta
  primaryKeyLabel: string
  onChange: (key: string, value: unknown) => void
}) {
  const { kind, isEnum, readOnly, unit, badge } = resolve(name, value, meta)
  const strVal = String(value ?? "")
  const enumOptions = meta?.enumOptions ?? []
  const dateValue =
    kind === "date" && typeof value === "string" ? value.replace(/\//g, "-").slice(0, 10) : ""

  return (
    <div>
      <FieldHeader
        name={name}
        badge={badge}
        readOnly={readOnly}
        primaryKeyLabel={primaryKeyLabel}
      />
      {readOnly ? (
        <Input
          aria-label={name}
          className={cn(inputBase, "font-mono text-muted-foreground")}
          value={strVal}
          disabled
        />
      ) : isEnum ? (
        <Select value={strVal} onValueChange={(val) => onChange(name, val)}>
          <SelectTrigger aria-label={name} className={cn(inputBase, "font-normal")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {enumOptions.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : kind === "date" ? (
        <DateEditField name={name} value={dateValue} onChange={onChange} />
      ) : kind === "number" ? (
        <InputNumber
          aria-label={name}
          className="font-mono tabular-nums"
          unit={unit}
          value={toInputNumberValue(value)}
          onValueChange={(next) => onChange(name, next)}
        />
      ) : kind === "code" ? (
        <Input
          aria-label={name}
          className={cn(inputBase, "font-mono uppercase tracking-[0.04em]")}
          value={strVal}
          maxLength={8}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <Input
          aria-label={name}
          className={inputBase}
          value={strVal}
          onChange={(e) => onChange(name, e.target.value)}
        />
      )}
    </div>
  )
}
