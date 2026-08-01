import { ProcessingTimeline, type TimelineStep } from "@registry/blocks/processing-timeline"
import { Button } from "@registry/ui/button"
import { IconCheck, IconCloudUp, IconUpload, IconX } from "@tabler/icons-react"
import { useState } from "react"

export type ProcessingTimelineDemoLabels = {
  readonly copy: string
  readonly log: string
  readonly advance: string
  readonly copied: string
  readonly status: string
  readonly done: string
  readonly retryOne: string
  readonly upload: string
  readonly uploadDuration: string
  readonly uploadEventTitle: string
  readonly uploadEventText: string
  readonly ingest: string
  readonly ingestDuration: string
  readonly ingestAttemptOneTitle: string
  readonly ingestAttemptOneError: string
  readonly ingestAttemptOneHint: string
  readonly ingestAttemptTwoTitle: string
  readonly ingestAttemptTwoText: string
  readonly publish: string
  readonly publishDuration: string
  readonly publishEventTitle: string
  readonly processing: string
  readonly processingMessage: string
}

function createCompleteSteps(labels: ProcessingTimelineDemoLabels): TimelineStep[] {
  return [
    {
      key: "upload",
      label: labels.upload,
      state: "done",
      status: labels.done,
      time: "09:14:02",
      duration: labels.uploadDuration,
      events: [
        {
          icon: <IconUpload size={14} stroke={1.5} />,
          title: labels.uploadEventTitle,
          text: labels.uploadEventText,
          time: "09:14:02",
        },
      ],
    },
    {
      key: "ingest",
      label: labels.ingest,
      state: "done",
      status: labels.done,
      retry: labels.retryOne,
      time: "09:14:21",
      duration: labels.ingestDuration,
      events: [
        {
          tone: "error",
          icon: <IconX size={14} stroke={1.5} />,
          title: labels.ingestAttemptOneTitle,
          errorText: labels.ingestAttemptOneError,
          hint: labels.ingestAttemptOneHint,
          time: "09:15:08",
          log: labels.ingestAttemptOneError,
        },
        {
          icon: <IconCheck size={14} stroke={1.5} className="text-primary" />,
          title: labels.ingestAttemptTwoTitle,
          text: labels.ingestAttemptTwoText,
          time: "09:17:08",
        },
      ],
    },
    {
      key: "publish",
      label: labels.publish,
      state: "done",
      status: labels.done,
      time: "09:17:14",
      duration: labels.publishDuration,
      events: [
        {
          icon: <IconCloudUp size={14} stroke={1.5} />,
          title: labels.publishEventTitle,
          text: "raster.rrk2hbpzqxwvltcm8s4yfpg7",
          time: "09:17:14",
        },
      ],
    },
  ]
}

export const zhProcessingTimelineLabels = {
  copy: "复制",
  log: "日志",
  advance: "推进进度",
  copied: "已复制日志",
  status: "进度",
  done: "已完成",
  retryOne: "重试 1 次",
  upload: "上传",
  uploadDuration: "18.6 秒",
  uploadEventTitle: "已接收 DEM2024_SRTM30.tif",
  uploadEventText: "27/27 分片 · GeoTIFF · 校验通过",
  ingest: "入库 · COG 转换",
  ingestDuration: "2 分 47 秒",
  ingestAttemptOneTitle: "第 1 次尝试 · 内存限制",
  ingestAttemptOneError: "OOMKilled: gdal_translate 退出码 137",
  ingestAttemptOneHint: "已切换到 8 GB worker 重试。",
  ingestAttemptTwoTitle: "第 2 次尝试 · COG 就绪",
  ingestAttemptTwoText: "DEFLATE · 块 512x512 · 256.4 MB",
  publish: "发布",
  publishDuration: "6.2 秒",
  publishEventTitle: "已注册栅格源",
  processing: "处理栅格数据",
  processingMessage: "正在重投影栅格并写入 Cloud-Optimized GeoTIFF",
} satisfies ProcessingTimelineDemoLabels

export const enProcessingTimelineLabels = {
  copy: "Copy",
  log: "Log",
  advance: "Advance progress",
  copied: "Copied log",
  status: "Progress",
  done: "Done",
  retryOne: "Retry 1",
  upload: "Upload",
  uploadDuration: "18.6 s",
  uploadEventTitle: "Received DEM2024_SRTM30.tif",
  uploadEventText: "27/27 chunks · GeoTIFF · checksum passed",
  ingest: "Ingest · COG conversion",
  ingestDuration: "2 m 47 s",
  ingestAttemptOneTitle: "Attempt #1 · memory limit",
  ingestAttemptOneError: "OOMKilled: gdal_translate exited 137",
  ingestAttemptOneHint: "Retried on an 8 GB worker.",
  ingestAttemptTwoTitle: "Attempt #2 · COG ready",
  ingestAttemptTwoText: "DEFLATE · block 512x512 · 256.4 MB",
  publish: "Publish",
  publishDuration: "6.2 s",
  publishEventTitle: "Registered raster source",
  processing: "Process raster data",
  processingMessage: "Reprojecting raster and writing Cloud-Optimized GeoTIFF",
} satisfies ProcessingTimelineDemoLabels

export function ProcessingTimelineDemo({
  labels,
}: {
  readonly labels: ProcessingTimelineDemoLabels
}) {
  const [percent, setPercent] = useState(42)
  const [status, setStatus] = useState(`${labels.status}: 42%`)
  const completeSteps = createCompleteSteps(labels)
  const processingSteps: TimelineStep[] = [
    {
      key: "upload",
      label: labels.upload,
      state: "done",
      status: labels.done,
      time: "09:14:02",
      duration: labels.uploadDuration,
      events: [],
    },
    {
      key: "processing",
      label: labels.processing,
      state: "active",
      progressKind: "percent",
      percent,
      message: labels.processingMessage,
      events: [],
    },
  ]

  function advanceProgress() {
    const next = percent >= 100 ? 0 : Math.min(100, percent + 13)
    setPercent(next)
    setStatus(`${labels.status}: ${next}%`)
  }

  return (
    <div data-demo="processing-timeline" className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="processing-timeline-advance"
          onClick={advanceProgress}
        >
          {labels.advance}
        </Button>
        <span
          data-demo-status="processing-timeline"
          className="font-mono text-xs text-muted-foreground"
        >
          {status}
        </span>
      </div>
      <div className="border border-border p-4">
        <ProcessingTimeline steps={processingSteps} labels={labels} />
      </div>
      <div className="border border-border p-4">
        <ProcessingTimeline
          steps={completeSteps}
          labels={labels}
          onCopyLog={() => setStatus(labels.copied)}
        />
      </div>
    </div>
  )
}
