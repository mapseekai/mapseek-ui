import { IconLoader2 } from "@tabler/icons-react"

import { cn } from "@workspace/ui/lib/utils"

export interface LoadingScreenProps {
  /** Primary status text. Defaults to "加载中…". */
  text?: string
  /** Optional secondary line — name, step, or short detail. */
  description?: string
  /** Render full-viewport instead of filling the parent. */
  fullscreen?: boolean
  className?: string
}

export function LoadingScreen({
  text = "加载中…",
  description,
  fullscreen = false,
  className,
}: LoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-center bg-background",
        fullscreen ? "h-screen w-screen" : "h-full w-full",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <IconLoader2 size={28} stroke={1.75} className="animate-spin text-primary" />
        <div className="text-sm text-foreground">{text}</div>
        {description ? (
          <div className="text-[12px] text-muted-foreground">{description}</div>
        ) : null}
      </div>
    </div>
  )
}
