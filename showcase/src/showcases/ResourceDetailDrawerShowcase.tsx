import {
  type ResourceDetail,
  ResourceDetailDrawer,
  type ResourceDetailDrawerState,
} from "@registry/blocks/resource-detail-drawer"
import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    iconDetail: "图标详情",
    spriteDetail: "雪碧图详情",
    fontDetail: "字体详情",
    copied: "已复制 SVG",
    downloaded: "已下载资源",
    editSprite: "已进入雪碧图编辑",
    sliced: "已执行切片",
    closed: "已关闭",
    loading: "加载中",
    loadingDescription: "正在读取资源元数据。",
    empty: "暂无可查看的资源",
    emptyDescription: "请选择一个资源以查看详情。",
    error: "无法加载资源详情",
    errorDescription: "请稍后重试。",
    retry: "重试加载",
    retried: "已重新请求详情",
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
  },
  en: {
    iconDetail: "Icon detail",
    spriteDetail: "Sprite detail",
    fontDetail: "Font detail",
    copied: "Copied SVG",
    downloaded: "Downloaded resource",
    editSprite: "Opened sprite editor",
    sliced: "Ran font slice",
    closed: "Closed",
    loading: "Loading",
    loadingDescription: "Reading resource metadata.",
    empty: "No resource selected",
    emptyDescription: "Select a resource to inspect its details.",
    error: "Unable to load resource details",
    errorDescription: "Try again in a moment.",
    retry: "Retry load",
    retried: "Requested resource details again",
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
  },
}

type DetailOption = {
  readonly label: string
  readonly detail: ResourceDetail
}

