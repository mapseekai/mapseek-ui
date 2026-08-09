import { IconCircleFilled, IconScissors } from "@tabler/icons-react"
import type { CSSProperties } from "react"
import { PlaceholderGlyph } from "@/components/blocks/placeholder-glyph"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { DEFAULT_RESOURCE_GRID_LABELS } from "./defaults"
import type {
  FontFamilyKind,
  ResourceFontItem,
  ResourceGridProps,
  ResourceIconItem,
  ResourceSpriteItem,
  ResourceStatus,
} from "./types"

// Transparent checkerboard behind sprite previews. References only design
// tokens (no literal colors), so it stays theme-correct.
const CHECKER: CSSProperties = {
  background:
    "repeating-conic-gradient(var(--background) 0% 25%, color-mix(in oklch, var(--muted-foreground) 6%, transparent) 0% 50%) 50% / 8px 8px",
}

function fontClass(family: FontFamilyKind): string {
  return family === "mono" ? "font-mono" : "font-sans"
}

function StatusBadge({ status }: { status: ResourceStatus }) {
  if (status.variant === "published")
    return (
      <Badge>
        <IconCircleFilled aria-hidden="true" size={7} />
        {status.label}
      </Badge>
    )
  if (status.variant === "sliced")
    return (
      <Badge variant="outline">
        <IconScissors aria-hidden="true" size={9} stroke={1.75} />
        {status.label}
      </Badge>
    )
  return <Badge variant="outline">{status.label}</Badge>
}

export function dispatchKeyboardContextMenu(event: React.KeyboardEvent<HTMLButtonElement>) {
  const isContextMenuKey = event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")
  if (!isContextMenuKey) return

  event.preventDefault()
  const bounds = event.currentTarget.getBoundingClientRect()
  event.currentTarget.dispatchEvent(
    new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      button: 2,
      clientX: bounds.left + bounds.width / 2,
      clientY: bounds.top + bounds.height / 2,
    }),
  )
}

/**
 * The resource-library card area. Renders one of three layouts based on `tab`:
 * a dense icon grid, sprite-sheet cards, or font specimen cards. Pure view —
 * data is pre-shaped (meta strings already localized) and interactions are
 * delegated via `onOpen` / `onContextMenu`.
 */
