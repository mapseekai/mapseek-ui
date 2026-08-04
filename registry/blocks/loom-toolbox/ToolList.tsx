import { IconSearch, IconStar, IconStarFilled, IconTools, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { LoomTool, LoomToolboxLabels, LoomToolboxTab } from "./types"

type FavoriteButtonProps = {
  readonly tool: LoomTool
  readonly favored: boolean
  readonly labels: LoomToolboxLabels
  readonly onFavoriteChange: (id: string, favored: boolean) => void
}

function FavoriteButton({ tool, favored, labels, onFavoriteChange }: FavoriteButtonProps) {
  const Star = favored ? IconStarFilled : IconStar
  return (
    <button
      type="button"
      aria-label={favored ? labels.unfavorite(tool.label) : labels.favorite(tool.label)}
      aria-pressed={favored}
      className={cn(
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        favored ? "text-primary" : "text-muted-foreground",
      )}
      onClick={() => onFavoriteChange(tool.id, !favored)}
    >
      <Star className={cn("size-3.5", favored && "fill-current")} />
    </button>
  )
}

export type ToolListProps = {
  readonly tools: readonly LoomTool[]
  readonly favoriteIds: ReadonlySet<string>
  readonly tab: LoomToolboxTab
  readonly query: string
  readonly labels: LoomToolboxLabels
  readonly onTabChange: (tab: LoomToolboxTab) => void
  readonly onQueryChange: (query: string) => void
  readonly onFavoriteChange: (id: string, favored: boolean) => void
  readonly onOpenTool: (id: string) => void
  readonly onOpenChange: (open: boolean) => void
}

export function ToolList({
  tools,
  favoriteIds,
  tab,
  query,
  labels,
  onTabChange,
  onQueryChange,
  onFavoriteChange,
  onOpenTool,
  onOpenChange,
}: ToolListProps) {
  return (
    <>
      <header className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <span className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <IconTools className="size-4" />
        </span>
        <span className="flex-1 text-sm font-semibold">{labels.title}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label={labels.close}
          onClick={() => onOpenChange(false)}
        >
          <IconX className="size-4" />
        </Button>
      </header>

      <div className="space-y-2 border-b border-border px-3 py-2.5">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label={labels.search}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="ps-8"
            placeholder={labels.search}
          />
        </div>
        <div className="flex gap-1">
          {(["all", "favorites", "recent"] as const).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              className={cn(
                "px-2.5 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                tab === id ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground",
              )}
              onClick={() => onTabChange(id)}
            >
              {labels.tabs[id]}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === "all" && query.trim().length === 0 && tools.length > 0 && (
          <section className="mb-4">
            <h3 className="mb-2 text-xs font-semibold">{labels.quickAccess}</h3>
            <div className="grid grid-cols-2 gap-2">
              {tools.slice(0, 2).map((tool) => {
                const ToolIcon = tool.icon
                return (
                  <div key={tool.id} className="border border-border p-2.5">
                    <div className="mb-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="flex min-w-0 flex-1 items-center gap-2 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => onOpenTool(tool.id)}
                      >
                        <span className="flex size-7 items-center justify-center bg-primary/10 text-primary">
                          <ToolIcon className="size-3.5" />
                        </span>
                        <span className="truncate text-xs font-semibold">{tool.label}</span>
                      </button>
                      <FavoriteButton
                        tool={tool}
                        favored={favoriteIds.has(tool.id)}
                        labels={labels}
                        onFavoriteChange={onFavoriteChange}
                      />
                    </div>
                    <p className="line-clamp-2 text-[11px] text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold">
              {tab === "all" ? labels.categories : labels.tabs[tab]}
            </h3>
            <span className="text-[11px] text-muted-foreground">
              {labels.toolCount(tools.length)}
            </span>
          </div>
          <div className="space-y-1">
            {tools.map((tool) => {
              const ToolIcon = tool.icon
              return (
                <div
                  key={tool.id}
                  className="flex items-center gap-2 border border-transparent px-2 py-1.5 hover:border-border hover:bg-muted/40"
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => onOpenTool(tool.id)}
                  >
                    <span className="flex size-6 items-center justify-center bg-muted text-muted-foreground">
                      <ToolIcon className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium">{tool.label}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {tool.group} · {tool.description}
                      </span>
                    </span>
                  </button>
                  <FavoriteButton
                    tool={tool}
                    favored={favoriteIds.has(tool.id)}
                    labels={labels}
                    onFavoriteChange={onFavoriteChange}
                  />
                </div>
              )
            })}
            {tools.length === 0 && (
              <p className="py-8 text-center text-xs text-muted-foreground">{labels.empty}</p>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
