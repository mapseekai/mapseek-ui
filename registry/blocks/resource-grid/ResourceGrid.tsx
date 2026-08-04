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
        <IconCircleFilled size={7} />
        {status.label}
      </Badge>
    )
  if (status.variant === "sliced")
    return (
      <Badge variant="outline">
        <IconScissors size={9} stroke={1.75} />
        {status.label}
      </Badge>
    )
  return <Badge variant="outline">{status.label}</Badge>
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
          "grid w-full min-w-0 grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-px border border-border bg-border",
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
                "group relative isolate aspect-square min-w-0 bg-background ring-inset transition-colors before:pointer-events-none before:absolute before:inset-0 before:-z-10 hover:before:bg-primary/5 hover:ring-1 hover:ring-primary focus-within:ring-1 focus-within:ring-primary",
                selected && "before:bg-primary/5 ring-1 ring-primary",
              )}
            >
              {selectable && (
                <span className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selected}
                    aria-label={iconSelectionLabel?.(it) ?? it.name}
                    className={cn(
                      "bg-background transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
                      selected ? "opacity-100" : "opacity-0",
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
              >
                {renderIconPreview?.(it) ?? <PlaceholderGlyph size={28} seed={it.seed} />}
                <div className="w-full min-w-0 truncate text-center text-[11px] font-medium text-foreground">
                  {it.name}
                </div>
                {it.categoryLabel && (
                  <div className="max-w-full truncate font-mono text-[9.5px] tracking-[0.04em] text-muted-foreground uppercase">
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
            title={<span className="font-mono text-[13px] font-medium">{s.name}</span>}
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
            "min-h-[120px] text-[42px] leading-none font-semibold tracking-[-0.02em] text-foreground",
            fontClass(f.family),
          )}
          thumb={<span>{resolvedLabels.fontSpecimen}</span>}
          title={<span className="font-semibold">{f.name}</span>}
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
      className="flex h-auto w-full cursor-pointer flex-col items-stretch overflow-hidden border border-border bg-background p-0 text-left transition-all hover:border-primary"
      onClick={onOpen}
      onContextMenu={onContextMenu}
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
      <div className="flex flex-col gap-1 px-3 py-2.5">
        <div className="flex items-center gap-2 text-[13px]">
          {title}
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          {meta.map((part, i) => (
            <span key={part} className="flex items-center gap-1.5">
              {i > 0 && <span className="opacity-50">·</span>}
              {part}
            </span>
          ))}
        </div>
      </div>
    </Button>
  )
}
