import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@registry/ui/progress"

export function ProgressOverviewDemo() {
  return (
    <div className="max-w-xl space-y-8" data-demo="progress-overview">
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
