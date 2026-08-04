import { cn } from "@registry/lib/utils"
import { Button } from "@registry/ui/button"
import { Input } from "@registry/ui/input"
import {
  type Icon,
  IconArrowLeft,
  IconCircleCheck,
  IconCircles,
  IconCut,
  IconSearch,
  IconStar,
  IconStarFilled,
  IconTools,
  IconTopologyStar3,
  IconX,
} from "@tabler/icons-react"
import { useMemo, useState } from "react"

type ToolId = "buffer" | "clip" | "simplify" | "repair"
type Tool = { id: ToolId; label: string; description: string; group: string; icon: Icon }

const TOOLS: Tool[] = [
  {
    id: "buffer",
    label: "缓冲区",
    description: "按指定距离生成要素缓冲区",
    group: "空间分析",
    icon: IconCircles,
  },
  {
    id: "clip",
    label: "裁剪",
    description: "使用掩模图层裁剪当前图层",
    group: "叠加分析",
    icon: IconCut,
  },
  {
    id: "simplify",
    label: "简化几何",
    description: "减少节点并保持几何拓扑",
    group: "几何处理",
    icon: IconTopologyStar3,
  },
  {
    id: "repair",
    label: "修复几何",
    description: "检测并修复无效几何对象",
    group: "几何处理",
    icon: IconCircleCheck,
  },
]

