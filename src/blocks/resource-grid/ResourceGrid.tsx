import { IconCircleFilled, IconScissors } from "@tabler/icons-react"
import type { CSSProperties } from "react"
import { Badge } from "../../components/badge"
import { Checkbox } from "../../components/checkbox"
import { cn } from "../../lib/utils"
import { PlaceholderGlyph } from "../placeholder-glyph"
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
  renderIconPreview,
  renderSpritePreview,
}: ResourceGridProps) {
  if (items.length === 0 && empty) {
    return <div className={cn("p-4", className)}>{empty}</div>
  }

  if (tab === "icon") {
    return (
      <div
        className={cn(
          "grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-px border border-border bg-border",
          className,
        )}
      >
        {(items as ResourceIconItem[]).map((it) => {
          const selectable = Boolean(onIconSelect)
          const selected = selectedIconIds?.has(it.id) ?? false

          return (
            <div
              key={it.id}
              data-selected={selected}
              className={cn(
                "group relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 p-2.5 ring-inset transition-colors hover:ring-1 hover:ring-primary focus-within:ring-1 focus-within:ring-primary",
                selected
                  ? "bg-primary/5 ring-1 ring-primary hover:bg-primary/5"
                  : "bg-background hover:bg-muted",
              )}
              onClick={() => onOpen("icon", it.id)}
              onContextMenu={(e) => onContextMenu(e, "icon", it.id)}
            >
              {selectable && (
                <span className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected}
                    aria-label={iconSelectionLabel?.(it) ?? it.name}
                    className={cn(
                      "bg-background transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
                      selected ? "opacity-100" : "opacity-0",
                    )}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={(checked) => onIconSelect?.(it.id, checked === true)}
                  />
                </span>
              )}
              {renderIconPreview?.(it) ?? <PlaceholderGlyph size={28} seed={it.seed} />}
              <div className="w-full truncate text-center text-[10.5px] font-medium text-foreground">
                {it.name}
              </div>
              {it.categoryLabel && (
                <div className="font-mono text-[9.5px] tracking-[0.04em] text-muted-foreground uppercase">
                  {it.categoryLabel}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  if (tab === "sprite") {
    return (
      <div className={cn("grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3", className)}>
        {(items as ResourceSpriteItem[]).map((s) => (
          <ResourceCard
            key={s.id}
            onOpen={() => onOpen("sprite", s.id)}
            onContextMenu={(e) => onContextMenu(e, "sprite", s.id)}
            thumb={
              renderSpritePreview?.(s) ?? (
                <div className="grid grid-cols-4 border border-border" style={CHECKER}>
                  {s.previewSeeds.slice(0, 8).map((seed, i) => (
                    <div key={i} className="grid size-7 place-items-center">
                      <PlaceholderGlyph size={16} seed={seed} />
                    </div>
                  ))}
                </div>
              )
            }
            title={<span className="font-mono text-[12.5px] font-medium">{s.name}</span>}
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
            "text-[42px] leading-none font-semibold tracking-[-0.02em] text-foreground",
            fontClass(f.family),
          )}
          thumb={<span>Aa 永</span>}
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
    <div
      className="flex cursor-pointer flex-col border border-border bg-background transition-all hover:border-primary"
      onClick={onOpen}
      onContextMenu={onContextMenu}
    >
      <div
        className={cn(
          "flex min-h-[120px] items-center justify-center border-b border-border bg-muted p-[18px]",
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
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="opacity-50">·</span>}
              {part}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
