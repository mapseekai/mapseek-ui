import {
  type LinkedRefGroup,
  type LinkedRefKind,
  LinkedRefList,
} from "@registry/blocks/linked-ref-list"
import { IconDatabase, IconMap2, IconRoute } from "@tabler/icons-react"
import type { ReactNode } from "react"
import type { LocalizedDemoProps } from "./types"

const kindIcons: Record<LinkedRefKind, ReactNode> = {
  dataset: <IconDatabase size={16} stroke={1.5} className="text-cat-1" />,
  mapset: <IconMap2 size={16} stroke={1.5} className="text-cat-2" />,
  workflow: <IconRoute size={16} stroke={1.5} className="text-cat-5" />,
}

const labels = {
  "zh-CN": {
    openLabel: "待接入",
    groups: [
      {
        key: "datasets",
        kind: "dataset",
        title: "数据集",
        count: 3,
        summaryLabel: "3 个引用",
        summary: "派生或关联的数据集",
        items: [
          {
            key: "ndvi",
            name: "NDVI 植被指数 2026Q2",
            subtitle: "栅格 · 派生",
            id: "dataset.a83f-91c2",
            time: "2026/5/12 11:24",
            status: { label: "活跃", tone: "active" },
          },
          {
            key: "rgb",
            name: "真彩色 RGB 合成",
            subtitle: "栅格 · 合成",
            id: "dataset.c41a-3f88",
            time: "2026/5/11 16:48",
            status: { label: "活跃", tone: "active" },
          },
        ],
      },
      {
        key: "mapsets",
        kind: "mapset",
        title: "地图集",
        count: 2,
        summaryLabel: "2 张地图",
        summary: "将此栅格作为图层加载的地图",
        items: [
          {
            key: "city",
            name: "城市绿地监测",
            subtitle: "地图集 · 图层",
            id: "mapset.18bd-44f0",
            time: "2026/5/10 09:02",
            status: { label: "活跃", tone: "active" },
          },
          {
            key: "watershed",
            name: "流域分析地图",
            subtitle: "地图集 · 图层",
            id: "mapset.2c7e-9a10",
            time: "2026/5/06 14:37",
            status: { label: "就绪", tone: "ready" },
          },
        ],
      },
      {
        key: "workflows",
        kind: "workflow",
        title: "工作流",
        count: 4,
        summaryLabel: "4 条管线",
        summary: "将此栅格作为输入的处理管线",
        items: [
          {
            key: "ingest",
            name: "栅格预处理",
            subtitle: "管线 · 输入",
            id: "workflow.5f01-72cd",
            time: "2026/5/12 08:00",
            status: { label: "就绪", tone: "ready" },
          },
          {
            key: "infer",
            name: "建筑物提取推理",
            subtitle: "管线 · 失败",
            id: "workflow.7c20-ed59",
            time: "2026/4/27 23:58",
            status: { label: "失败", tone: "failed" },
          },
        ],
      },
    ],
  },
  en: {
    openLabel: "Open action pending",
    groups: [
      {
        key: "datasets",
        kind: "dataset",
        title: "Datasets",
        count: 3,
        summaryLabel: "3 refs",
        summary: "Derived or associated datasets",
        items: [
          {
            key: "ndvi",
            name: "NDVI vegetation index 2026Q2",
            subtitle: "Raster · derived",
            id: "dataset.a83f-91c2",
            time: "2026/5/12 11:24",
            status: { label: "Active", tone: "active" },
          },
          {
            key: "rgb",
            name: "True color RGB composite",
            subtitle: "Raster · composite",
            id: "dataset.c41a-3f88",
            time: "2026/5/11 16:48",
            status: { label: "Active", tone: "active" },
          },
        ],
      },
      {
        key: "mapsets",
        kind: "mapset",
        title: "Mapsets",
        count: 2,
        summaryLabel: "2 maps",
        summary: "Maps loading this raster as a layer",
        items: [
          {
            key: "city",
            name: "Urban green-space monitor",
            subtitle: "Mapset · layer",
            id: "mapset.18bd-44f0",
            time: "2026/5/10 09:02",
            status: { label: "Active", tone: "active" },
          },
          {
            key: "watershed",
            name: "Watershed analysis map",
            subtitle: "Mapset · layer",
            id: "mapset.2c7e-9a10",
            time: "2026/5/06 14:37",
            status: { label: "Ready", tone: "ready" },
          },
        ],
      },
      {
        key: "workflows",
        kind: "workflow",
        title: "Workflows",
        count: 4,
        summaryLabel: "4 pipelines",
        summary: "Pipelines using this raster as input",
        items: [
          {
            key: "ingest",
            name: "Raster preprocessing",
            subtitle: "Pipeline · input",
            id: "workflow.5f01-72cd",
            time: "2026/5/12 08:00",
            status: { label: "Ready", tone: "ready" },
          },
          {
            key: "infer",
            name: "Building extraction inference",
            subtitle: "Pipeline · failed",
            id: "workflow.7c20-ed59",
            time: "2026/4/27 23:58",
            status: { label: "Failed", tone: "failed" },
          },
        ],
      },
    ],
  },
}

export function LinkedRefListDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  return (
    <div className="border border-border bg-background p-3">
      <LinkedRefList
        groups={demoLabels.groups as unknown as LinkedRefGroup[]}
        kindIcons={kindIcons}
        openLabel={demoLabels.openLabel}
      />
    </div>
  )
}