export function ResourceGrid({
  tab,
  items,
  onOpen,
  onContextMenu,
  selectedIconIds,
  onIconSelect,
  iconSelectionLabel,
  empty,
  className,
  labels,
  renderIconPreview,
  renderSpritePreview,
}: ResourceGridProps) {
  const resolvedLabels = resolveLabels(DEFAULT_RESOURCE_GRID_LABELS, labels)
  if (items.length === 0 && empty) {
    return <div className={cn("p-4", className)}>{empty}</div>
  }

  if (tab === "icon") {
    return (
      <div
        data-testid="resource-icon-grid"
        className={cn(
          "grid w-full min-w-0 grid-cols-[repeat(auto-fill,minmax(96px,1fr))] border-t border-l border-border",
          className,
        )}
      >
        {(items as ResourceIconItem[]).map((it) => {
          const selectable = Boolean(onIconSelect)
          const selected = selectedIconIds?.has(it.id) ?? false

          return (
            <div
              key={it.id}
              data-testid="resource-icon-card"
              data-selected={selected}
              className={cn(
                "group relative isolate aspect-square min-w-0 border-r border-b border-border bg-background ring-inset transition-colors motion-reduce:transition-none before:pointer-events-none before:absolute before:inset-0 before:-z-10 hover:before:bg-primary/5 hover:ring-1 hover:ring-primary focus-within:ring-1 focus-within:ring-primary",
                selected && "before:bg-primary/5 ring-1 ring-primary",
              )}
            >
              {selectable && (
                <span className="absolute top-2 start-2 z-10">
                  <Checkbox
                    checked={selected}
                    aria-label={iconSelectionLabel?.(it) ?? it.name}
                    className={cn(
                      "bg-background opacity-100 transition-opacity motion-reduce:transition-none pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 group-focus-within:opacity-100",
                      selected && "pointer-fine:opacity-100",
                    )}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    onCheckedChange={(checked) => onIconSelect?.(it.id, checked === true)}
                  />
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="flex size-full cursor-pointer flex-col items-center justify-center gap-1.5 border-0 bg-transparent p-2.5 text-center [font:inherit] hover:bg-transparent"
                onClick={() => onOpen("icon", it.id)}
                onContextMenu={(e) => onContextMenu(e, "icon", it.id)}
                onKeyDown={dispatchKeyboardContextMenu}
              >
                {renderIconPreview?.(it) ?? <PlaceholderGlyph size={28} seed={it.seed} />}
                <div className="w-full min-w-0 truncate text-center text-body-sm-medium text-foreground">
                  {it.name}
                </div>
                {it.categoryLabel && (
                  <div className="max-w-full truncate font-mono text-label-md text-muted-foreground uppercase">
                    {it.categoryLabel}
                  </div>
                )}
              </Button>
            </div>
          )
        })}
      </div>
    )
  }

  if (tab === "sprite") {
    return (
      <div className={cn("grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3", className)}>
        {(items as ResourceSpriteItem[]).map((s) => (
          <ResourceCard
            key={s.id}
            onOpen={() => onOpen("sprite", s.id)}
            onContextMenu={(e) => onContextMenu(e, "sprite", s.id)}
            thumbClassName="h-[90px] p-0"
            thumb={
              renderSpritePreview?.(s) ?? (
                <div className="grid grid-cols-4 border border-border" style={CHECKER}>
                  {s.previewSeeds.slice(0, 8).map((seed) => (
                    <div key={seed} className="grid size-7 place-items-center">
                      <PlaceholderGlyph size={16} seed={seed} />
                    </div>
                  ))}
                </div>
              )
            }
            title={
              <span className="min-w-0 truncate font-mono text-body-lg-medium" title={s.name}>
                {s.name}
              </span>
            }
            status={s.status}
            meta={s.metaParts}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3", className)}>
      {(items as ResourceFontItem[]).map((f) => (
        <ResourceCard
          key={f.id}
          onOpen={() => onOpen("font", f.id)}
          onContextMenu={(e) => onContextMenu(e, "font", f.id)}
          thumbClassName={cn(
            "min-h-[120px] text-data-display text-foreground",
            fontClass(f.family),
          )}
          thumb={<span>{resolvedLabels.fontSpecimen}</span>}
          title={
            <span className="min-w-0 truncate text-body-lg-medium" title={f.name}>
              {f.name}
            </span>
          }
          status={f.status}
          meta={f.metaParts}
        />
      ))}
    </div>
  )
}

function ResourceCard({
  thumb,
  thumbClassName,
  title,
  status,
  meta,
  onOpen,
  onContextMenu,
}: {
  thumb: React.ReactNode
  thumbClassName?: string
  title: React.ReactNode
  status: ResourceStatus
  meta: string[]
  onOpen: () => void
  onContextMenu: (e: React.MouseEvent) => void
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      className="flex h-auto w-full min-w-0 cursor-pointer flex-col items-stretch overflow-hidden border border-border bg-background p-0 text-start transition-[background-color,border-color,color] motion-reduce:transition-none hover:border-primary hover:bg-primary/5"
      onClick={onOpen}
      onContextMenu={onContextMenu}
      onKeyDown={dispatchKeyboardContextMenu}
    >
      <div
        data-testid="resource-card-thumb"
        className={cn(
          "flex items-center justify-center border-b border-border bg-muted p-[18px]",
          thumbClassName,
        )}
      >
        {thumb}
      </div>
      <div className="flex min-w-0 flex-col gap-1 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2 text-body-lg">
          {title}
          <StatusBadge status={status} />
        </div>
        <div className="flex min-w-0 items-center gap-1.5 overflow-hidden font-mono text-body-sm text-muted-foreground">
          {meta.map((part, i) => (
            <span key={part} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden="true" className="shrink-0 opacity-50">
                  ·
                </span>
              )}
              <span className="truncate" title={part}>
                {part}
              </span>
            </span>
          ))}
        </div>
      </div>
    </Button>
  )
}
