import {
  IconArrowLeft,
  IconCircleCheck,
  IconStar,
  IconStarFilled,
  IconTools,
  IconX,
} from "@tabler/icons-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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
        <Button
          variant="link"
          size="sm"
          type="button"
          className="h-auto gap-1 rounded-none p-0 text-xs text-primary hover:no-underline"
          onClick={onBack}
        >
          <IconArrowLeft className="size-3.5" /> {labels.back}
        </Button>
        <span className="flex-1" />
        <Button
          variant="ghost"
          size="icon-xs"
          type="button"
          aria-label={favored ? labels.unfavorite(tool.label) : labels.favorite(tool.label)}
          aria-pressed={favored}
          onClick={() => onFavoriteChange(tool.id, !favored)}
        >
          {favored ? (
            <IconStarFilled className="size-4 fill-current text-primary" />
          ) : (
            <IconStar className="size-4 text-muted-foreground" />
          )}
        </Button>
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
          <span className="flex size-8 items-center justify-center bg-muted text-primary">
            <ToolIcon className="size-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">{tool.label}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{tool.description}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <h3 className="mb-3 text-xs font-semibold">{labels.parameters}</h3>
        <FieldGroup className="gap-3">
          <Field className="gap-1.5">
            <FieldLabel htmlFor="loom-tool-input-layer" className="text-xs text-muted-foreground">
              {labels.inputLayer}
            </FieldLabel>
            <Input id="loom-tool-input-layer" value={inputLayerName} readOnly />
          </Field>
          {tool.parameterKind === "distance" && (
            <Field className="gap-1.5">
              <FieldLabel htmlFor="loom-tool-distance" className="text-xs text-muted-foreground">
                {labels.distance}
              </FieldLabel>
              <Input
                id="loom-tool-distance"
                inputMode="decimal"
                value={distance}
                onChange={(event) => onDistanceChange(event.target.value)}
              />
            </Field>
          )}
        </FieldGroup>
        <Alert className="mt-4">
          <IconCircleCheck />
          <AlertDescription>{labels.parametersValid}</AlertDescription>
        </Alert>
      </div>
      <Separator />
      <footer className="p-3">
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
          <IconTools data-icon="inline-start" />
          {labels.run(tool.label)}
        </Button>
      </footer>
    </>
  )
}
