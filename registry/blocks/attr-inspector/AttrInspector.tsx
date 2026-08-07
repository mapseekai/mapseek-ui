import {
  IconBraces,
  IconColumnInsertRight,
  IconInfoSquareRounded,
  IconTrash,
  IconX,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { EditField, ReadField } from "./attr-field"
import type { AttrFieldMeta, AttrInspectorProps } from "./types"

const actionBtn = "h-6 gap-1.5 rounded-none px-2.5 text-body-sm"

/**
 * Floating attribute panel for a single picked feature, decoupled from any
 * map engine. Renders only the bordered card body — the consumer positions
 * it via `className`. Sizes to content (no inner scrollbar by default).
 */
export function AttrInspector({
  feature,
  mode = "edit",
  fields,
  draft,
  onFieldChange,
  error,
  labels,
  onAddField,
  onDelete,
  onViewGeoJSON,
  onConfirm,
  onCancel,
  onClose,
  className,
}: AttrInspectorProps) {
  if (!feature) return null

  const isEdit = mode === "edit"
  const metaByName: Record<string, AttrFieldMeta> = Object.fromEntries(
    (fields ?? []).map((f) => [f.name, f]),
  )
  const values: Record<string, unknown> = isEdit
    ? { ...feature.properties, ...(draft ?? {}) }
    : feature.properties

  const showDelete = isEdit && !!onDelete
  const showGeoJSON = !!onViewGeoJSON
  const showConfirm = isEdit && (!!onConfirm || !!onCancel)
  const showFooter = showDelete || showGeoJSON || showConfirm

  return (
    <div
      data-testid="attr-inspector"
      data-mode={mode}
      className={cn("flex flex-col border border-border bg-card", className)}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center border-b border-border">
        <div className="flex flex-1 items-center gap-1.5 px-3 py-2.5">
          <IconInfoSquareRounded size={13} className="text-primary" />
          <span className="text-body-md-medium">{labels.title}</span>
        </div>
        {onClose && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="mr-1 size-8 rounded-none text-muted-foreground"
                >
                  <IconX />
                </Button>
              }
            />
            <TooltipContent>{labels.close}</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col">
        <div className="px-3 py-2.5">
          <div className="flex flex-col gap-2">
            {Object.keys(feature.properties).map((k) =>
              isEdit ? (
                <EditField
                  key={k}
                  name={k}
                  value={values[k]}
                  meta={metaByName[k]}
                  primaryKeyLabel={labels.primaryKey}
                  onChange={onFieldChange ?? (() => {})}
                />
              ) : (
                <ReadField
                  key={k}
                  name={k}
                  value={values[k]}
                  meta={metaByName[k]}
                  primaryKeyLabel={labels.primaryKey}
                />
              ),
            )}
          </div>
          {error && <p className="mt-2 text-body-md text-destructive">{error}</p>}
          {isEdit && onAddField && (
            <Button
              variant="ghost"
              onClick={onAddField}
              className="mt-2.5 h-6 w-full justify-start gap-1.5 rounded-none px-2.5 text-body-sm"
            >
              <IconColumnInsertRight data-icon="inline-start" /> {labels.addField}
            </Button>
          )}
        </div>

        {showFooter && (
          <div className="flex gap-1.5 border-t border-border px-2.5 py-2">
            {showDelete && (
              <Button variant="ghost" onClick={onDelete} className={actionBtn}>
                <IconTrash data-icon="inline-start" /> {labels.delete}
              </Button>
            )}
            {showGeoJSON && (
              <Button variant="ghost" onClick={onViewGeoJSON} className={actionBtn}>
                <IconBraces data-icon="inline-start" /> {labels.viewGeoJSON}
              </Button>
            )}
            {showConfirm && (
              <>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="h-6 rounded-none px-2.5 text-body-sm"
                >
                  {labels.cancel}
                </Button>
                <Button onClick={onConfirm} className="h-6 rounded-none px-2.5 text-body-sm">
                  {labels.confirm}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
