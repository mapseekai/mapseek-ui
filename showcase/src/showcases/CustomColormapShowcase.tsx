import {
  buildColormapGradient,
  type CustomColormap,
  CustomColormapEditor,
  type CustomColormapLabels,
  DEFAULT_CUSTOM_COLORMAP,
} from "@registry/blocks/raster-style-panel"
import { Button } from "@registry/ui/button"
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@registry/ui/dialog"
import { useState } from "react"

const LABELS: CustomColormapLabels = {
  stops: "色停",
  stopsUnit: "stops",
  addStop: "添加色停",
  removeStop: "删除色停",
  interpolation: "插值方式",
  interpolationModes: { linear: "线性", step: "阶梯", smooth: "平滑" },
  colorSpace: "色彩空间",
  colorSpaceHint: "OKLCH 在感知上更均匀",
  colorSpaceModes: { oklch: "OKLCH", srgb: "sRGB", hsl: "HSL" },
  importPreset: "从预设导入",
  importHint: "点击套用",
}

export function CustomColormapShowcase() {
  const [open, setOpen] = useState(false)
  const [committed, setCommitted] = useState<CustomColormap>(DEFAULT_CUSTOM_COLORMAP)
  const [draft, setDraft] = useState<CustomColormap>(DEFAULT_CUSTOM_COLORMAP)

  const openEditor = () => {
    setDraft(committed)
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">
        受控自定义配色编辑器（内容），用现有 Dialog 套出标题/描述/取消/应用。色停用 原生取色器；插值
        step 出硬色带、linear/smooth 走所选色彩空间的连续渐变； 预设点击替换色停。
      </p>

      <div className="flex items-center gap-3">
        <span
          className="h-6 w-64 border border-border"
          style={{ background: buildColormapGradient(committed) }}
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          {committed.stops.length} stops · {committed.interpolation} · {committed.colorSpace}
        </span>
        <Button size="sm" onClick={openEditor}>
          编辑配色
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          width={460}
          title="自定义配色方案"
          description="编辑色停、调整插值方式与色彩空间，预览效果会实时反映到地图。"
        >
          <DialogBody>
            <CustomColormapEditor value={draft} onChange={setDraft} labels={LABELS} />
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setCommitted(draft)
                setOpen(false)
              }}
            >
              应用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
