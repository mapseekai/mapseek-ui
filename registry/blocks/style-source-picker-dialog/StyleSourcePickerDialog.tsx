import { IconCheck, IconDatabase, IconLayersIntersect, IconSearch } from "@tabler/icons-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import type {
  StyleSourcePickerDialogProps,
  StyleSourcePickerDraft,
  StyleSourcePickerFilter,
  StyleSourcePickerLabels,
  StyleSourcePickerOption,
  StyleSourcePickerTypeFilter,
} from "./types"
import {
  filterStyleSourcePickerOptions,
  getDefaultStyleSourcePickerDraft,
  toggleStyleSourcePickerSelection,
} from "./utils"

const DEFAULT_LABELS: StyleSourcePickerLabels = {
  title: "Add New Source",
  description: "Select one or more datasets/tilesets to add into active sources.",
  searchPlaceholder: "Search by name/path...",
  sourceFilterLabel: "Source",
  typeFilterLabel: "Type",
  all: "All",
  dataset: "Dataset",
  tileset: "Tileset",
  allTypes: "All types",
  vector: "Vector",
  raster: "Raster",
  loading: "Loading sources...",
  empty: "No available sources.",
  retry: "Retry",
  selectedCount: (count) => `Selected ${count} source(s)`,
  cancel: "Cancel",
  confirm: "Confirm",
  confirming: "Confirming...",
  alreadyAdded: "Already Added",
}

function resolveLabels(
  labels: Partial<StyleSourcePickerLabels> | undefined,
): StyleSourcePickerLabels {
  return { ...DEFAULT_LABELS, ...labels }
}

export function StyleSourcePickerDialog({
  open,
  loading,
  options,
  alreadyAddedKeys,
  confirming,
  loadErrorMessage,
  confirmErrorMessage,
  labels: labelsProp,
  onRetryLoad,
  onOpenChange,
  onConfirm,
}: StyleSourcePickerDialogProps) {
  const [draft, setDraft] = useState<StyleSourcePickerDraft>(getDefaultStyleSourcePickerDraft)
  const labels = useMemo(() => resolveLabels(labelsProp), [labelsProp])

  const resetLocalState = () => {
    setDraft(getDefaultStyleSourcePickerDraft())
  }

  const filteredOptions = useMemo(() => {
    return filterStyleSourcePickerOptions(
      options,
      draft.keyword,
      draft.sourceFilter,
      draft.typeFilter,
    )
  }, [draft.keyword, draft.sourceFilter, draft.typeFilter, options])

  const selectedOptions = useMemo(() => {
    if (draft.selectedKeys.length === 0) {
      return []
    }

    const optionByKey = new Map(options.map((item) => [item.key, item]))
    return draft.selectedKeys
      .map((key) => optionByKey.get(key))
      .filter((item): item is StyleSourcePickerOption => !!item)
  }, [draft.selectedKeys, options])

  const selectedKeySet = useMemo(() => new Set(draft.selectedKeys), [draft.selectedKeys])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) {
          resetLocalState()
        }
      }}
    >
      <DialogContent
        title={labels.title}
        className="flex max-h-[86vh] flex-col gap-0 overflow-hidden p-0 shadow-none [&>[data-slot=dialog-close]]:top-3 [&>[data-slot=dialog-header]]:px-4 [&>[data-slot=dialog-header]]:py-4"
        width="56rem"
      >
        <div className="flex flex-col gap-3 border-b px-4 py-4">
          <div className="relative">
            <IconSearch
              size={14}
              stroke={1.75}
              className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={draft.keyword}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  keyword: event.target.value,
                }))
              }
              placeholder={labels.searchPlaceholder}
              className="pl-8"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ToggleGroup
              aria-label={String(labels.sourceFilterLabel)}
              variant="outline"
              size="sm"
              spacing={0}
              value={[draft.sourceFilter]}
              onValueChange={([value]) => {
                if (value) {
                  setDraft((prev) => ({
                    ...prev,
                    sourceFilter: value as StyleSourcePickerFilter,
                  }))
                }
              }}
            >
              <ToggleGroupItem value="ALL" className={selectedToggleClass}>
                {labels.all}
              </ToggleGroupItem>
              <ToggleGroupItem value="DATASET" className={selectedToggleClass}>
                {labels.dataset}
              </ToggleGroupItem>
              <ToggleGroupItem value="TILESET" className={selectedToggleClass}>
                {labels.tileset}
              </ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup
              aria-label={String(labels.typeFilterLabel)}
              variant="outline"
              size="sm"
              spacing={0}
              value={[draft.typeFilter]}
              onValueChange={([value]) => {
                if (value) {
                  setDraft((prev) => ({
                    ...prev,
                    typeFilter: value as StyleSourcePickerTypeFilter,
                  }))
                }
              }}
            >
              <ToggleGroupItem value="ALL" className={selectedToggleClass}>
                {labels.allTypes}
              </ToggleGroupItem>
              <ToggleGroupItem value="vector" className={selectedToggleClass}>
                {labels.vector}
              </ToggleGroupItem>
              <ToggleGroupItem value="raster" className={selectedToggleClass}>
                {labels.raster}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {confirmErrorMessage ? (
          <p className="border-b bg-destructive/5 px-4 py-2 text-body-md text-destructive">
            {confirmErrorMessage}
          </p>
        ) : null}

        <div className="min-h-0 flex-1 overscroll-contain overflow-auto bg-muted/20 p-4">
          {loadErrorMessage && !loading ? (
            <div className="flex flex-col items-start gap-3 border border-destructive/25 bg-background p-4">
              <p className="text-body-lg text-destructive">{loadErrorMessage}</p>
              {onRetryLoad ? (
                <Button type="button" variant="outline" size="sm" onClick={onRetryLoad}>
                  {labels.retry}
                </Button>
              ) : null}
            </div>
          ) : (
            <SourceOptionCardGrid
              labels={labels}
              loading={loading}
              options={filteredOptions}
              selectedKeys={selectedKeySet}
              alreadyAddedKeys={alreadyAddedKeys}
              onToggle={(key) =>
                setDraft((prev) => ({
                  ...prev,
                  selectedKeys: toggleStyleSourcePickerSelection(
                    prev.selectedKeys,
                    key,
                    alreadyAddedKeys,
                  ),
                }))
              }
            />
          )}
        </div>

        <div className="flex flex-col items-stretch gap-3 border-t bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-md text-muted-foreground">
            {labels.selectedCount(selectedOptions.length)}
          </p>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              {labels.cancel}
            </Button>
            <Button
              size="sm"
              disabled={selectedOptions.length === 0 || confirming}
              onClick={() => {
                if (selectedOptions.length > 0) {
                  onConfirm(selectedOptions)
                }
              }}
            >
              {confirming ? labels.confirming : labels.confirm}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const selectedToggleClass =
  "aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary aria-pressed:hover:text-primary-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground"