function createDetails(demoLabels: (typeof labels)[keyof typeof labels]): readonly DetailOption[] {
  return [
    {
      label: demoLabels.iconDetail,
      detail: {
        kind: "icon",
        title: demoLabels.iconTitle,
        subtitle: demoLabels.iconSubtitle,
        seed: "g_basic-0",
        rows: [
          { k: demoLabels.rowGroup, v: demoLabels.rowGroupBasic },
          { k: demoLabels.rowViewBox, v: "24 x 24" },
          { k: demoLabels.rowSize, v: "412 B" },
          { k: demoLabels.rowUpdated, v: "2026/4/14" },
        ],
        tagsTitle: demoLabels.tagsTitle,
        tags: [...demoLabels.iconTags],
        sizesTitle: demoLabels.sizesTitle,
        sizes: [16, 24, 32, 48],
        copyLabel: demoLabels.copySvg,
        downloadLabel: demoLabels.download,
      },
    },
    {
      label: demoLabels.spriteDetail,
      detail: {
        kind: "sprite",
        title: demoLabels.spriteTitle,
        subtitle: demoLabels.spriteSubtitle,
        previewSeeds: Array.from({ length: 32 }, (_, index) => `sp_basic-${index}`),
        cols: 8,
        sourceTitle: demoLabels.sourceTitle,
        sources: [{ label: demoLabels.sourceBasic, tag: demoLabels.sourceLinked }],
        infoTitle: demoLabels.infoTitle,
        infoRows: [
          { k: demoLabels.rowCellSize, v: "32x32" },
          { k: demoLabels.rowOutput, v: "256x256" },
          { k: demoLabels.rowSize, v: "18 KB" },
          { k: demoLabels.rowStatus, v: demoLabels.statusPublished },
        ],
        filesTitle: demoLabels.filesTitle,
        files: [
          { name: "basic-icons-32.png", desc: demoLabels.fileOneX },
          { name: "basic-icons-32@2x.png", desc: demoLabels.fileTwoX },
          { name: "basic-icons-32.json", desc: demoLabels.fileCoordinateMap },
        ],
        editLabel: demoLabels.edit,
        downloadLabel: demoLabels.downloadZip,
      },
    },
    {
      label: demoLabels.fontDetail,
      detail: {
        kind: "font",
        title: demoLabels.fontTitle,
        subtitle: demoLabels.fontSubtitle,
        family: "cjk",
        specimen: "Aa 永",
        rows: [
          { k: demoLabels.rowClass, v: "CJK" },
          { k: demoLabels.rowWeight, v: "400 / 500" },
          { k: demoLabels.rowGlyphs, v: "12,238" },
          { k: demoLabels.rowRawSize, v: "8.4 MB" },
          { k: demoLabels.rowStatus, v: demoLabels.statusSliced },
        ],
        sampleTitle: demoLabels.sampleTitle,
        sample: demoLabels.sample,
        slicing: {
          configureLabel: demoLabels.configureSlice,
          downloadLabel: demoLabels.download,
          panelTitle: demoLabels.slicePanelTitle,
          collapseLabel: demoLabels.collapse,
          cancelLabel: demoLabels.cancel,
          runLabel: demoLabels.runSlice,
          customTitle: demoLabels.customCharacters,
          customPlaceholder: demoLabels.customPlaceholder,
          rawSizeLabel: demoLabels.rowRawSize,
          rawSizeValue: "8.4 MB",
          estimateLabel: demoLabels.sliceEstimate,
          selectedLabel: demoLabels.selectedGlyphs,
          charsets: [
            {
              id: "cs_latin",
              name: demoLabels.charsetLatin,
              range: "U+0020-007F",
              glyphs: 96,
              size: "8 KB",
            },
            {
              id: "cs_cjk_basic",
              name: demoLabels.charsetCjkCommon,
              range: "U+4E00-9FFF",
              glyphs: 6763,
              size: "1.8 MB",
            },
            {
              id: "cs_cjk_ext",
              name: demoLabels.charsetCjkExtensionA,
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

export function ResourceDetailDrawerDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const details = createDetails(demoLabels)
  const [detail, setDetail] = useState<ResourceDetail | null>(null)
  const [drawerState, setDrawerState] = useState<ResourceDetailDrawerState | null>(null)
  const [status, setStatus] = useState<string>(demoLabels.closed)
  const stateOptions: readonly { label: string; state: ResourceDetailDrawerState }[] = [
    {
      label: demoLabels.loading,
      state: {
        description: demoLabels.loadingDescription,
        kind: "loading",
        title: demoLabels.loading,
      },
    },
    {
      label: demoLabels.empty,
      state: {
        description: demoLabels.emptyDescription,
        kind: "empty",
        title: demoLabels.empty,
      },
    },
    {
      label: demoLabels.error,
      state: {
        description: demoLabels.errorDescription,
        kind: "error",
        retryLabel: demoLabels.retry,
        title: demoLabels.error,
      },
    },
  ]

  return (
    <div className="flex flex-col gap-3">
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
              setDrawerState(null)
              setStatus(option.label)
            }}
          >
            {option.label}
          </Button>
        ))}
        {stateOptions.map((option) => (
          <Button
            key={option.state.kind}
            type="button"
            variant="outline"
            size="sm"
            data-demo-action={`resource-detail-drawer-${option.state.kind}`}
            onClick={() => {
              setDetail(null)
              setDrawerState(option.state)
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
        {detail?.subtitle ?? drawerState?.description}
      </div>
      {(detail || drawerState) && (
        <ResourceDetailDrawer
          detail={detail}
          state={drawerState ?? undefined}
          onClose={() => {
            setDetail(null)
            setDrawerState(null)
            setStatus(demoLabels.closed)
          }}
          onCopy={() => setStatus(demoLabels.copied)}
          onDownload={() => setStatus(demoLabels.downloaded)}
          onEditSprite={() => setStatus(demoLabels.editSprite)}
          onRunSlice={(selected, customChars) =>
            setStatus(`${demoLabels.sliced}: ${selected.length}/${customChars.length}`)
          }
          onRetry={() => setStatus(demoLabels.retried)}
        />
      )}
    </div>
  )
}
