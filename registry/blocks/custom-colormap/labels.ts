import type {
  ColormapColorSpace,
  ColormapInterpolation,
  CustomColormapLabels,
} from "../raster-style-panel"

const INTERPOLATION_MODES_ZH_CN = {
  linear: "线性",
  step: "阶梯",
  smooth: "平滑",
} satisfies Record<ColormapInterpolation, string>

const INTERPOLATION_MODES_EN = {
  linear: "Linear",
  step: "Step",
  smooth: "Smooth",
} satisfies Record<ColormapInterpolation, string>

const COLOR_SPACE_MODES = {
  oklch: "OKLCH",
  srgb: "sRGB",
  hsl: "HSL",
} satisfies Record<ColormapColorSpace, string>

export type CustomColormapDialogLabels = {
  readonly title: string
  readonly description: string
  readonly edit: string
  readonly close?: string
  readonly cancel: string
  readonly apply: string
  readonly presetNames?: Readonly<Record<string, string>>
  readonly summary: (
    stops: number,
    interpolation: ColormapInterpolation,
    colorSpace: ColormapColorSpace,
  ) => string
  readonly editor: CustomColormapLabels
}

export const CUSTOM_COLORMAP_LABELS_ZH_CN: CustomColormapDialogLabels = {
  title: "自定义配色方案",
  description: "编辑色停、插值方式与色彩空间。预览会实时反映到地图样式。",
  edit: "编辑配色",
  close: "关闭",
  cancel: "取消",
  apply: "应用",
  presetNames: {
    bgr: "蓝-米-橙",
    terrain: "地形",
    diverging: "发散",
    ndvi: "NDVI",
  },
  summary: (stops, interpolation, colorSpace) =>
    `${stops} 个色停 · ${INTERPOLATION_MODES_ZH_CN[interpolation]} · ${COLOR_SPACE_MODES[colorSpace]}`,
  editor: {
    stops: "色停",
    stopsUnit: "个",
    addStop: "添加色停",
    removeStop: "删除色停",
    interpolation: "插值方式",
    interpolationModes: INTERPOLATION_MODES_ZH_CN,
    colorSpace: "色彩空间",
    colorSpaceHint: "OKLCH 在感知上更均匀",
    colorSpaceModes: COLOR_SPACE_MODES,
    importPreset: "从预设导入",
    importHint: "点击套用",
  },
}

export const CUSTOM_COLORMAP_LABELS_EN: CustomColormapDialogLabels = {
  title: "Custom colormap",
  description:
    "Edit color stops, interpolation, and color space. The preview updates in real time.",
  edit: "Edit colormap",
  close: "Close",
  cancel: "Cancel",
  apply: "Apply",
  presetNames: {
    bgr: "Blue–Cream–Orange",
    terrain: "Terrain",
    diverging: "Diverging",
    ndvi: "NDVI",
  },
  summary: (stops, interpolation, colorSpace) =>
    `${stops} stops · ${INTERPOLATION_MODES_EN[interpolation]} · ${COLOR_SPACE_MODES[colorSpace]}`,
  editor: {
    stops: "Stops",
    stopsUnit: "stops",
    addStop: "Add stop",
    removeStop: "Remove stop",
    interpolation: "Interpolation",
    interpolationModes: INTERPOLATION_MODES_EN,
    colorSpace: "Color space",
    colorSpaceHint: "OKLCH is more perceptually uniform",
    colorSpaceModes: COLOR_SPACE_MODES,
    importPreset: "Import preset",
    importHint: "Click to apply",
  },
}
