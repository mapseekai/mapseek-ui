import {
  IconArrowLeft,
  IconCircleCheck,
  IconStar,
  IconStarFilled,
  IconTools,
  IconX,
} from "@tabler/icons-react"
import { useId } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { ToolboxLabels, ToolboxTool } from "./types"

export type ToolDetailProps = {
  readonly tool: ToolboxTool
  readonly favored: boolean
  readonly inputLayerName: string
  readonly distance: string
  readonly completed: boolean
  readonly labels: ToolboxLabels
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
  const fieldId = useId()
  const inputLayerId = `${fieldId}-input-layer`
  const distanceId = `${fieldId}-distance`
  const distanceErrorId = `${fieldId}-distance-error`
  const distanceValid = tool.parameterKind !== "distance" || distance.trim().length > 0

  return (
    <>
      <header className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <Button
          variant="link"
          size="sm"
          type="button"
          className="gap-1 rounded-none text-primary hover:no-underline"
          onClick={onBack}
        >
          <IconArrowLeft data-icon="inline-start" className="rtl:rotate-180" aria-hidden="true" />{" "}
          {labels.back}
        </Button>
        <span className="flex-1" />
        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          aria-label={favored ? labels.unfavorite(tool.label) : labels.favorite(tool.label)}
          aria-pressed={favored}
          onClick={() => onFavoriteChange(tool.id, !favored)}
        >
          {favored ? (
            <IconStarFilled className="fill-current text-primary" aria-hidden="true" />
          ) : (
            <IconStar className="text-muted-foreground" aria-hidden="true" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={labels.close}
          onClick={() => onOpenChange(false)}
        >
          <IconX aria-hidden="true" />
        </Button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="flex items-start gap-2">
          <span className="flex size-8 items-center justify-center bg-muted text-muted-foreground">
            <ToolIcon className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-headline-sm">{tool.label}</h2>
            <p className="mt-1 text-body-md text-muted-foreground">{tool.description}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <h3 className="mb-3 text-body-md-strong">{labels.parameters}</h3>
        <FieldGroup className="gap-3">
          <Field className="gap-1.5">
            <FieldLabel htmlFor={inputLayerId} className="text-body-md">
              {labels.inputLayer}
            </FieldLabel>
            <Input
              id={inputLayerId}
              name="toolbox-input-layer"
              autoComplete="off"
              value={inputLayerName}
              readOnly
            />
          </Field>
          {tool.parameterKind === "distance" && (
            <Field className="gap-1.5" data-invalid={!distanceValid || undefined}>
              <FieldLabel htmlFor={distanceId} className="text-body-md" required>
                {labels.distance}
              </FieldLabel>
              <Input
                id={distanceId}
                name="toolbox-distance"
                autoComplete="off"
                inputMode="decimal"
                required
                aria-invalid={!distanceValid}
                aria-describedby={!distanceValid ? distanceErrorId : undefined}
                value={distance}
                onChange={(event) => onDistanceChange(event.target.value)}
              />
              <FieldError id={distanceErrorId}>
                {!distanceValid ? labels.distanceRequired : null}
              </FieldError>
            </Field>
          )}
        </FieldGroup>
        {distanceValid && (
          <Alert className="mt-4">
            <IconCircleCheck aria-hidden="true" />
            <AlertDescription>{labels.parametersValid}</AlertDescription>
          </Alert>
        )}
      </div>
      <Separator />
      <footer className="p-3">
        {completed && (
          <div role="status" className="mb-2 text-body-sm text-primary">
            {labels.completed}
          </div>
        )}
        <Button className="w-full" disabled={!distanceValid} onClick={() => onRun(tool.id)}>
          <IconTools data-icon="inline-start" aria-hidden="true" />
          {labels.run(tool.label)}
        </Button>
      </footer>
    </>
  )
}
