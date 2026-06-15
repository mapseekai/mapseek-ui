import { IconLock } from "@tabler/icons-react"
import { Input } from "../../components/input"
import { Select } from "../../components/select"
import { Tooltip } from "../../components/tooltip"
import { cn } from "../../lib/utils"
import { inferAttrFieldKind } from "./infer-hint"
import type { AttrFieldKind, AttrFieldMeta } from "./types"

const inputBase = "h-7 w-full rounded-none border-border bg-background px-2 text-xs"

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
      <span className="border border-border bg-muted px-1 py-px font-mono text-[9px] uppercase tracking-[0.04em] text-muted-foreground">
        {badge}
      </span>
      {readOnly && <span className="flex-1" />}
      {readOnly && (
        <Tooltip content={primaryKeyLabel}>
          <IconLock size={11} className="text-muted-foreground" />
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
        <Select
          value={strVal}
          onValueChange={(val) => onChange(name, val)}
          className={cn(inputBase, "font-normal")}
        >
          {meta!.enumOptions!.map((o) => (
            <Select.Item key={o} value={o}>
              {o}
            </Select.Item>
          ))}
        </Select>
      ) : kind === "date" ? (
        <Input
          type="date"
          className={cn(inputBase, "font-mono")}
          value={dateValue}
          onChange={(e) => onChange(name, e.target.value)}
        />
      ) : kind === "number" ? (
        <div className="relative">
          <Input
            type="number"
            className={cn(inputBase, "font-mono tabular-nums")}
            value={strVal}
            onChange={(e) => onChange(name, e.target.value)}
          />
          {unit && (
            <span className="absolute top-1/2 right-2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground">
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
