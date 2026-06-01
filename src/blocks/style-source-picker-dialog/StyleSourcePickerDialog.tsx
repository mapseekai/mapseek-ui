import { type ReactNode, useMemo, useState } from "react"
import {
  IconCheck,
  IconDatabase,
  IconLayersIntersect,
  IconSearch,
} from "@tabler/icons-react"

import { Badge } from "../../components/badge"
import { Button } from "../../components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "../../components/dialog"
import { Input } from "../../components/input"
import { cn } from "../../lib/utils"
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
  description:
    "Select one or more datasets/tilesets to add into active sources.",
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
  labels: Partial<StyleSourcePickerLabels> | undefined
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
  const [draft, setDraft] = useState<StyleSourcePickerDraft>(
    getDefaultStyleSourcePickerDraft
  )
  const labels = useMemo(() => resolveLabels(labelsProp), [labelsProp])

  const resetLocalState = () => {
    setDraft(getDefaultStyleSourcePickerDraft())
  }

  const filteredOptions = useMemo(() => {
    return filterStyleSourcePickerOptions(
      options,
      draft.keyword,
      draft.sourceFilter,
      draft.typeFilter
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

  const selectedKeySet = useMemo(
    () => new Set(draft.selectedKeys),
    [draft.selectedKeys]
  )

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
        className="flex max-h-[86vh] flex-col gap-0 overflow-hidden p-0"
        width="56rem"
      >
        <div className="space-y-3 border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative min-w-0 flex-1">
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

            <SegmentedFilter
              ariaLabel={String(labels.sourceFilterLabel)}
              value={draft.sourceFilter}
              options={[
                ["ALL", labels.all],
                ["DATASET", labels.dataset],
                ["TILESET", labels.tileset],
              ]}
              onChange={(value) =>
                setDraft((prev) => ({
                  ...prev,
                  sourceFilter: value as StyleSourcePickerFilter,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
              {labels.description}
            </DialogDescription>
            <SegmentedFilter
              ariaLabel={String(labels.typeFilterLabel)}
              value={draft.typeFilter}
              options={[
                ["ALL", labels.allTypes],
                ["vector", labels.vector],
                ["raster", labels.raster],
              ]}
              onChange={(value) =>
                setDraft((prev) => ({
                  ...prev,
                  typeFilter: value as StyleSourcePickerTypeFilter,
                }))
              }
            />
          </div>
        </div>

        {confirmErrorMessage ? (
          <p className="border-b bg-destructive/5 px-5 py-2 text-xs text-destructive">
            {confirmErrorMessage}
          </p>
        ) : null}

        <div className="min-h-0 flex-1 overflow-auto bg-muted/20 p-5">
          {loadErrorMessage && !loading ? (
            <div className="flex flex-col items-start gap-3 border border-destructive/25 bg-background p-4">
              <p className="text-sm text-destructive">{loadErrorMessage}</p>
              {onRetryLoad ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRetryLoad}
                >
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
                    alreadyAddedKeys
                  ),
                }))
              }
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t bg-background px-5 py-3">
          <p className="text-xs text-muted-foreground">
            {labels.selectedCount(selectedOptions.length)}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
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

type SegmentedFilterProps = {
  ariaLabel: string
  value: string
  options: readonly (readonly [string, ReactNode])[]
  onChange: (value: string) => void
}

function SegmentedFilter({
  ariaLabel,
  value,
  options,
  onChange,
}: SegmentedFilterProps) {
  return (
    <div
      className="inline-flex h-8 shrink-0 items-center border border-border bg-muted/50 p-0.5"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map(([optionValue, label]) => {
        const active = value === optionValue
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={cn(
              "h-7 px-3 text-xs font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

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
    return <p className="text-sm text-muted-foreground">{labels.loading}</p>
  }

  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">{labels.empty}</p>
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {options.map((item) => {
        const selected = selectedKeys.has(item.key)
        const alreadyAdded = alreadyAddedKeys.has(item.key)
        const kindLabel =
          item.sourceKind === "DATASET" ? labels.dataset : labels.tileset
        const typeLabel =
          item.sourceType === "raster" ? labels.raster : labels.vector

        return (
          <button
            key={item.key}
            type="button"
            disabled={alreadyAdded}
            onClick={() => onToggle(item.key)}
            aria-pressed={selected}
            className={cn(
              "group flex min-h-32 w-full flex-col border bg-background p-3 text-left transition-colors",
              selected
                ? "border-primary bg-primary/5 shadow-[inset_0_0_0_1px_var(--color-primary)]"
                : "border-border hover:border-primary/50 hover:bg-muted/40",
              alreadyAdded && "cursor-not-allowed opacity-55"
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center border",
                  item.sourceKind === "DATASET"
                    ? "border-cat-2/30 bg-cat-2/10 text-cat-2"
                    : "border-cat-5/30 bg-cat-5/10 text-cat-5"
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
                <p className="truncate text-sm leading-tight font-semibold">
                  {item.sourceName}
                </p>
                <p
                  className="mt-1 truncate font-mono text-[11px] leading-tight text-muted-foreground"
                  title={item.subtitle || item.sourceUID}
                >
                  {item.subtitle || item.sourceUID}
                </p>
              </div>
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center border transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background group-hover:border-foreground/30"
                )}
                aria-hidden
              >
                {selected ? <IconCheck size={12} stroke={3} /> : null}
              </span>
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
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
                <Badge variant="outline">{typeLabel}</Badge>
              ) : null}
              {item.status ? (
                <Badge variant="secondary">{item.status}</Badge>
              ) : null}
              {alreadyAdded ? (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/15 font-semibold text-amber-700 dark:text-amber-400"
                >
                  {labels.alreadyAdded}
                </Badge>
              ) : null}
            </div>
          </button>
        )
      })}
    </div>
  )
}
