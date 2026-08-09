import { IconSearch, IconStar, IconStarFilled, IconTools, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import type { LoomTool, LoomToolboxLabels, LoomToolboxTab } from "./types"

const selectedToggleClass =
  "aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary aria-pressed:hover:text-primary-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground"

type FavoriteButtonProps = {
  readonly tool: LoomTool
  readonly favored: boolean
  readonly labels: LoomToolboxLabels
  readonly onFavoriteChange: (id: string, favored: boolean) => void
}

function FavoriteButton({ tool, favored, labels, onFavoriteChange }: FavoriteButtonProps) {
  const Star = favored ? IconStarFilled : IconStar
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      type="button"
      aria-label={favored ? labels.unfavorite(tool.label) : labels.favorite(tool.label)}
      aria-pressed={favored}
      className={favored ? "text-primary" : "text-muted-foreground"}
      onClick={() => onFavoriteChange(tool.id, !favored)}
    >
      <Star className={cn(favored && "fill-current")} aria-hidden="true" />
    </Button>
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
        <span className="flex size-7 items-center justify-center bg-muted text-muted-foreground">
          <IconTools className="size-4" aria-hidden="true" />
        </span>
        <span className="flex-1 text-headline-sm">{labels.title}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label={labels.close}
          onClick={() => onOpenChange(false)}
        >
          <IconX aria-hidden="true" />
        </Button>
      </header>

      <div className="flex flex-col gap-2 border-b border-border px-3 py-2.5">
        <InputGroup>
          <InputGroupAddon>
            <IconSearch aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label={labels.search}
            name="toolbox-search"
            autoComplete="off"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={labels.search}
          />
        </InputGroup>
        <ToggleGroup
          aria-label={labels.categories}
          value={[tab]}
          onValueChange={([id]) => {
            if (id) onTabChange(id as LoomToolboxTab)
          }}
          size="sm"
          spacing={1}
        >
          {(["all", "favorites", "recent"] as const).map((id) => (
            <ToggleGroupItem key={id} value={id} className={selectedToggleClass}>
              {labels.tabs[id]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === "all" && query.trim().length === 0 && tools.length > 0 && (
          <section className="mb-4">
            <h3 className="mb-2 text-body-md-strong">{labels.quickAccess}</h3>
            <div className="grid grid-cols-2 gap-2">
              {tools.slice(0, 2).map((tool) => {
                const ToolIcon = tool.icon
                return (
                  <div
                    key={tool.id}
                    className="border border-border p-2.5 transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Button
                        variant="link"
                        size="sm"
                        type="button"
                        className="h-auto min-w-0 flex-1 justify-start gap-2 rounded-none p-0 text-start text-foreground hover:no-underline"
                        onClick={() => onOpenTool(tool.id)}
                      >
                        <span className="flex size-7 items-center justify-center bg-muted text-muted-foreground">
                          <ToolIcon className="size-3.5" aria-hidden="true" />
                        </span>
                        <span className="truncate text-body-md-strong" title={tool.label}>
                          {tool.label}
                        </span>
                      </Button>
                      <FavoriteButton
                        tool={tool}
                        favored={favoriteIds.has(tool.id)}
                        labels={labels}
                        onFavoriteChange={onFavoriteChange}
                      />
                    </div>
                    <p
                      className="line-clamp-2 text-body-sm text-muted-foreground"
                      title={tool.description}
                    >
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
            <h3 className="text-body-md-strong">
              {tab === "all" ? labels.categories : labels.tabs[tab]}
            </h3>
            <span className="tnum text-body-sm text-muted-foreground">
              {labels.toolCount(tools.length)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {tools.map((tool) => {
              const ToolIcon = tool.icon
              return (
                <div
                  key={tool.id}
                  className="flex items-center gap-2 border border-transparent px-2 py-1.5 transition-colors hover:bg-accent/50"
                >
                  <Button
                    variant="link"
                    size="sm"
                    type="button"
                    className="h-auto min-w-0 flex-1 justify-start gap-2 rounded-none p-0 text-start text-foreground hover:no-underline"
                    onClick={() => onOpenTool(tool.id)}
                  >
                    <span className="flex size-6 items-center justify-center bg-muted text-muted-foreground">
                      <ToolIcon className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body-md-medium" title={tool.label}>
                        {tool.label}
                      </span>
                      <span
                        className="block truncate text-body-sm text-muted-foreground"
                        title={`${tool.group} · ${tool.description}`}
                      >
                        {tool.group} · {tool.description}
                      </span>
                    </span>
                  </Button>
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
              <Empty className="min-h-32 border-0 p-4">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconTools aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>{labels.empty}</EmptyTitle>
                  <EmptyDescription>{labels.toolCount(0)}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