export function LoomToolboxShowcase() {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<"all" | "fav" | "recent">("all")
  const [favorites, setFavorites] = useState<ReadonlySet<ToolId>>(() => new Set(["buffer"]))
  const [recents, setRecents] = useState<ToolId[]>(["clip"])
  const [activeTool, setActiveTool] = useState<ToolId | null>(null)
  const [distance, setDistance] = useState("100")
  const [completed, setCompleted] = useState(false)

  const visibleTools = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return TOOLS.filter((tool) => {
      if (tab === "fav" && !favorites.has(tool.id)) return false
      if (tab === "recent" && !recents.includes(tool.id)) return false
      return (
        !keyword ||
        tool.label.toLowerCase().includes(keyword) ||
        tool.description.toLowerCase().includes(keyword)
      )
    })
  }, [favorites, query, recents, tab])
  const selectedTool = TOOLS.find((tool) => tool.id === activeTool) ?? null

  const toggleFavorite = (id: ToolId) =>
    setFavorites((current) => {
      const next = new Set(current)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  const openTool = (id: ToolId) => {
    setActiveTool(id)
    setCompleted(false)
    setRecents((current) => [id, ...current.filter((item) => item !== id)].slice(0, 4))
  }

  if (!open) {
    return (
      <section className="space-y-3">
        <p className="text-xs text-muted-foreground">工具箱已关闭。</p>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <IconTools /> 打开工具箱
        </Button>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          原 Loom 编辑器工具箱案例
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          覆盖工具搜索、收藏、最近使用、快捷访问、参数详情与完成状态。
        </p>
      </div>

      <aside
        data-testid="loom-toolbox"
        className="flex h-[560px] w-[360px] max-w-full flex-col overflow-hidden border border-border bg-card"
      >
        {selectedTool ? (
          <ToolDetail
            tool={selectedTool}
            favored={favorites.has(selectedTool.id)}
            distance={distance}
            completed={completed}
            onDistanceChange={setDistance}
            onFavorite={() => toggleFavorite(selectedTool.id)}
            onBack={() => setActiveTool(null)}
            onClose={() => setOpen(false)}
            onRun={() => setCompleted(true)}
          />
        ) : (
          <>
            <header className="flex items-center gap-2 border-b border-border px-3 py-2.5">
              <span className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
                <IconTools className="size-4" />
              </span>
              <span className="flex-1 text-sm font-semibold">工具箱</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label="关闭工具箱"
                onClick={() => setOpen(false)}
              >
                <IconX className="size-4" />
              </Button>
            </header>
            <div className="space-y-2 border-b border-border px-3 py-2.5">
              <div className="relative">
                <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="搜索工具"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-8"
                  placeholder="搜索工具、模型或脚本"
                />
              </div>
              <div className="flex gap-1">
                {(["all", "fav", "recent"] as const).map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={tab === id}
                    className={cn(
                      "px-2.5 py-1 text-xs",
                      tab === id
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground",
                    )}
                    onClick={() => setTab(id)}
                  >
                    {{ all: "全部", fav: "收藏", recent: "最近使用" }[id]}
                  </button>
                ))}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {tab === "all" && !query.trim() && (
                <section className="mb-4">
                  <h3 className="mb-2 text-xs font-semibold">快捷访问</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TOOLS.slice(0, 2).map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        favored={favorites.has(tool.id)}
                        onOpen={openTool}
                        onFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </section>
              )}
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold">
                    {tab === "all" ? "工具分类" : tab === "fav" ? "收藏工具" : "最近使用"}
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {visibleTools.length} 个工具
                  </span>
                </div>
                <div className="space-y-1">
                  {visibleTools.map((tool) => (
                    <ToolRow
                      key={tool.id}
                      tool={tool}
                      favored={favorites.has(tool.id)}
                      onOpen={openTool}
                      onFavorite={toggleFavorite}
                    />
                  ))}
                  {visibleTools.length === 0 && (
                    <p className="py-8 text-center text-xs text-muted-foreground">没有匹配的工具</p>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </aside>
    </section>
  )
}

function FavoriteButton({
  tool,
  favored,
  onFavorite,
}: {
  tool: Tool
  favored: boolean
  onFavorite: (id: ToolId) => void
}) {
  const Star = favored ? IconStarFilled : IconStar
  return (
    <button
      type="button"
      aria-label={favored ? `取消收藏 ${tool.label}` : `收藏 ${tool.label}`}
      aria-pressed={favored}
      className={favored ? "text-primary" : "text-muted-foreground"}
      onClick={() => onFavorite(tool.id)}
    >
      <Star className={cn("size-3.5", favored && "fill-current")} />
    </button>
  )
}

function ToolCard({
  tool,
  favored,
  onOpen,
  onFavorite,
}: {
  tool: Tool
  favored: boolean
  onOpen: (id: ToolId) => void
  onFavorite: (id: ToolId) => void
}) {
  const ToolIcon = tool.icon
  return (
    <div className="border border-border p-2.5">
      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={() => onOpen(tool.id)}
        >
          <span className="flex size-7 items-center justify-center bg-primary/10 text-primary">
            <ToolIcon className="size-3.5" />
          </span>
          <span className="truncate text-xs font-semibold">{tool.label}</span>
        </button>
        <FavoriteButton tool={tool} favored={favored} onFavorite={onFavorite} />
      </div>
      <p className="line-clamp-2 text-[11px] text-muted-foreground">{tool.description}</p>
    </div>
  )
}

function ToolRow({
  tool,
  favored,
  onOpen,
  onFavorite,
}: {
  tool: Tool
  favored: boolean
  onOpen: (id: ToolId) => void
  onFavorite: (id: ToolId) => void
}) {
  const ToolIcon = tool.icon
  return (
    <div className="flex items-center gap-2 border border-transparent px-2 py-1.5 hover:border-border hover:bg-muted/40">
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
        onClick={() => onOpen(tool.id)}
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
      <FavoriteButton tool={tool} favored={favored} onFavorite={onFavorite} />
    </div>
  )
}

function ToolDetail({
  tool,
  favored,
  distance,
  completed,
  onDistanceChange,
  onFavorite,
  onBack,
  onClose,
  onRun,
}: {
  tool: Tool
  favored: boolean
  distance: string
  completed: boolean
  onDistanceChange: (value: string) => void
  onFavorite: () => void
  onBack: () => void
  onClose: () => void
  onRun: () => void
}) {
  const ToolIcon = tool.icon
  return (
    <>
      <header className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-primary"
          onClick={onBack}
        >
          <IconArrowLeft className="size-3.5" />
          返回工具箱
        </button>
        <span className="flex-1" />
        <button
          type="button"
          aria-label={favored ? `取消收藏 ${tool.label}` : `收藏 ${tool.label}`}
          onClick={onFavorite}
        >
          {favored ? (
            <IconStarFilled className="size-4 fill-current text-primary" />
          ) : (
            <IconStar className="size-4 text-muted-foreground" />
          )}
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label="关闭工具箱"
          onClick={onClose}
        >
          <IconX className="size-4" />
        </Button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="flex items-start gap-2">
          <span className="flex size-8 items-center justify-center bg-primary/10 text-primary">
            <ToolIcon className="size-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">{tool.label}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{tool.description}</p>
          </div>
        </div>
        <div className="my-4 border-t border-border" />
        <h3 className="mb-3 text-xs font-semibold">参数</h3>
        <label htmlFor="loom-tool-input-layer" className="grid gap-1.5 text-xs">
          <span className="text-muted-foreground">输入图层 *</span>
          <Input id="loom-tool-input-layer" value="用地分类" readOnly />
        </label>
        {tool.id === "buffer" && (
          <label htmlFor="loom-tool-distance" className="mt-3 grid gap-1.5 text-xs">
            <span className="text-muted-foreground">缓冲距离（米）*</span>
            <Input
              id="loom-tool-distance"
              inputMode="decimal"
              value={distance}
              onChange={(event) => {
                onDistanceChange(event.target.value)
              }}
            />
          </label>
        )}
        <div className="mt-4 flex items-center gap-1.5 bg-primary/10 px-2.5 py-2 text-[11px] text-primary">
          <IconCircleCheck className="size-3.5" />
          参数有效，可以运行工具
        </div>
      </div>
      <footer className="border-t border-border p-3">
        {completed && (
          <div role="status" className="mb-2 text-[11px] text-primary">
            已完成，结果已添加为新图层。
          </div>
        )}
        <Button
          data-testid="loom-toolbox-run"
          className="w-full"
          disabled={distance.trim() === ""}
          onClick={onRun}
        >
          <IconTools />
          运行 {tool.label}
        </Button>
      </footer>
    </>
  )
}
