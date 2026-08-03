import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@registry/ui/progress"
import type { LocalizedDemoProps } from "./types"

export function ProgressOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  void locale
  return (
    <div className="max-w-xl space-y-8">
      <Progress value={68} className="space-y-2" data-demo="progress-determinate">
        <div className="flex w-full justify-between text-xs">
          <ProgressLabel>Tile generation</ProgressLabel>
          <ProgressValue />
        </div>
      </Progress>

      <Progress value={null} className="space-y-2" data-demo="progress-indeterminate">
        <ProgressLabel className="text-xs">Analyzing dataset</ProgressLabel>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  )
}
