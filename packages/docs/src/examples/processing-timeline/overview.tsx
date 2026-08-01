import { ProcessingTimeline, type TimelineStep } from "@registry/blocks/processing-timeline"
import { Button } from "@registry/ui/button"
import { IconCheck, IconCloudUp, IconUpload, IconX } from "@tabler/icons-react"
import { useState } from "react"

const completeSteps: TimelineStep[] = [
  {
    key: "upload",
    label: "Upload",
    state: "done",
    status: "Done",
    time: "09:14:02",
    duration: "18.6 s",
    events: [
      {
        icon: <IconUpload size={14} stroke={1.5} />,
        title: "Received DEM2024_SRTM30.tif",
        text: "27/27 chunks · GeoTIFF · checksum passed",
        time: "09:14:02",
      },
    ],
  },
  {
    key: "ingest",
    label: "Ingest · COG conversion",
    state: "done",
    status: "Done",
    retry: "Retry 1",
    time: "09:14:21",
    duration: "2 m 47 s",
    events: [
      {
        tone: "error",
        icon: <IconX size={14} stroke={1.5} />,
        title: "Attempt #1 · memory limit",
        errorText: "OOMKilled: gdal_translate exited 137",
        hint: "Retried on an 8 GB worker.",
        time: "09:15:08",
        log: "OOMKilled: gdal_translate exited 137",
      },
      {
        icon: <IconCheck size={14} stroke={1.5} className="text-primary" />,
        title: "Attempt #2 · COG ready",
        text: "DEFLATE · block 512x512 · 256.4 MB",
        time: "09:17:08",
      },
    ],
  },
  {
    key: "publish",
    label: "Publish",
    state: "done",
    status: "Done",
    time: "09:17:14",
    duration: "6.2 s",
    events: [
      {
        icon: <IconCloudUp size={14} stroke={1.5} />,
        title: "Registered raster source",
        text: "raster.rrk2hbpzqxwvltcm8s4yfpg7",
        time: "09:17:14",
      },
    ],
  },
]

export const zhProcessingTimelineLabels = {
  copy: "复制",
  log: "日志",
  advance: "推进进度",
  copied: "已复制日志",
  status: "进度",
}

export const enProcessingTimelineLabels = {
  copy: "Copy",
  log: "Log",
  advance: "Advance progress",
  copied: "Copied log",
  status: "Progress",
}

export function ProcessingTimelineDemo({
  labels,
}: {
  readonly labels: typeof zhProcessingTimelineLabels
}) {
  const [percent, setPercent] = useState(42)
  const [status, setStatus] = useState(`${labels.status}: 42%`)
  const processingSteps: TimelineStep[] = [
    {
      key: "upload",
      label: "Upload",
      state: "done",
      status: "Done",
      time: "09:14:02",
      duration: "18.6 s",
      events: [],
    },
    {
      key: "processing",
      label: "Process raster data",
      state: "active",
      progressKind: "percent",
      percent,
      message: "Reprojecting raster and writing Cloud-Optimized GeoTIFF",
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
