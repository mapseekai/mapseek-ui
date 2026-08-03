import {
  type RasterStat,
  type RasterStyleLabels,
  RasterStylePanel,
  type RasterStylePanelLabels,
  type RasterStyleValue,
} from "@registry/blocks/raster-style-panel"
import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const initialStyle: RasterStyleValue = {
  mode: "SINGLE",
  selector: { kind: "bands", bands: [1], assignments: {} },
  colormap: { kind: "named", name: "viridis" },
  stretch: { mode: "stddev", sigma: 2 },
  nodata: { kind: "custom", custom: -9999 },
  resampling: "bilinear",
  tileSize: 256,
  format: "webp",
}

const labels = {
  "zh-CN": {
    title: "Sentinel-2 栅格样式",
    saved: "已保存样式",
    reset: "重置",
    save: "保存",
    valid: "有效",
    invalid: "存在草稿错误",
    summary: "当前编码",
    rgb: "RGB 合成",
    single: "单波段",
    stats: {
      bands: "波段数",
      size: "尺寸",
      min: "最小值",
      max: "最大值",
      dataType: "UInt16",
    },
    labels: {
      band: "波段",
      bandAppend: "追加",
      renderMode: "渲染方式",
      renderSingle: "单波段",
      renderRgb: "RGB 合成",
      colormap: "配色",
      customColormap: "自定义",
      stretch: "拉伸",
      stretchModes: { custom: "自定义", minmax: "最小最大", percent: "百分位", stddev: "标准差" },
      percentHint: "pc =",
      sigmaHint: "sigma =",
      sigmaSuffix: "mean +/- sigma",
      auto: "Auto",
      nodata: "NoData",
      resampling: "重采样",
      resamplingModes: {
        nearest: "近邻",
        bilinear: "双线性",
        cubic: "三次",
        cubicspline: "样条",
        lanczos: "兰索斯",
        average: "均值",
        mode: "众数",
      },
      tileSize: "瓦片",
      format: "格式",
      formatModes: { png: "PNG", webp: "WebP", jpeg: "JPEG" },
      multibandNote: "RGB 合成不使用 colormap",
      colormapNone: "无配色",
      colormapNamed: "预设配色",
      colormapCustom: "自定义配色",
    } satisfies RasterStyleLabels & Partial<RasterStylePanelLabels>,
  },
  en: {
    title: "Sentinel-2 raster style",
    saved: "Saved style",
    reset: "Reset",
    save: "Save",
    valid: "Valid",
    invalid: "Draft has errors",
    summary: "Current encoding",
    rgb: "RGB composite",
    single: "Single band",
    stats: {
      bands: "BANDS",
      size: "SIZE",
      min: "MIN",
      max: "MAX",
      dataType: "UInt16",
    },
    labels: {
      band: "Band",
      bandAppend: "Append",
      renderMode: "Render mode",
      renderSingle: "Single band",
      renderRgb: "RGB composite",
      colormap: "Colormap",
      customColormap: "Custom",
      stretch: "Stretch",
      stretchModes: { custom: "Custom", minmax: "Min max", percent: "Percent", stddev: "Std dev" },
      percentHint: "pc =",
      sigmaHint: "sigma =",
      sigmaSuffix: "mean +/- sigma",
      auto: "Auto",
      nodata: "NoData",
      resampling: "Resampling",
      resamplingModes: {
        nearest: "Nearest",
        bilinear: "Bilinear",
        cubic: "Cubic",
        cubicspline: "Cubic spline",
        lanczos: "Lanczos",
        average: "Average",
        mode: "Mode",
      },
      tileSize: "Tile",
      format: "Format",
      formatModes: { png: "PNG", webp: "WebP", jpeg: "JPEG" },
      multibandNote: "RGB composites do not use a colormap",
      colormapNone: "No colormap",
      colormapNamed: "Preset",
      colormapCustom: "Custom",
    } satisfies RasterStyleLabels & Partial<RasterStylePanelLabels>,
  },
}

function rasterStats(demoLabels: (typeof labels)[keyof typeof labels]): RasterStat[] {
  return [
    { label: demoLabels.stats.bands, value: "4 / 13", unit: demoLabels.stats.dataType },
    { label: demoLabels.stats.size, value: "10,980 x 10,980" },
    { label: demoLabels.stats.min, value: "-18.4" },
    { label: demoLabels.stats.max, value: "3,842" },
  ]
}

export function RasterStylePanelDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [value, setValue] = useState<RasterStyleValue>(initialStyle)
  const [valid, setValid] = useState(true)
  const [revision, setRevision] = useState(0)
  const [status, setStatus] = useState<string>(demoLabels.valid)

  return (
    <section className="grid gap-3 lg:grid-cols-[380px_1fr]">
      <div className="border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <h3 className="m-0 text-sm font-semibold">{demoLabels.title}</h3>
          <span
            data-demo-status="raster-style-panel-validity"
            className="font-mono text-[11px] text-muted-foreground"
          >
            {valid ? demoLabels.valid : demoLabels.invalid}
          </span>
        </div>
        <div className="p-3">
          <RasterStylePanel
            value={value}
            onChange={(next) => {
              setValue(next)
              setStatus(
                next.selector.kind === "bands" && next.selector.bands.length > 1
                  ? demoLabels.rgb
                  : demoLabels.single,
              )
            }}
            onValidityChange={setValid}
            resetKey={revision}
            bandCount={13}
            stats={rasterStats(demoLabels)}
            labels={demoLabels.labels}
            autoRange={[0, 3842]}
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-3 border border-border bg-muted/35 p-3">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            data-demo-action="raster-style-panel-reset"
            variant="outline"
            onClick={() => {
              setValue(initialStyle)
              setRevision((current) => current + 1)
              setStatus(demoLabels.reset)
            }}
          >
            {demoLabels.reset}
          </Button>
          <Button
            type="button"
            size="sm"
            data-demo-action="raster-style-panel-save"
            disabled={!valid}
            onClick={() => setStatus(demoLabels.saved)}
          >
            {demoLabels.save}
          </Button>
        </div>
        <p data-demo-status="raster-style-panel" className="m-0 font-mono text-xs">
          {status}
        </p>
        <div className="min-w-0 border border-border bg-background p-2">
          <p className="m-0 mb-2 text-xs font-medium text-muted-foreground">{demoLabels.summary}</p>
          <pre className="m-0 max-h-64 overflow-auto text-[11px]">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  )
}
