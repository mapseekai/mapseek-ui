import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

type TabsContextValue = {
  value: string
  onValueChange: (v: string) => void
}
const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("Tabs compound components must be rendered inside <Tabs>")
  return ctx
}

type TabsProps = React.ComponentProps<"div"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
}

function Tabs({ className, value, defaultValue, onValueChange, children, ...props }: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const isControlled = value !== undefined
  const current = isControlled ? value : internal
  const setCurrent = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )
  return (
    <TabsContext.Provider value={{ value: current, onValueChange: setCurrent }}>
      <div data-slot="tabs" className={cn("flex flex-col", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn("flex gap-0", className)}
      {...props}
    />
  )
}

type TabsTriggerProps = React.ComponentProps<"button"> & { value: string }

function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
  const ctx = useTabsContext()
  const active = ctx.value === value
  return (
    <button
      type="button"
      role="tab"
      data-state={active ? "active" : "inactive"}
      className={cn(
        "cursor-pointer border-b-2 border-transparent px-3 py-1.5 text-xs font-medium transition-[color,border] outline-none",
        active ? "text-foreground border-primary" : "text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={() => ctx.onValueChange(value)}
      {...props}
    />
  )
}

type TabsContentProps = React.ComponentProps<"div"> & { value: string }

function TabsContent({ className, value, ...props }: TabsContentProps) {
  const ctx = useTabsContext()
  if (ctx.value !== value) return null
  return <div data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
