import {
  IconFolder,
  IconGridDots,
  IconLayoutGrid,
  IconPencil,
  IconPhoto,
  IconPlus,
  IconStack2,
  IconTrash,
  IconTypography,
} from "@tabler/icons-react"
import { Button } from "../../components/button"
import { Tooltip } from "../../components/tooltip"
import { cn } from "../../lib/utils"
import type { ResourceSidebarProps, ResourceTab } from "./types"

const ICON_STROKE = 1.75

/**
 * Resource-library left rail: a two-level type nav (雪碧图 ⊃ 图标 / 雪碧图, and
 * a 字体 leaf) on top, then the category list for the active type with inline
 * rename / delete actions and a create-category footer. Pure view — all data,
 * counts, labels and handlers are injected.
 */
export function ResourceSidebar({
  tab,
  onTabChange,
  tabCounts,
  categories,
  totalCount,
  activeCat,
  onSelectCat,
  onRenameCategory,
  onRemoveCategory,
  onCreateCategory,
  labels,
  className,
}: ResourceSidebarProps) {
  const leafBase =
    "relative flex cursor-pointer items-center gap-2 text-[12.5px] text-foreground before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary before:opacity-0 hover:bg-muted"
  const activeLeaf = "bg-primary/10 text-primary before:opacity-100"

  function leafClass(active: boolean, extra: string) {
    return cn(leafBase, extra, active && activeLeaf)
  }

  return (
    <aside
      className={cn(
        "flex w-[220px] shrink-0 flex-col border-r border-border bg-background",
        className,
      )}
    >
      <div className="px-3.5 pt-3 pb-2 font-mono text-[10.5px] tracking-[0.06em] text-muted-foreground uppercase">
        {labels.typeSection}
      </div>

      <div className="px-1.5 pt-0.5">
        <div
          className={cn(
            "flex items-center gap-2 px-2.5 py-[7px] text-[12.5px] font-semibold",
            tab === "icon" || tab === "sprite"
              ? "text-primary [&_svg]:text-primary"
              : "text-foreground [&_svg]:text-muted-foreground",
          )}
        >
          <IconLayoutGrid size={12} stroke={ICON_STROKE} />
          <span>{labels.spriteGroup}</span>
        </div>

        <TypeRow
          active={tab === "icon"}
          className={leafClass(tab === "icon", "py-1.5 pr-2.5 pl-7")}
          icon={<IconPhoto size={12} stroke={ICON_STROKE} />}
          label={labels.icon}
          count={tabCounts.icon}
          onClick={() => onTabChange("icon")}
        />
        <TypeRow
          active={tab === "sprite"}
          className={leafClass(tab === "sprite", "py-1.5 pr-2.5 pl-7")}
          icon={<IconGridDots size={12} stroke={ICON_STROKE} />}
          label={labels.sprite}
          count={tabCounts.sprite}
          onClick={() => onTabChange("sprite")}
        />
        <TypeRow
          active={tab === "font"}
          className={leafClass(tab === "font", "px-2.5 py-[7px] font-semibold")}
          icon={<IconTypography size={12} stroke={ICON_STROKE} />}
          label={labels.font}
          count={tabCounts.font}
          onClick={() => onTabChange("font")}
        />
      </div>

      <div className="mx-2 my-1.5 h-px bg-border" />

      <div className="px-3.5 pt-1 pb-2 font-mono text-[10.5px] tracking-[0.06em] text-muted-foreground uppercase">
        {labels.categoriesSection}
      </div>

      <div className="flex-1 overflow-auto px-1.5">
        <CategoryRow
          active={activeCat === "all"}
          icon={<IconStack2 size={12} stroke={ICON_STROKE} />}
          label={labels.allItems}
          count={totalCount}
          onClick={() => onSelectCat("all")}
        />
        <div className="mx-2 my-1.5 h-px bg-border" />
        {categories.map((c) => (
          <CategoryRow
            key={c.id}
            active={activeCat === c.id}
            icon={<IconFolder size={12} stroke={ICON_STROKE} />}
            label={c.label}
            count={c.count}
            onClick={() => onSelectCat(c.id)}
            actions={
              !c.protected ? (
                <>
                  <Tooltip content={labels.rename} side="right" delay={0}>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="transition-none active:not-aria-[haspopup]:translate-y-0"
                      aria-label={labels.rename}
                      title={labels.rename}
                      onClick={(e) => {
                        e.stopPropagation()
                        onRenameCategory(c.id)
                      }}
                    >
                      <IconPencil size={11} stroke={ICON_STROKE} />
                    </Button>
                  </Tooltip>
                  <Tooltip content={labels.remove} side="right" delay={0}>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="transition-none active:not-aria-[haspopup]:translate-y-0"
                      aria-label={labels.remove}
                      title={labels.remove}
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveCategory(c.id)
                      }}
                    >
                      <IconTrash size={11} stroke={ICON_STROKE} />
                    </Button>
                  </Tooltip>
                </>
              ) : undefined
            }
          />
        ))}
      </div>

      <div className="border-t border-border p-2.5">
        <Button variant="outline" size="sm" className="w-full" onClick={onCreateCategory}>
          <IconPlus size={12} stroke={ICON_STROKE} />
          {labels.newCategory}
        </Button>
      </div>
    </aside>
  )
}

function TypeRow({
  className,
  icon,
  label,
  count,
  active,
  onClick,
}: {
  className: string
  icon: React.ReactNode
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <div className={className} onClick={onClick}>
      {icon}
      <span>{label}</span>
      <span
        className={cn(
          "ml-auto font-mono text-[10.5px]",
          active ? "text-primary" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </div>
  )
}

function CategoryRow({
  icon,
  label,
  count,
  active,
  onClick,
  actions,
}: {
  icon: React.ReactNode
  label: string
  count?: number
  active: boolean
  onClick: () => void
  actions?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "group/cat relative flex h-[34px] cursor-pointer items-center gap-2 px-2.5 text-[12.5px] text-foreground hover:bg-muted",
        active && "bg-primary/10 font-medium text-primary",
      )}
      onClick={onClick}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <div className="relative ml-auto h-6 w-[50px] shrink-0">
        {count !== undefined && (
          <span
            className={cn(
              "absolute inset-y-0 right-0 flex items-center font-mono text-[10.5px] text-muted-foreground",
              active && "text-primary",
              actions && "group-hover/cat:hidden",
            )}
          >
            {count}
          </span>
        )}
        {actions && (
          <div
            className="absolute inset-y-0 right-0 hidden items-center gap-0.5 group-hover/cat:flex"
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export type { ResourceTab }
