import { Badge } from "@registry/ui/badge"
import { Button } from "@registry/ui/button"
import { Input } from "@registry/ui/input"
import { Skeleton } from "@registry/ui/skeleton"
import { IconMoon, IconSearch, IconSun } from "@tabler/icons-react"
import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { type ShowcaseCategory, showcaseEntries } from "./showcases/catalog"

const CATEGORY_LABELS = {
  primitive: "基础组件",
  block: "业务组件",
} as const satisfies Record<ShowcaseCategory, string>

function requestedShowcaseId() {
  try {
    return decodeURIComponent(window.location.hash.slice(1))
  } catch {
    return ""
  }
}

export function App() {
  const [activeId, setActiveId] = useState(() => {
    const requestedId = requestedShowcaseId()
    return showcaseEntries.some((entry) => entry.id === requestedId) ? requestedId : "accordion"
  })
  const [query, setQuery] = useState("")
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))

  useEffect(() => {
    const syncFromHash = () => {
      const requestedId = requestedShowcaseId()
      if (showcaseEntries.some((entry) => entry.id === requestedId)) setActiveId(requestedId)
    }
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [])

  const activeEntry = showcaseEntries.find((entry) => entry.id === activeId)
  const ActiveShowcase = useMemo(() => (activeEntry ? lazy(activeEntry.load) : null), [activeEntry])
  const visibleEntries = useMemo(() => {
    if (!activeEntry) return []
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return showcaseEntries.filter(
      (entry) =>
        entry.category === activeEntry.category &&
        (normalizedQuery.length === 0 ||
          entry.name.toLocaleLowerCase().includes(normalizedQuery) ||
          entry.id.includes(normalizedQuery)),
    )
  }, [activeEntry, query])

  const counts = useMemo(
    () => ({
      primitive: showcaseEntries.filter((entry) => entry.category === "primitive").length,
      block: showcaseEntries.filter((entry) => entry.category === "block").length,
    }),
    [],
  )

  if (!(activeEntry && ActiveShowcase)) return null

  const selectEntry = (id: string) => {
    setActiveId(id)
    window.history.replaceState(null, "", `#${encodeURIComponent(id)}`)
  }

  const selectCategory = (category: ShowcaseCategory) => {
    const entry = showcaseEntries.find((candidate) => candidate.category === category)
    if (entry) selectEntry(entry.id)
    setQuery("")
  }

  const toggleTheme = () => {
    const nextDark = !dark
    setDark(nextDark)
    document.documentElement.classList.toggle("dark", nextDark)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate font-mono text-sm font-semibold">Mapseek UI</span>
          <Badge variant="outline" className="hidden sm:inline-flex">
            Showcase
          </Badge>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          aria-label={dark ? "切换到浅色模式" : "切换到深色模式"}
          title={dark ? "浅色模式" : "深色模式"}
        >
          {dark ? <IconSun size={15} /> : <IconMoon size={15} />}
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="flex shrink-0 flex-col border-b border-border bg-sidebar md:w-64 md:border-r md:border-b-0">
          <div className="grid grid-cols-2 border-b border-border">
            {(["primitive", "block"] as const).map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => selectCategory(category)}
                className={
                  activeEntry.category === category
                    ? "border-b-2 border-primary bg-selection-bg px-3 py-2 text-xs font-medium text-primary"
                    : "border-b-2 border-transparent px-3 py-2 text-xs text-muted-foreground hover:bg-muted focus-visible:bg-muted"
                }
              >
                {CATEGORY_LABELS[category]} {counts[category]}
              </button>
            ))}
          </div>

          <label htmlFor="showcase-search" className="relative m-2 hidden md:block">
            <span className="sr-only">搜索当前分类</span>
            <IconSearch
              size={14}
              className="pointer-events-none absolute start-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="showcase-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索组件"
              className="ps-7"
            />
          </label>

          <nav
            aria-label={`${CATEGORY_LABELS[activeEntry.category]}案例`}
            className="flex overflow-x-auto md:min-h-0 md:flex-1 md:flex-col md:overflow-y-auto"
          >
            {visibleEntries.map((entry) => (
              <button
                type="button"
                key={entry.id}
                onClick={() => selectEntry(entry.id)}
                className={
                  entry.id === activeEntry.id
                    ? "shrink-0 border-s-2 border-primary bg-selection-bg px-3 py-2 text-start text-xs font-medium text-primary md:w-full"
                    : "shrink-0 border-s-2 border-transparent px-3 py-2 text-start text-xs text-foreground hover:bg-muted focus-visible:bg-muted md:w-full"
                }
              >
                {entry.name}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
            <div className="min-w-0">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                {CATEGORY_LABELS[activeEntry.category]} / {activeEntry.id}
              </div>
              <h1 className="text-lg font-semibold">{activeEntry.name}</h1>
            </div>
            <Badge variant="secondary">实时源码</Badge>
          </div>

          <Suspense
            key={activeEntry.id}
            fallback={
              <div role="status" className="space-y-3" aria-label="正在加载案例">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-40 w-full" />
              </div>
            }
          >
            <ActiveShowcase />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
