import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui-components/react/slider"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Slider built on @base-ui-components/react. Single export wrapping the
 * full base-ui compound (Root / Control / Track / Indicator / Thumb) so
 * callers get a Radix-shadcn-compatible API:
 *
 *   <Slider value={[v]} onValueChange={(arr) => set(arr[0])} min={0} max={100} step={1} />
 *
 * Internal nesting follows base-ui's required compound structure. Callers
 * who need finer control (e.g. multi-handle ranges) can compose with the
 * raw `SliderPrimitive` re-exported from "@base-ui-components/react/slider".
 */

type SliderRootProps = React.ComponentProps<typeof SliderPrimitive.Root>

function Slider({
  className,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step,
  disabled,
  orientation = "horizontal",
  "aria-label": ariaLabel,
  ...props
}: SliderRootProps & {
  className?: string
  "aria-label"?: string
}) {
  // Determine how many thumbs to render: fall back to a single handle if
  // the caller doesn't pass an array (matches the shadcn default API).
  const arrayValue = React.useMemo(() => {
    if (Array.isArray(value)) return value
    if (Array.isArray(defaultValue)) return defaultValue
    return [0]
  }, [value, defaultValue])

  return (
    <SliderPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      orientation={orientation}
      className={cn(
        "relative flex touch-none select-none",
        orientation === "vertical" ? "h-full w-fit" : "w-full"
      )}
      {...props}
    >
      <SliderPrimitive.Control
        className={cn(
          "relative flex w-full touch-none items-center select-none",
          orientation === "vertical" ? "h-full w-2 flex-col" : "h-5",
          className
        )}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative grow overflow-hidden rounded-none bg-muted",
            orientation === "vertical" ? "h-full w-1" : "h-1 w-full"
          )}
        >
          <SliderPrimitive.Indicator
            className={cn(
              "absolute bg-primary",
              orientation === "vertical" ? "bottom-0 w-full" : "left-0 h-full"
            )}
          />
        </SliderPrimitive.Track>
        {arrayValue.map((_, idx) => (
          <SliderPrimitive.Thumb
            key={idx}
            index={idx}
            aria-label={ariaLabel}
            className={cn(
              "block h-3 w-3 rounded-none border border-primary bg-background shadow-sm transition-colors",
              "hover:bg-primary/10",
              "focus-visible:ring-[3px] focus-visible:ring-ring/20 focus-visible:outline-none",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider, SliderPrimitive }
