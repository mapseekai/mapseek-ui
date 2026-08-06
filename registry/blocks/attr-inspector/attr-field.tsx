import { IconCalendar, IconLock } from "@tabler/icons-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { inferAttrFieldKind } from "./infer-hint"
import type { AttrFieldKind, AttrFieldMeta } from "./types"

const inputBase = "w-full rounded-none border-border bg-background px-2 text-xs"

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
    <div className="mb-[3px] flex items-center gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.04em] text-muted-foreground">
        {name}
      </span>
      <span className="border border-border bg-muted px-1 py-px font-mono text-[10px] uppercase tracking-[0.04em] text-muted-foreground">
        {badge}
      </span>
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
  return (
    <div>
      <FieldHeader
        name={name}
        badge={badge}
        readOnly={readOnly}
        primaryKeyLabel={primaryKeyLabel}
      />
      <div
        className={cn(
          "min-h-7 w-full border border-border bg-muted/40 px-2 py-1 text-xs break-words",
          mono && "font-mono tabular-nums",
        )}
      >
        {formatReadValue(kind, value)}
        {unit && value != null && value !== "" && (
          <span className="ml-1 text-muted-foreground">{unit}</span>
        )}
      </div>
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
          className={cn(inputBase, "bg-muted font-mono text-muted-foreground")}
          value={strVal}
          readOnly
        />
      ) : isEnum ? (
        <Select value={strVal} onValueChange={(val) => onChange(name, val)}>
          <SelectTrigger className={cn(inputBase, "font-normal")}>
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
        <div className="group relative">
          <Input
            type="number"
            className={cn(inputBase, "font-mono tabular-nums")}
            value={strVal}
            onChange={(e) => onChange(name, e.target.value)}
          />
          {unit && (
            <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground group-focus-within:hidden">
              {unit}
            </span>
          )}
        </div>
      ) : kind === "code" ? (
        <Input
          className={cn(inputBase, "font-mono uppercase tracking-[0.04em]")}
          value={strVal}
          maxLength={8}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : (
        <Input
          className={inputBase}
          value={strVal}
          onChange={(e) => onChange(name, e.target.value)}
        />
      )}
    </div>
  )
}
