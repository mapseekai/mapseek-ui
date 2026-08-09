import {
  TOOLBOX_LABELS_EN,
  TOOLBOX_LABELS_ZH_CN,
  Toolbox,
  type ToolboxTab,
  type ToolboxTool,
} from "@registry/blocks/toolbox"
import { IconCircleCheck, IconCircles, IconCut, IconTopologyStar3 } from "@tabler/icons-react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

function toolboxTools(locale: "zh-CN" | "en"): readonly ToolboxTool[] {
  const english = locale === "en"
  return [
    {
      id: "buffer",
      label: english ? "Buffer" : "缓冲区",
      description: english ? "Create a buffer at a specified distance" : "按指定距离生成要素缓冲区",
      group: english ? "Spatial analysis" : "空间分析",
      icon: IconCircles,
      parameterKind: "distance",
    },
    {
      id: "clip",
      label: english ? "Clip" : "裁剪",
      description: english ? "Clip the current layer with a mask" : "使用掩膜图层裁剪当前图层",
      group: english ? "Overlay" : "叠加分析",
      icon: IconCut,
    },
    {
      id: "simplify",
      label: english ? "Simplify geometry" : "简化几何",
      description: english ? "Reduce vertices while preserving topology" : "减少节点并保持几何拓扑",
      group: english ? "Geometry" : "几何处理",
      icon: IconTopologyStar3,
    },
    {
      id: "repair",
      label: english ? "Repair geometry" : "修复几何",
      description: english ? "Detect and repair invalid geometry" : "检测并修复无效几何对象",
      group: english ? "Geometry" : "几何处理",
      icon: IconCircleCheck,
    },
  ]
}

export function ToolboxDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<ToolboxTab>("all")
  const [favorites, setFavorites] = useState<ReadonlySet<string>>(() => new Set(["buffer"]))
  const [recents, setRecents] = useState<readonly string[]>(["clip"])
  const [activeToolId, setActiveToolId] = useState<string | undefined>()
  const [distance, setDistance] = useState("100")
  const [completed, setCompleted] = useState(false)
  const tools = toolboxTools(locale)
  const labels = locale === "en" ? TOOLBOX_LABELS_EN : TOOLBOX_LABELS_ZH_CN

  return (
    <div style={{ width: "min(100%, 360px)" }}>
      <Toolbox
        tools={tools}
        favoriteIds={favorites}
        recentIds={recents}
        activeToolId={activeToolId}
        inputLayerName={locale === "en" ? "Land use" : "用地分类"}
        distance={distance}
        completed={completed}
        open={open}
        tab={tab}
        query={query}
        labels={labels}
        onOpenChange={setOpen}
        onTabChange={setTab}
        onQueryChange={setQuery}
        onFavoriteChange={(id, favored) =>
          setFavorites((current) => {
            const next = new Set(current)
            if (favored) next.add(id)
            else next.delete(id)
            return next
          })
        }
        onOpenTool={(id) => {
          setActiveToolId(id)
          setCompleted(false)
          if (id)
            setRecents((current) => [id, ...current.filter((item) => item !== id)].slice(0, 4))
        }}
        onDistanceChange={setDistance}
        onRun={() => setCompleted(true)}
      />
    </div>
  )
}
