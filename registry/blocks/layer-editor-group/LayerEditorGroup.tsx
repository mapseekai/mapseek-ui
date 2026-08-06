import { IconFlag } from "@tabler/icons-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import type { LayerEditorGroupProps } from "./types"

export function LayerEditorGroup({
  sections,
  defaultOpenIds,
  headerHeight = 36,
  stickyOffset = 0,
  className,
  itemClassName,
  headerClassName,
  triggerClassName,
  contentClassName,
}: LayerEditorGroupProps) {
  return (
    <Accordion
      multiple
      defaultValue={defaultOpenIds ?? sections.map((section) => section.id)}
      className={className}
    >
      {sections.map((section, stickyIndex) => {
        const Icon = section.icon ?? IconFlag
        const headerStyle = {
          height: `${headerHeight}px`,
          top: `${stickyOffset + stickyIndex * headerHeight}px`,
          zIndex: sections.length + 10 - stickyIndex,
        }

        return (
          <AccordionItem
            key={section.id}
            value={section.id}
            className={cn(
              "contents border-0 bg-card text-card-foreground",
              itemClassName,
              section.className,
            )}
          >
            <div
              className={cn(
                "sticky flex items-stretch border-b border-border bg-muted [&>h3]:flex [&>h3]:h-full [&>h3]:w-full",
                headerClassName,
                section.headerClassName,
              )}
              style={headerStyle}
            >
              <AccordionTrigger
                data-wd-key={
                  section.dataWdKey ? `layer-editor-group:${section.dataWdKey}` : undefined
                }
                className={cn(
                  "flex h-full w-full items-center border-0 px-3 py-0 text-sm leading-5 font-medium hover:bg-accent/50 [&_[data-slot=accordion-trigger-icon]]:ms-auto [&_[data-slot=accordion-trigger-icon]]:self-center",
                  triggerClassName,
                  section.triggerClassName,
                )}
              >
                <span className="flex h-full min-w-0 flex-1 items-center gap-2 leading-5">
                  <Icon size={14} stroke={1.5} className="shrink-0" />
                  <span className="truncate">{section.title}</span>
                </span>
              </AccordionTrigger>
            </div>
            <AccordionContent className={cn("p-0", contentClassName, section.contentClassName)}>
              {section.children}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
