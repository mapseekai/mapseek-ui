import { IconChevronDown, IconChevronRight, IconStack2 } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"
import * as React from "react"
import { LayerItemContext, useLayerPanelContext } from "./use-layer-panel"

export function LayerPanelSection({
  id,
  icon: Icon,
  label,
  defaultOpen = false,
  hidden = false,
  className,
  children,
}: {
  id: string
  icon?: React.ComponentType<{ className?: string }>
  label: string
  defaultOpen?: boolean
  hidden?: boolean
  className?: string
  children: React.ReactNode
}) {
  const ctx = useLayerPanelContext()
  const layer = React.useContext(LayerItemContext)

  React.useEffect(() => {
    if (!layer) return
    ctx.registerSectionDefault(layer.id, id, defaultOpen)
  }, [ctx, defaultOpen, id, layer])

  if (hidden || !layer) return null

  const open = ctx.isSectionOpen(layer.id, id)
  return (
    <div className={cn("overflow-hidden rounded-md border border-border bg-card", className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium hover:bg-muted/40"
        onClick={() => ctx.toggleSection(layer.id, id)}
      >
        <span className="flex items-center gap-2">
          {Icon ? <Icon className="size-4 text-primary" /> : null}
          {label}
        </span>
        {open ? (
          <IconChevronDown className="size-4 text-muted-foreground" />
        ) : (
          <IconChevronRight className="size-4 text-muted-foreground" />
        )}
      </button>
      {open ? <div className="border-t border-border px-3 py-3">{children}</div> : null}
    </div>
  )
}

export function LayerPanelEmpty({ className, children }: React.ComponentProps<"div">) {
  const { collapsed, layers } = useLayerPanelContext()
  if (collapsed || layers.length > 0) return null
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-2 px-6 py-10 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function LayerPanelEmptyIcon({ className }: { className?: string }) {
  return <IconStack2 className={cn("size-8 text-muted-foreground", className)} />
}
