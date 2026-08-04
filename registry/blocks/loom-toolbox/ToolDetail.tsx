import {
  IconArrowLeft,
  IconCircleCheck,
  IconStar,
  IconStarFilled,
  IconTools,
  IconX,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { LoomTool, LoomToolboxLabels } from "./types"

export type ToolDetailProps = {
  readonly tool: LoomTool
  readonly favored: boolean
  readonly inputLayerName: string
  readonly distance: string
  readonly completed: boolean
  readonly labels: LoomToolboxLabels
  readonly onDistanceChange: (distance: string) => void
  readonly onFavoriteChange: (id: string, favored: boolean) => void
  readonly onBack: () => void
  readonly onOpenChange: (open: boolean) => void
  readonly onRun: (id: string) => void
}

export function ToolDetail({
  tool,
  favored,
  inputLayerName,
  distance,
  completed,
  labels,
  onDistanceChange,
  onFavoriteChange,
  onBack,
  onOpenChange,
  onRun,
}: ToolDetailProps) {
  const ToolIcon = tool.icon
  return (
    <>
      <header className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onBack}
        >
          <IconArrowLeft className="size-3.5" /> {labels.back}
        </button>
        <span className="flex-1" />
        <button
          type="button"
          aria-label={favored ? labels.unfavorite(tool.label) : labels.favorite(tool.label)}
          aria-pressed={favored}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onFavoriteChange(tool.id, !favored)}
        >
          {favored ? (
            <IconStarFilled className="size-4 fill-current text-primary" />
          ) : (
            <IconStar className="size-4 text-muted-foreground" />
          )}
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label={labels.close}
          onClick={() => onOpenChange(false)}
        >
          <IconX className="size-4" />
        </Button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="flex items-start gap-2">
          <span className="flex size-8 items-center justify-center bg-primary/10 text-primary">
            <ToolIcon className="size-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">{tool.label}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{tool.description}</p>
          </div>
        </div>
        <div className="my-4 border-t border-border" />
        <h3 className="mb-3 text-xs font-semibold">{labels.parameters}</h3>
        <label htmlFor="loom-tool-input-layer" className="grid gap-1.5 text-xs">
          <span className="text-muted-foreground">{labels.inputLayer}</span>
          <Input id="loom-tool-input-layer" value={inputLayerName} readOnly />
        </label>
        {tool.parameterKind === "distance" && (
          <label htmlFor="loom-tool-distance" className="mt-3 grid gap-1.5 text-xs">
            <span className="text-muted-foreground">{labels.distance}</span>
            <Input
              id="loom-tool-distance"
              inputMode="decimal"
              value={distance}
              onChange={(event) => onDistanceChange(event.target.value)}
            />
          </label>
        )}
        <div className="mt-4 flex items-center gap-1.5 bg-primary/10 px-2.5 py-2 text-[11px] text-primary">
          <IconCircleCheck className="size-3.5" />
          {labels.parametersValid}
        </div>
      </div>
      <footer className="border-t border-border p-3">
        {completed && (
          <div role="status" className="mb-2 text-[11px] text-primary">
            {labels.completed}
          </div>
        )}
        <Button
          className="w-full"
          disabled={tool.parameterKind === "distance" && distance.trim().length === 0}
          onClick={() => onRun(tool.id)}
        >
          <IconTools />
          {labels.run(tool.label)}
        </Button>
      </footer>
    </>
  )
}
