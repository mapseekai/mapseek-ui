import { Button } from "@registry/ui/button"
import { toast } from "@registry/ui/toast"

import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    types: "消息类型",
    typesDescription: "Base UI Toast 从页面右下角堆叠显示。",
    success: "成功",
    info: "信息",
    warning: "警告",
    error: "错误",
    loading: "加载中",
    descriptionAndAction: "描述与操作",
    description: "显示描述",
    action: "显示操作",
    uploadComplete: "数据集上传成功。",
    processing: "正在后台处理。",
    mismatch: "检测到坐标系不一致。",
    uploadFailed: "上传失败：文件过大。",
    loadingLayers: "正在加载图层…",
    layerSaved: "图层已保存",
    layerSavedDescription: "road_network.topojson · EPSG:4326",
    retryUpload: "重新上传",
    retryDescription: "文件大小超过 500 MB 限制。",
    retry: "重试",
    retryQueued: "已加入重试队列。",
  },
  en: {
    types: "Toast types",
    typesDescription: "Base UI Toast messages stack at the bottom right of the page.",
    success: "Success",
    info: "Info",
    warning: "Warning",
    error: "Error",
    loading: "Loading",
    descriptionAndAction: "Description and action",
    description: "Show description",
    action: "Show action",
    uploadComplete: "Dataset uploaded successfully.",
    processing: "Processing in the background.",
    mismatch: "CRS mismatch detected.",
    uploadFailed: "Upload failed: file too large.",
    loadingLayers: "Loading layers…",
    layerSaved: "Layer saved",
    layerSavedDescription: "road_network.topojson · EPSG:4326",
    retryUpload: "Retry upload",
    retryDescription: "File size exceeds the 500 MB limit.",
    retry: "Retry",
    retryQueued: "Retry queued.",
  },
}

export function ToastOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <div className="grid gap-8">
      <section className="space-y-3" data-demo="toast-types">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.types}
        </h4>
        <p className="text-xs text-muted-foreground">{demoLabels.typesDescription}</p>
        <div className="flex flex-wrap gap-3">
          <Button
            data-demo="toast-success"
            variant="outline"
            size="sm"
            onClick={() => toast.add({ title: demoLabels.uploadComplete, type: "success" })}
          >
            {demoLabels.success}
          </Button>
          <Button
            data-demo="toast-info"
            variant="outline"
            size="sm"
            onClick={() => toast.add({ title: demoLabels.processing, type: "info" })}
          >
            {demoLabels.info}
          </Button>
          <Button
            data-demo="toast-warning"
            variant="outline"
            size="sm"
            onClick={() => toast.add({ title: demoLabels.mismatch, type: "warning" })}
          >
            {demoLabels.warning}
          </Button>
          <Button
            data-demo="toast-error"
            variant="outline"
            size="sm"
            onClick={() => toast.add({ title: demoLabels.uploadFailed, type: "error" })}
          >
            {demoLabels.error}
          </Button>
          <Button
            data-demo="toast-loading"
            variant="outline"
            size="sm"
            onClick={() =>
              toast.add({ title: demoLabels.loadingLayers, type: "loading", timeout: 0 })
            }
          >
            {demoLabels.loading}
          </Button>
        </div>
      </section>

      <section className="space-y-3" data-demo="toast-rich">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.descriptionAndAction}
        </h4>
        <div className="flex flex-wrap gap-3">
          <Button
            data-demo="toast-description"
            variant="outline"
            size="sm"
            onClick={() =>
              toast.add({
                title: demoLabels.layerSaved,
                description: demoLabels.layerSavedDescription,
                type: "success",
              })
            }
          >
            {demoLabels.description}
          </Button>
          <Button
            data-demo="toast-action"
            variant="outline"
            size="sm"
            onClick={() =>
              toast.add({
                title: demoLabels.retryUpload,
                description: demoLabels.retryDescription,
                type: "error",
                actionProps: {
                  children: demoLabels.retry,
                  onClick: () => toast.add({ title: demoLabels.retryQueued, type: "info" }),
                },
              })
            }
          >
            {demoLabels.action}
          </Button>
        </div>
      </section>
    </div>
  )
}
