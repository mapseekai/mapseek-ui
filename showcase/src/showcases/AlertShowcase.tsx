import { Alert, AlertDescription, AlertTitle } from "@registry/ui/alert"
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    readyTitle: "样式有效",
    readyDescription: "图层样式已通过校验，可以保存并发布。",
    errorTitle: "数据源不可用",
    errorDescription: "请检查服务地址和访问凭据后重试。",
  },
  en: {
    readyTitle: "Style is valid",
    readyDescription: "The layer style passed validation and is ready to publish.",
    errorTitle: "Data source unavailable",
    errorDescription: "Check the service URL and credentials, then try again.",
  },
}

export function AlertOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]

  return (
    <div className="flex max-w-xl flex-col gap-3">
      <Alert data-demo="alert-default">
        <IconCircleCheck />
        <AlertTitle>{demoLabels.readyTitle}</AlertTitle>
        <AlertDescription>{demoLabels.readyDescription}</AlertDescription>
      </Alert>
      <Alert data-demo="alert-destructive" variant="destructive">
        <IconAlertTriangle />
        <AlertTitle>{demoLabels.errorTitle}</AlertTitle>
        <AlertDescription>{demoLabels.errorDescription}</AlertDescription>
      </Alert>
    </div>
  )
}
