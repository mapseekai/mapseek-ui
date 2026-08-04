import { useId } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { AddFieldFormProps } from "./types"

const fieldLabel =
  "text-[11px] font-medium uppercase leading-[14px] tracking-[0.06em] text-muted-foreground"
const fieldOptional = "text-[10px] text-muted-foreground"
const fieldHint = "text-[11px] leading-[1.4] text-muted-foreground"
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
  const nullableId = useId()

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className={fieldLabel}>{labels.nameLabel}</span>
          <span className={fieldOptional}>{labels.nameRequiredHint}</span>
        </div>
        <Input
          className={cn(formInput, "font-mono")}
          placeholder={labels.namePlaceholder}
          value={value.name}
          onChange={(e) => set({ name: e.target.value })}
        />
        <div className={fieldHint}>{labels.nameHint}</div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={fieldLabel}>{labels.typeLabel}</span>
        <div className="grid grid-cols-5 gap-1">
          {fieldTypes.map((t) => {
            const isCur = value.type === t.id
            const TypeIcon = t.icon
            return (
              <Button
                variant="ghost"
                size="sm"
                key={t.id}
                type="button"
                onClick={() => set({ type: t.id })}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 rounded-none border px-1 py-1.5 transition-colors",
                  isCur
                    ? "border-border border-b-2 border-b-primary bg-selection-bg text-primary"
                    : "border-border bg-background text-foreground hover:bg-muted",
                )}
              >
                <TypeIcon size={16} />
                <span className="text-[11px] font-medium leading-none">{t.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {selectedType?.hasOptions && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className={fieldLabel}>{labels.enumLabel}</span>
            <span className={fieldOptional}>{labels.enumOptionalHint}</span>
          </div>
          <Input
            className={cn(formInput, "font-mono")}
            placeholder={labels.enumPlaceholder}
            value={value.enumValues}
            onChange={(e) => set({ enumValues: e.target.value })}
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className={fieldLabel}>{labels.defaultLabel}</span>
          <span className={fieldOptional}>{labels.defaultOptionalHint}</span>
        </div>
        <Input
          className={cn(formInput, "font-mono")}
          placeholder={selectedType?.defaultPlaceholder ?? "—"}
          value={value.defaultVal}
          onChange={(e) => set({ defaultVal: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id={nullableId}
          checked={value.nullable}
          onCheckedChange={(c) => set({ nullable: c === true })}
        />
        <label htmlFor={nullableId} className="cursor-pointer text-xs font-medium leading-none">
          {labels.nullableLabel}
        </label>
        <span className="text-[11px] leading-none text-muted-foreground">
          {labels.nullableHint}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className={fieldLabel}>{labels.descLabel}</span>
          <span className={fieldOptional}>{labels.descOptionalHint}</span>
        </div>
        <Input
          className={formInput}
          placeholder={labels.descPlaceholder}
          value={value.desc}
          onChange={(e) => set({ desc: e.target.value })}
        />
      </div>
    </div>
  )
}
