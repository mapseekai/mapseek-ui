import {
  type LinkedRefGroup,
  type LinkedRefKind,
  LinkedRefList,
} from "@registry/blocks/linked-ref-list"
import { IconDatabase, IconMap2, IconRoute } from "@tabler/icons-react"
import type { ReactNode } from "react"

const kindIcons: Record<LinkedRefKind, ReactNode> = {
  dataset: <IconDatabase size={16} stroke={1.5} className="text-cat-1" />,
  mapset: <IconMap2 size={16} stroke={1.5} className="text-cat-2" />,
  workflow: <IconRoute size={16} stroke={1.5} className="text-cat-5" />,
}

const groups: LinkedRefGroup[] = [
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
]

export const zhLinkedRefListLabels = {
  openLabel: "待接入",
}

export const enLinkedRefListLabels = {
  openLabel: "Open action pending",
}

export function LinkedRefListDemo({ labels }: { readonly labels: typeof zhLinkedRefListLabels }) {
  return (
    <div data-demo="linked-ref-list" className="border border-border bg-background p-3">
      <LinkedRefList groups={groups} kindIcons={kindIcons} openLabel={labels.openLabel} />
    </div>
  )
}
