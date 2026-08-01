import { type ResourceDetail, ResourceDetailDrawer } from "@registry/blocks/resource-detail-drawer"
import { Button } from "@registry/ui/button"
import { useState } from "react"

export type ResourceDetailDrawerDemoLabels = {
  readonly iconDetail: string
  readonly spriteDetail: string
  readonly fontDetail: string
  readonly copied: string
  readonly downloaded: string
  readonly editSprite: string
  readonly sliced: string
  readonly closed: string
}

export const zhResourceDetailDrawerLabels = {
  iconDetail: "图标详情",
  spriteDetail: "雪碧图详情",
  fontDetail: "字体详情",
  copied: "已复制 SVG",
  downloaded: "已下载资源",
  editSprite: "已进入雪碧图编辑",
  sliced: "已执行切片",
  closed: "已关闭",
} satisfies ResourceDetailDrawerDemoLabels

export const enResourceDetailDrawerLabels = {
  iconDetail: "Icon detail",
  spriteDetail: "Sprite detail",
  fontDetail: "Font detail",
  copied: "Copied SVG",
  downloaded: "Downloaded resource",
  editSprite: "Opened sprite editor",
  sliced: "Ran font slice",
  closed: "Closed",
} satisfies ResourceDetailDrawerDemoLabels

type DetailOption = {
  readonly label: string
  readonly detail: ResourceDetail
}

function createDetails(labels: ResourceDetailDrawerDemoLabels): readonly DetailOption[] {
  return [
    {
      label: labels.iconDetail,
      detail: {
        kind: "icon",
        title: "Search",
        subtitle: "icon-basic-01.svg",
        seed: "g_basic-0",
        rows: [
          { k: "Group", v: "Basic operations" },
          { k: "ViewBox", v: "24 x 24" },
          { k: "Size", v: "412 B" },
          { k: "Updated", v: "2026/4/14" },
        ],
        tagsTitle: "Tags",
        tags: ["search", "find", "query", "common"],
        sizesTitle: "Size previews",
        sizes: [16, 24, 32, 48],
        copyLabel: "Copy SVG",
        downloadLabel: "Download",
      },
    },
    {
      label: labels.spriteDetail,
      detail: {
        kind: "sprite",
        title: "basic-icons-32",
        subtitle: "32 icons · 32x32",
        previewSeeds: Array.from({ length: 32 }, (_, index) => `sp_basic-${index}`),
        cols: 8,
        sourceTitle: "Sources",
        sources: [{ label: "Basic operations", tag: "linked" }],
        infoTitle: "Info",
        infoRows: [
          { k: "Cell size", v: "32x32" },
          { k: "Output", v: "256x256" },
          { k: "Size", v: "18 KB" },
          { k: "Status", v: "Published" },
        ],
        filesTitle: "Output files",
        files: [
          { name: "basic-icons-32.png", desc: "1x raster" },
          { name: "basic-icons-32@2x.png", desc: "2x raster" },
          { name: "basic-icons-32.json", desc: "Coordinate map" },
        ],
        editLabel: "Edit",
        downloadLabel: "Download ZIP",
      },
    },
    {
      label: labels.fontDetail,
      detail: {
        kind: "font",
        title: "PingFang CN",
        subtitle: "pingfang-cn.woff2",
        family: "cjk",
        specimen: "Aa 永",
        rows: [
          { k: "Class", v: "CJK" },
          { k: "Weight", v: "400 / 500" },
          { k: "Glyphs", v: "12,238" },
          { k: "Raw size", v: "8.4 MB" },
          { k: "Status", v: "Sliced" },
        ],
        sampleTitle: "Sample",
        sample: "城市规划用地分析与可视化呈现",
        slicing: {
          configureLabel: "Configure slice",
          downloadLabel: "Download",
          panelTitle: "Slice config",
          collapseLabel: "Collapse",
          cancelLabel: "Cancel",
          runLabel: "Run slice",
          customTitle: "Custom characters",
          customPlaceholder: "Paste characters to keep...",
          rawSizeLabel: "Raw size",
          rawSizeValue: "8.4 MB",
          estimateLabel: "Slice estimate",
          selectedLabel: "Selected glyphs",
          charsets: [
            {
              id: "cs_latin",
              name: "Latin basic",
              range: "U+0020-007F",
              glyphs: 96,
              size: "8 KB",
            },
            {
              id: "cs_cjk_basic",
              name: "CJK common",
              range: "U+4E00-9FFF",
              glyphs: 6763,
              size: "1.8 MB",
            },
            {
              id: "cs_cjk_ext",
              name: "CJK extension A",
              range: "U+3400-4DBF",
              glyphs: 6592,
              size: "1.6 MB",
            },
          ],
          defaultSelected: ["cs_latin", "cs_cjk_basic"],
        },
      },
    },
  ]
}

export function ResourceDetailDrawerDemo({
  labels,
}: {
  readonly labels: ResourceDetailDrawerDemoLabels
}) {
  const details = createDetails(labels)
  const [detail, setDetail] = useState<ResourceDetail | null>(null)
  const [status, setStatus] = useState(labels.closed)

  return (
    <div data-demo="resource-detail-drawer" className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {details.map((option) => (
          <Button
            key={option.label}
            type="button"
            variant="outline"
            size="sm"
            data-demo-action={`resource-detail-drawer-${option.detail.kind}`}
            onClick={() => {
              setDetail(option.detail)
              setStatus(option.label)
            }}
          >
            {option.label}
          </Button>
        ))}
        <span
          data-demo-status="resource-detail-drawer"
          className="self-center font-mono text-xs text-muted-foreground"
        >
          {status}
        </span>
      </div>
      <div className="min-h-[260px] border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
        {detail?.subtitle}
      </div>
      {detail ? (
        <ResourceDetailDrawer
          detail={detail}
          onClose={() => {
            setDetail(null)
            setStatus(labels.closed)
          }}
          onCopy={() => setStatus(labels.copied)}
          onDownload={() => setStatus(labels.downloaded)}
          onEditSprite={() => setStatus(labels.editSprite)}
          onRunSlice={(selected, customChars) =>
            setStatus(`${labels.sliced}: ${selected.length}/${customChars.length}`)
          }
        />
      ) : null}
    </div>
  )
}
