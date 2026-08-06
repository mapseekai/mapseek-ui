import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from "@/registry/lib/utils"

function CardTabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="card-tabs"
      data-orientation={orientation}
      className={cn(
        "group/card-tabs flex gap-0 overflow-hidden border border-border bg-card text-card-foreground data-horizontal:flex-col data-vertical:flex-row",
        className,
      )}
      {...props}
    />
  )
}

function CardTabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="card-tabs-list"
      className={cn(
        "group/card-tabs-list inline-flex w-fit items-center justify-center bg-muted/40 text-muted-foreground group-data-horizontal/card-tabs:h-auto group-data-horizontal/card-tabs:w-full group-data-horizontal/card-tabs:justify-start group-data-horizontal/card-tabs:border-b group-data-horizontal/card-tabs:border-border group-data-vertical/card-tabs:h-fit group-data-vertical/card-tabs:flex-col group-data-vertical/card-tabs:self-stretch group-data-vertical/card-tabs:justify-start group-data-vertical/card-tabs:border-e group-data-vertical/card-tabs:border-border",
        className,
      )}
      {...props}
    />
  )
}

function CardTabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="card-tabs-trigger"
      className={cn(
        "relative inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 border-0 px-3 py-2 text-xs font-medium whitespace-nowrap text-foreground/60 transition-colors after:absolute after:bg-primary after:opacity-0 after:transition-opacity hover:text-foreground focus-visible:outline-none focus-visible:after:opacity-100 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-active:bg-primary/10 data-active:text-primary data-active:after:opacity-100 group-data-horizontal/card-tabs:h-full group-data-horizontal/card-tabs:border-e group-data-horizontal/card-tabs:border-border group-data-horizontal/card-tabs:last:border-e-0 group-data-horizontal/card-tabs:after:inset-x-0 group-data-horizontal/card-tabs:after:bottom-0 group-data-horizontal/card-tabs:after:h-0.5 group-data-vertical/card-tabs:w-full group-data-vertical/card-tabs:justify-start group-data-vertical/card-tabs:border-b group-data-vertical/card-tabs:border-border group-data-vertical/card-tabs:last:border-b-0 group-data-vertical/card-tabs:after:inset-y-0 group-data-vertical/card-tabs:after:end-0 group-data-vertical/card-tabs:after:w-0.5 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  )
}

function CardTabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="card-tabs-content"
      className={cn("min-w-0 flex-1 p-4 text-xs/relaxed outline-none", className)}
      {...props}
    />
  )
}

export { CardTabs, CardTabsContent, CardTabsList, CardTabsTrigger }
