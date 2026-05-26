import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui-components/react/accordion"
import { IconChevronDown } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"

const Accordion = AccordionPrimitive.Root

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-border", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  headerClassName,
  headerStyle,
  children,
  hideChevron,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  hideChevron?: boolean
  headerClassName?: string
  headerStyle?: React.CSSProperties
}) {
  return (
    <AccordionPrimitive.Header
      className={cn("m-0 flex", headerClassName)}
      style={headerStyle}
    >
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-center justify-between px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none [&[data-panel-open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        {!hideChevron && (
          <IconChevronDown
            size={14}
            stroke={1.5}
            className="shrink-0 text-muted-foreground transition-transform duration-200"
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Panel>) {
  return (
    <AccordionPrimitive.Panel
      className={cn(
        "overflow-hidden text-sm transition-[height] duration-200 data-[ending-style]:h-0 data-[starting-style]:h-0",
        className
      )}
      style={{ height: "var(--accordion-panel-height)" }}
      {...props}
    >
      <div className={cn("px-3 pb-2", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
