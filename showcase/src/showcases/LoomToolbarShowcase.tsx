import { cn } from "@registry/lib/utils"
import { Badge } from "@registry/ui/badge"
import { Button } from "@registry/ui/button"
import {
  type Icon,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconArrowsMove,
  IconDeviceFloppy,
  IconHandStop,
  IconInfoCircle,
  IconMagnet,
  IconPencil,
  IconPointer,
  IconResize,
  IconRotate,
  IconTrash,
  IconVectorBezier2,
  IconVectorTriangle,
} from "@tabler/icons-react"
import { useState } from "react"

type Mode = "pan" | "select" | "pickAttr" | "draw" | "vertex" | "translate" | "rotate" | "scale"
type Tool = { id: Mode; label: string; hint: string; icon: Icon; editOnly?: boolean }

const GROUPS: { label: string; tools: Tool[] }[] = [
  { label: "导航", tools: [{ id: "pan", label: "平移缩放", hint: "H", icon: IconHandStop }] },
  {
    label: "选择",
    tools: [
      { id: "select", label: "点选", hint: "V", icon: IconPointer },
      { id: "pickAttr", label: "属性拾取", hint: "I", icon: IconInfoCircle },
    ],
  },
  {
    label: "编辑",
    tools: [
      { id: "draw", label: "添加要素", hint: "P", icon: IconVectorTriangle, editOnly: true },
      { id: "vertex", label: "节点编辑", hint: "E", icon: IconVectorBezier2, editOnly: true },
    ],
  },
  {
    label: "变换",
    tools: [
      { id: "translate", label: "平移要素", hint: "M", icon: IconArrowsMove, editOnly: true },
      { id: "rotate", label: "旋转要素", hint: "R", icon: IconRotate, editOnly: true },
      { id: "scale", label: "缩放要素", hint: "T", icon: IconResize, editOnly: true },
    ],
  },
]

export function LoomToolbarShowcase() {
  const [editing, setEditing] = useState(true)
  const [dirty, setDirty] = useState(true)
  const [mode, setMode] = useState<Mode>("select")
  const [snapping, setSnapping] = useState(true)
  const [historyIndex, setHistoryIndex] = useState(1)

  const toggleEditing = () => {
    setEditing((current) => {
      if (current) setMode("pan")
      return !current
    })
  }
  const activate = (nextMode: Mode) => {
    setMode(nextMode)
    if (nextMode !== "pan" && nextMode !== "select" && nextMode !== "pickAttr") {
      setDirty(true)
      setHistoryIndex(2)
    }
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          原 Loom 编辑器工具条案例
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          覆盖编辑会话、互斥工具模式、编辑门控、吸附开关与撤销/重做状态。
        </p>
      </div>

      <div
        data-testid="loom-toolbar"
        className="relative min-h-[500px] overflow-hidden border border-border bg-muted/40"
      >
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute left-[8%] top-[36%] h-36 w-[46%] border-2 border-primary/45 bg-primary/10 [clip-path:polygon(8%_14%,78%_0,100%_56%,68%_100%,0_82%)]" />
        <div className="absolute bottom-20 left-4 border border-border bg-card/95 px-3 py-2 shadow-sm sm:bottom-4">
          <p className="text-xs font-semibold">城市用地现状 2024</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">当前图层 · 面 · 1,284 个要素</p>
        </div>

        <div className="absolute inset-x-3 top-4 flex justify-center">
          <div className="max-w-full overflow-x-auto border border-border bg-card shadow-lg">
            <div className="flex h-11 min-w-max items-center gap-1 px-1.5">
              <Button
                size="sm"
                className="h-7 gap-1.5 rounded-none px-2.5 text-[11px]"
                onClick={toggleEditing}
              >
                <IconPencil className="size-3.5" />
                {editing ? "退出编辑" : "开始编辑"}
              </Button>

              {editing && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!dirty}
                    className="h-7 gap-1.5 rounded-none px-2 text-[11px]"
                    onClick={() => setDirty(false)}
                  >
                    <IconDeviceFloppy className="size-3.5" />
                    保存
                  </Button>
                  <Badge variant="outline" className="rounded-none">
                    当前：城市用地现状
                  </Badge>
                </>
              )}

              <Separator />
              {GROUPS.map((group, groupIndex) => (
                <fieldset
                  key={group.label}
                  className="flex min-w-0 items-center gap-0.5 border-0 p-0"
                  aria-label={group.label}
                >
                  {groupIndex > 0 && <Separator />}
                  {group.tools.map((tool) => {
                    const ToolIcon = tool.icon
                    const active = mode === tool.id
                    const disabled = Boolean(tool.editOnly && !editing)
                    return (
                      <Button
                        key={tool.id}
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={tool.label}
                        aria-pressed={active}
                        title={
                          disabled ? `${tool.label} · 请先开启编辑` : `${tool.label} · ${tool.hint}`
                        }
                        disabled={disabled}
                        data-testid={
                          tool.id === "translate" ? "loom-toolbar-primary-mode" : undefined
                        }
                        className={cn(
                          "size-8 rounded-none",
                          active &&
                            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                        )}
                        onClick={() => activate(tool.id)}
                      >
                        <ToolIcon className="size-4" />
                      </Button>
                    )
                  })}
                </fieldset>
              ))}

              <Separator />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={snapping ? "关闭吸附" : "开启吸附"}
                aria-pressed={snapping}
                title={`顶点/边吸附 · 8 px · ${snapping ? "已开启" : "已关闭"}`}
                className={cn(
                  "size-8 rounded-none",
                  snapping &&
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                )}
                onClick={() => setSnapping((current) => !current)}
              >
                <IconMagnet className="size-4" />
              </Button>

              <Separator />
              <Button
                variant="ghost"
                size="icon"
                aria-label="撤销"
                title="撤销 · ⌘Z"
                disabled={historyIndex === 0}
                className="size-8 rounded-none"
                onClick={() => setHistoryIndex((current) => Math.max(0, current - 1))}
              >
                <IconArrowBackUp className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="重做"
                title="重做 · ⌘⇧Z"
                disabled={historyIndex === 2}
                className="size-8 rounded-none"
                onClick={() => setHistoryIndex((current) => Math.min(2, current + 1))}
              >
                <IconArrowForwardUp className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2 border border-border bg-card/95 px-3 py-2 text-xs shadow-sm">
          <span className="text-muted-foreground">当前模式</span>
          <Badge>
            {GROUPS.flatMap((group) => group.tools).find((tool) => tool.id === mode)?.label}
          </Badge>
          {dirty && <span className="text-warning">有未保存编辑</span>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <IconTrash className="size-3.5" />
        删除要素在真实工具条中还会受“已有选择”门控；本案例聚焦工具模式与会话状态。
      </div>
    </section>
  )
}

function Separator() {
  return <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-border" />
}
