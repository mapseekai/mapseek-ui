import type { ServiceStatusLabels } from "./labels"

export const DEFAULT_SERVICE_STATUS_LABELS = {
  running: "服务运行中",
  stopped: "服务已停止",
} satisfies ServiceStatusLabels
