import { Switch } from "../../components/switch"
import { cn } from "../../lib/utils"

export interface ServiceStatusProps {
  running: boolean
  runningLabel?: string
  stoppedLabel?: string
  onChange?: (running: boolean) => void
  disabled?: boolean
  className?: string
  variant?: "framed" | "inline"
}

export function ServiceStatus({
  running,
  runningLabel = "服务运行中",
  stoppedLabel = "服务已停止",
  onChange,
  disabled = false,
  className,
  variant = "framed",
}: ServiceStatusProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center font-sans text-xs transition-colors",
        variant === "framed" && [
          "h-[26px] gap-1.5 border px-2",
          running ? "border-primary bg-primary/5" : "border-border bg-background",
        ],
        variant === "inline" && ["h-7 gap-2", running ? "text-primary" : "text-muted-foreground"],
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <Switch
        size={variant === "inline" ? "sm" : "default"}
        checked={running}
        disabled={disabled}
        onCheckedChange={onChange}
        className="rounded-none [&_[data-slot='switch-thumb']]:rounded-none"
      />

      {running ? (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
      ) : (
        <span className="block h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
      )}

      <span
        className={cn(
          "leading-none font-medium whitespace-nowrap",
          variant === "framed" && (running ? "text-primary" : "text-muted-foreground"),
        )}
      >
        {running ? runningLabel : stoppedLabel}
      </span>
    </div>
  )
}
