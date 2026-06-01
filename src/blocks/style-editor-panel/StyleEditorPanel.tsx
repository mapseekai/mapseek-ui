import { cn } from "../../lib/utils"
import { ScrollContainer } from "../layout"
import type {
  StyleEditorPanelCardProps,
  StyleEditorPanelContentProps,
  StyleEditorPanelEmptyProps,
  StyleEditorPanelHeaderProps,
  StyleEditorPanelRootProps,
  StyleEditorPanelSectionProps,
} from "./types"

export function StyleEditorPanelRoot({
  children,
  className,
  dataWdKey,
}: StyleEditorPanelRootProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col bg-card text-card-foreground",
        className
      )}
      data-wd-key={dataWdKey}
    >
      {children}
    </div>
  )
}

export function StyleEditorPanelHeader({
  title,
  actions,
  className,
}: StyleEditorPanelHeaderProps) {
  return (
    <header
      className={cn(
        "bg-panel-surface flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-3",
        className
      )}
    >
      <h2 className="text-panel-text m-0 min-w-0 flex-1 truncate pr-2 text-sm leading-none font-semibold">
        {title}
      </h2>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}

export function StyleEditorPanelContent({
  children,
  className,
  scrollClassName,
}: StyleEditorPanelContentProps) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <ScrollContainer className={scrollClassName}>
        <div className={cn("space-y-4 p-4", className)}>{children}</div>
      </ScrollContainer>
    </div>
  )
}

export function StyleEditorPanelSection({
  title,
  children,
  className,
}: StyleEditorPanelSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      {title ? (
        <h2 className="m-0 border-b border-border pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  )
}

export function StyleEditorPanelCard({
  title,
  subtitle,
  meta,
  action,
  children,
  className,
}: StyleEditorPanelCardProps) {
  return (
    <section
      className={cn("overflow-hidden border border-border bg-card", className)}
    >
      <header className="flex items-center justify-between gap-2 border-b border-border bg-muted/45 px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="m-0 truncate text-sm leading-tight font-semibold">
            {title}
          </p>
          {subtitle ? (
            <p className="m-0 mt-0.5 truncate font-mono text-[11px] leading-tight text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
        {meta ? <div className="shrink-0">{meta}</div> : null}
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      {children ? <div className="p-3">{children}</div> : null}
    </section>
  )
}

export function StyleEditorPanelEmpty({
  children,
  className,
}: StyleEditorPanelEmptyProps) {
  return (
    <p className={cn("m-0 text-sm text-muted-foreground italic", className)}>
      {children}
    </p>
  )
}