type SourceOptionRenderProps = {
  labels: StyleSourcePickerLabels
  loading: boolean
  options: StyleSourcePickerOption[]
  selectedKeys: Set<string>
  alreadyAddedKeys: Set<string>
  onToggle: (key: string) => void
}

function SourceOptionCardGrid({
  labels,
  loading,
  options,
  selectedKeys,
  alreadyAddedKeys,
  onToggle,
}: SourceOptionRenderProps) {
  if (loading) {
    return <p className="text-body-lg text-muted-foreground">{labels.loading}</p>
  }

  if (options.length === 0) {
    return <p className="text-body-lg text-muted-foreground">{labels.empty}</p>
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {options.map((item) => {
        const selected = selectedKeys.has(item.key)
        const alreadyAdded = alreadyAddedKeys.has(item.key)
        const kindLabel = item.sourceKind === "DATASET" ? labels.dataset : labels.tileset
        const typeLabel = item.sourceType === "raster" ? labels.raster : labels.vector
        const typeBadgeClass =
          item.sourceType === "raster"
            ? "border-cat-5/30 bg-cat-5/10 text-cat-5"
            : "border-cat-2/30 bg-cat-2/10 text-cat-2"

        return (
          <Button
            variant="ghost"
            size="sm"
            key={item.key}
            type="button"
            disabled={alreadyAdded}
            onClick={() => onToggle(item.key)}
            aria-pressed={selected}
            className={cn(
              "group flex min-h-32 w-full flex-col items-stretch justify-start border bg-background p-3 text-left transition-colors",
              selected
                ? "border-primary bg-primary/5 hover:border-primary hover:bg-primary/5"
                : "border-border hover:border-primary hover:bg-primary/5",
              alreadyAdded && "cursor-not-allowed opacity-55",
            )}
          >
            <div className="flex w-full items-start gap-3 text-left">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center border",
                  item.sourceKind === "DATASET"
                    ? "border-cat-2/30 bg-cat-2/10 text-cat-2"
                    : "border-cat-5/30 bg-cat-5/10 text-cat-5",
                )}
                aria-hidden
              >
                {item.sourceKind === "DATASET" ? (
                  <IconDatabase size={16} stroke={1.5} />
                ) : (
                  <IconLayersIntersect size={16} stroke={1.5} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-headline-sm leading-tight">{item.sourceName}</p>
                <p
                  className="mt-1 truncate font-mono text-body-sm leading-tight text-muted-foreground"
                  title={item.subtitle || item.sourceUID}
                >
                  {item.subtitle || item.sourceUID}
                </p>
              </div>
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center border transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background group-hover:border-foreground/30",
                )}
                aria-hidden
              >
                {selected ? <IconCheck size={10} stroke={3} /> : null}
              </span>
            </div>

            <div className="mt-auto flex w-full flex-wrap items-center justify-start gap-1.5 pt-4">
              <Badge
                variant="outline"
                className={
                  item.sourceKind === "DATASET"
                    ? "border-cat-2/30 bg-cat-2/10 text-cat-2"
                    : "border-cat-5/30 bg-cat-5/10 text-cat-5"
                }
              >
                {kindLabel}
              </Badge>
              {item.sourceType ? (
                <Badge variant="outline" className={typeBadgeClass}>
                  {typeLabel}
                </Badge>
              ) : null}
              {item.status ? (
                <Badge
                  variant="outline"
                  className={
                    item.status === "READY" ? "border-cat-1/40 bg-cat-1/15 text-cat-1" : undefined
                  }
                >
                  {item.status}
                </Badge>
              ) : null}
              {alreadyAdded ? (
                <Badge
                  variant="outline"
                  className="border-warning/40 bg-warning/15 font-semibold text-warning"
                >
                  {labels.alreadyAdded}
                </Badge>
              ) : null}
            </div>
          </Button>
        )
      })}
    </div>
  )
}
