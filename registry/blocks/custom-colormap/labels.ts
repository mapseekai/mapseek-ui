import type { CustomColormapLabels } from "../raster-style-panel"

export type CustomColormapDialogLabels = {
  readonly title: string
  readonly description: string
  readonly edit: string
  readonly cancel: string
  readonly apply: string
  readonly summary: (stops: number, interpolation: string, colorSpace: string) => string
  readonly editor: CustomColormapLabels
}

export const CUSTOM_COLORMAP_LABELS_ZH_CN: CustomColormapDialogLabels = {
  title: "自定义配色方案",
  description: "编辑色停、插值方式与色彩空间。预览会实时反映到地图样式。",
  edit: "编辑配色",
  cancel: "取消",
  apply: "应用",
  summary: (stops, interpolation, colorSpace) =>
    `${stops} 个色停 · ${interpolation} · ${colorSpace}`,
  editor: {
    stops: "色停",
    stopsUnit: "个",
    addStop: "添加色停",
    removeStop: "删除色停",
    interpolation: "插值方式",
    interpolationModes: { linear: "线性", step: "阶梯", smooth: "平滑" },
    colorSpace: "色彩空间",
    colorSpaceHint: "OKLCH 在感知上更均匀",
    colorSpaceModes: { oklch: "OKLCH", srgb: "sRGB", hsl: "HSL" },
    importPreset: "从预设导入",
    importHint: "点击套用",
  },
}

export const CUSTOM_COLORMAP_LABELS_EN: CustomColormapDialogLabels = {
  title: "Custom colormap",
  description:
    "Edit color stops, interpolation, and color space. The preview updates in real time.",
  edit: "Edit colormap",
  cancel: "Cancel",
  apply: "Apply",
  summary: (stops, interpolation, colorSpace) =>
    `${stops} stops · ${interpolation} · ${colorSpace}`,
  editor: {
    stops: "Stops",
    stopsUnit: "stops",
    addStop: "Add stop",
    removeStop: "Remove stop",
    interpolation: "Interpolation",
    interpolationModes: { linear: "Linear", step: "Step", smooth: "Smooth" },
    colorSpace: "Color space",
    colorSpaceHint: "OKLCH is more perceptually uniform",
    colorSpaceModes: { oklch: "OKLCH", srgb: "sRGB", hsl: "HSL" },
    importPreset: "Import preset",
    importHint: "Click to apply",
  },
}
