import {
  StyleSourcePickerDialog,
  type StyleSourcePickerLabels,
  type StyleSourcePickerOption,
} from "@registry/blocks/style-source-picker-dialog"
import { Button } from "@registry/ui/button"
import { useState } from "react"

export const zhStyleSourcePickerDialogLabels = {
  open: "打开添加源",
  confirmed: "已添加源",
  cancelled: "已关闭",
  sources: {
    roads: "道路网络",
    dem: "地形 DEM",
    basemap: "底图瓦片",
    imagery: "卫星影像",
  },
  labels: {
    title: "添加源",
    description: "选择一个或多个数据集或瓦片集添加到当前样式源。",
    searchPlaceholder: "搜索名称、路径或 UID...",
    sourceFilterLabel: "来源",
    typeFilterLabel: "类型",
    all: "全部",
    dataset: "数据集",
    tileset: "瓦片集",
    allTypes: "全部类型",
    vector: "矢量",
    raster: "栅格",
    loading: "正在加载源...",
    empty: "没有可用源。",
    retry: "重试",
    selectedCount: (count: number) => `已选择 ${count} 个源`,
    cancel: "取消",
    confirm: "确认",
    confirming: "确认中...",
    alreadyAdded: "已添加",
  } satisfies Partial<StyleSourcePickerLabels>,
}

export const enStyleSourcePickerDialogLabels = {
  open: "Open add source",
  confirmed: "Added sources",
  cancelled: "Closed",
  sources: {
    roads: "Road Network",
    dem: "Terrain DEM",
    basemap: "Basemap Tiles",
    imagery: "Satellite Imagery",
  },
  labels: {
    title: "Add source",
    description: "Select one or more datasets or tilesets to add to the current style sources.",
    searchPlaceholder: "Search by name, path, or UID...",
    sourceFilterLabel: "Source",
    typeFilterLabel: "Type",
    all: "All",
    dataset: "Dataset",
    tileset: "Tileset",
    allTypes: "All types",
    vector: "Vector",
    raster: "Raster",
    loading: "Loading sources...",
    empty: "No available sources.",
    retry: "Retry",
    selectedCount: (count: number) => `Selected ${count} source(s)`,
    cancel: "Cancel",
    confirm: "Confirm",
    confirming: "Confirming...",
    alreadyAdded: "Already added",
  } satisfies Partial<StyleSourcePickerLabels>,
}

function sourceOptions(labels: typeof zhStyleSourcePickerDialogLabels): StyleSourcePickerOption[] {
  return [
    {
      key: "dataset:roads",
      sourceKind: "DATASET",
      sourceUID: "roads-uid",
      sourcePath: "public.roads",
      sourceName: labels.sources.roads,
      sourceType: "vector",
      subtitle: "public.roads",
      status: "READY",
    },
    {
      key: "dataset:dem",
      sourceKind: "DATASET",
      sourceUID: "dem-uid",
      sourcePath: "public.dem",
      sourceName: labels.sources.dem,
      sourceType: "raster",
      subtitle: "public.dem",
      status: "READY",
    },
    {
      key: "tileset:basemap",
      sourceKind: "TILESET",
      sourceUID: "basemap-uid",
      sourceName: labels.sources.basemap,
      sourceType: "vector",
      subtitle: "basemap-uid",
      status: "READY",
    },
    {
      key: "tileset:imagery",
      sourceKind: "TILESET",
      sourceUID: "imagery-uid",
      sourceName: labels.sources.imagery,
      sourceType: "raster",
      subtitle: "imagery-uid",
      status: "READY",
    },
  ]
}

export function StyleSourcePickerDialogDemo({
  labels,
}: {
  readonly labels: typeof zhStyleSourcePickerDialogLabels
}) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(labels.cancelled)

  return (
    <section data-demo="style-source-picker-dialog" className="space-y-3">
      <Button
        type="button"
        variant="outline"
        data-demo-action="style-source-picker-dialog-open"
        onClick={() => setOpen(true)}
      >
        {labels.open}
      </Button>
      <p data-demo-status="style-source-picker-dialog" className="m-0 font-mono text-xs">
        {status}
      </p>
      <StyleSourcePickerDialog
        open={open}
        loading={false}
        confirming={false}
        options={sourceOptions(labels)}
        alreadyAddedKeys={new Set(["tileset:basemap"])}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) setStatus(labels.cancelled)
        }}
        onConfirm={(selectedOptions) => {
          setOpen(false)
          setStatus(
            `${labels.confirmed}: ${selectedOptions.map((option) => option.sourceName).join(", ")}`,
          )
        }}
        labels={labels.labels}
      />
    </section>
  )
}
