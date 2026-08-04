import { IconCircleDashed, IconLoader2, IconRefresh } from "@tabler/icons-react"
import { resolveLabels } from "@/lib/mapseek-labels"
import { cn } from "@/lib/utils"
import { DEFAULT_LOADING_SCREEN_LABELS } from "./defaults"
import type { LoadingScreenLabels } from "./labels"

export type LoadingScreenVariant = "spinner" | "refresh" | "pulse"

export interface LoadingScreenProps {
  /** Primary status text. Defaults to "加载中…". */
  text?: string
  labels?: Partial<LoadingScreenLabels>
  /** Optional secondary line — name, step, or short detail. */
  description?: string
  /** Render full-viewport instead of filling the parent. */
  fullscreen?: boolean
  /** Visual loading treatment. */
  variant?: LoadingScreenVariant
  className?: string
}

const indicators = {
  spinner: { icon: IconLoader2, className: "animate-spin" },
  refresh: { icon: IconRefresh, className: "animate-[spin_1.4s_ease-in-out_infinite]" },
  pulse: { icon: IconCircleDashed, className: "animate-pulse" },
} satisfies Record<LoadingScreenVariant, { icon: typeof IconLoader2; className: string }>

export function LoadingScreen({
  text,
  labels,
  description,
  fullscreen = false,
  variant = "spinner",
  className,
}: LoadingScreenProps) {
  const resolvedLabels = resolveLabels(DEFAULT_LOADING_SCREEN_LABELS, labels)
  const indicator = indicators[variant]
  const Indicator = indicator.icon
  return (
    <div
      role="status"
      aria-live="polite"
      data-loading-variant={variant}
      className={cn(
        "flex items-center justify-center bg-background",
        fullscreen ? "h-screen w-screen" : "h-full w-full",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Indicator
          aria-hidden="true"
          data-slot="loading-screen-indicator"
          size={28}
          stroke={1.75}
          className={cn(indicator.className, "text-primary")}
        />
        <div className="text-sm text-foreground">{text ?? resolvedLabels.loading}</div>
        {description ? (
          <div className="text-[12px] text-muted-foreground">{description}</div>
        ) : null}
      </div>
    </div>
  )
}
