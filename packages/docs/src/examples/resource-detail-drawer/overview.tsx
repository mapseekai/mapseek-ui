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
  readonly iconTitle: string
  readonly iconSubtitle: string
  readonly rowGroup: string
  readonly rowViewBox: string
  readonly rowSize: string
  readonly rowUpdated: string
  readonly rowGroupBasic: string
  readonly tagsTitle: string
  readonly iconTags: string[]
  readonly sizesTitle: string
  readonly copySvg: string
  readonly download: string
  readonly spriteTitle: string
  readonly spriteSubtitle: string
  readonly sourceTitle: string
  readonly sourceBasic: string
  readonly sourceLinked: string
  readonly infoTitle: string
  readonly rowCellSize: string
  readonly rowOutput: string
  readonly rowStatus: string
  readonly statusPublished: string
  readonly filesTitle: string
  readonly fileOneX: string
  readonly fileTwoX: string
  readonly fileCoordinateMap: string
  readonly edit: string
  readonly downloadZip: string
  readonly fontTitle: string
  readonly fontSubtitle: string
  readonly rowClass: string
  readonly rowWeight: string
  readonly rowGlyphs: string
  readonly rowRawSize: string
  readonly statusSliced: string
  readonly sampleTitle: string
  readonly sample: string
  readonly configureSlice: string
  readonly slicePanelTitle: string
  readonly collapse: string
  readonly cancel: string
  readonly runSlice: string
  readonly customCharacters: string
  readonly customPlaceholder: string
  readonly sliceEstimate: string
  readonly selectedGlyphs: string
  readonly charsetLatin: string
  readonly charsetCjkCommon: string
  readonly charsetCjkExtensionA: string
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
  iconTitle: "搜索",
  iconSubtitle: "icon-basic-01.svg",
  rowGroup: "分组",
  rowViewBox: "ViewBox",
  rowSize: "大小",
  rowUpdated: "更新于",
  rowGroupBasic: "基础操作",
  tagsTitle: "标签",
  iconTags: ["搜索", "查找", "查询", "通用"],
  sizesTitle: "尺寸预览",
  copySvg: "复制 SVG",
  download: "下载",
  spriteTitle: "basic-icons-32",
  spriteSubtitle: "32 个图标 · 32x32",
  sourceTitle: "来源",
  sourceBasic: "基础操作",
  sourceLinked: "已关联",
  infoTitle: "信息",
  rowCellSize: "单元尺寸",
  rowOutput: "输出",
  rowStatus: "状态",
  statusPublished: "已发布",
  filesTitle: "输出文件",
  fileOneX: "1x 栅格",
  fileTwoX: "2x 栅格",
  fileCoordinateMap: "坐标映射",
  edit: "编辑",
  downloadZip: "下载 ZIP",
  fontTitle: "苹方中文",
  fontSubtitle: "pingfang-cn.woff2",
  rowClass: "分类",
  rowWeight: "字重",
  rowGlyphs: "字形",
  rowRawSize: "原始大小",
  statusSliced: "已切片",
  sampleTitle: "示例",
  sample: "城市规划用地分析与可视化呈现",
  configureSlice: "配置切片",
  slicePanelTitle: "切片配置",
  collapse: "收起",
  cancel: "取消",
  runSlice: "执行切片",
  customCharacters: "自定义字符",
  customPlaceholder: "粘贴需要保留的字符...",
  sliceEstimate: "切片估算",
  selectedGlyphs: "已选字形",
  charsetLatin: "基础拉丁",
  charsetCjkCommon: "常用中文",
  charsetCjkExtensionA: "中日韩扩展 A",
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
  iconTitle: "Search",
  iconSubtitle: "icon-basic-01.svg",
  rowGroup: "Group",
  rowViewBox: "ViewBox",
  rowSize: "Size",
  rowUpdated: "Updated",
  rowGroupBasic: "Basic operations",
  tagsTitle: "Tags",
  iconTags: ["search", "find", "query", "common"],
  sizesTitle: "Size previews",
  copySvg: "Copy SVG",
  download: "Download",
  spriteTitle: "basic-icons-32",
  spriteSubtitle: "32 icons · 32x32",
  sourceTitle: "Sources",
  sourceBasic: "Basic operations",
  sourceLinked: "linked",
  infoTitle: "Info",
  rowCellSize: "Cell size",
  rowOutput: "Output",
  rowStatus: "Status",
  statusPublished: "Published",
  filesTitle: "Output files",
  fileOneX: "1x raster",
  fileTwoX: "2x raster",
  fileCoordinateMap: "Coordinate map",
  edit: "Edit",
  downloadZip: "Download ZIP",
  fontTitle: "PingFang CN",
  fontSubtitle: "pingfang-cn.woff2",
  rowClass: "Class",
  rowWeight: "Weight",
  rowGlyphs: "Glyphs",
  rowRawSize: "Raw size",
  statusSliced: "Sliced",
  sampleTitle: "Sample",
  sample: "Urban planning land-use analysis and visualization",
  configureSlice: "Configure slice",
  slicePanelTitle: "Slice config",
  collapse: "Collapse",
  cancel: "Cancel",
  runSlice: "Run slice",
  customCharacters: "Custom characters",
  customPlaceholder: "Paste characters to keep...",
  sliceEstimate: "Slice estimate",
  selectedGlyphs: "Selected glyphs",
  charsetLatin: "Latin basic",
  charsetCjkCommon: "CJK common",
  charsetCjkExtensionA: "CJK extension A",
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
        title: labels.iconTitle,
        subtitle: labels.iconSubtitle,
        seed: "g_basic-0",
        rows: [
          { k: labels.rowGroup, v: labels.rowGroupBasic },
          { k: labels.rowViewBox, v: "24 x 24" },
          { k: labels.rowSize, v: "412 B" },
          { k: labels.rowUpdated, v: "2026/4/14" },
        ],
        tagsTitle: labels.tagsTitle,
        tags: labels.iconTags,
        sizesTitle: labels.sizesTitle,
        sizes: [16, 24, 32, 48],
        copyLabel: labels.copySvg,
        downloadLabel: labels.download,
      },
    },
    {
      label: labels.spriteDetail,
      detail: {
        kind: "sprite",
        title: labels.spriteTitle,
        subtitle: labels.spriteSubtitle,
        previewSeeds: Array.from({ length: 32 }, (_, index) => `sp_basic-${index}`),
        cols: 8,
        sourceTitle: labels.sourceTitle,
        sources: [{ label: labels.sourceBasic, tag: labels.sourceLinked }],
        infoTitle: labels.infoTitle,
        infoRows: [
          { k: labels.rowCellSize, v: "32x32" },
          { k: labels.rowOutput, v: "256x256" },
          { k: labels.rowSize, v: "18 KB" },
          { k: labels.rowStatus, v: labels.statusPublished },
        ],
        filesTitle: labels.filesTitle,
        files: [
          { name: "basic-icons-32.png", desc: labels.fileOneX },
          { name: "basic-icons-32@2x.png", desc: labels.fileTwoX },
          { name: "basic-icons-32.json", desc: labels.fileCoordinateMap },
        ],
        editLabel: labels.edit,
        downloadLabel: labels.downloadZip,
      },
    },
    {
      label: labels.fontDetail,
      detail: {
        kind: "font",
        title: labels.fontTitle,
        subtitle: labels.fontSubtitle,
        family: "cjk",
        specimen: "Aa 永",
        rows: [
          { k: labels.rowClass, v: "CJK" },
          { k: labels.rowWeight, v: "400 / 500" },
          { k: labels.rowGlyphs, v: "12,238" },
          { k: labels.rowRawSize, v: "8.4 MB" },
          { k: labels.rowStatus, v: labels.statusSliced },
        ],
        sampleTitle: labels.sampleTitle,
        sample: labels.sample,
        slicing: {
          configureLabel: labels.configureSlice,
          downloadLabel: labels.download,
          panelTitle: labels.slicePanelTitle,
          collapseLabel: labels.collapse,
          cancelLabel: labels.cancel,
          runLabel: labels.runSlice,
          customTitle: labels.customCharacters,
          customPlaceholder: labels.customPlaceholder,
          rawSizeLabel: labels.rowRawSize,
          rawSizeValue: "8.4 MB",
          estimateLabel: labels.sliceEstimate,
          selectedLabel: labels.selectedGlyphs,
          charsets: [
            {
              id: "cs_latin",
              name: labels.charsetLatin,
              range: "U+0020-007F",
              glyphs: 96,
              size: "8 KB",
            },
            {
              id: "cs_cjk_basic",
              name: labels.charsetCjkCommon,
              range: "U+4E00-9FFF",
              glyphs: 6763,
              size: "1.8 MB",
            },
            {
              id: "cs_cjk_ext",
              name: labels.charsetCjkExtensionA,
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
