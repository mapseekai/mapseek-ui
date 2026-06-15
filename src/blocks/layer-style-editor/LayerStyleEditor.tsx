import { IconDotsVertical, IconX } from "@tabler/icons-react"

import { LayerEditorGroup } from "../layer-editor-group"
import { Button } from "../../components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/dropdown-menu"
import { Separator } from "../../components/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/tabs"
import { cn } from "../../lib/utils"
import type { LayerStyleEditorProps } from "./types"

export function LayerStyleEditor({
  title,
  tabs,
  ariaLabel,
  dataWdKey,
  defaultTabId = tabs[0]?.id,
  actions = [],
  actionMenuLabel = "Layer options",
  actionMenuDataWdKey,
  closeLabel = "Close",
  onClose,
  className,
  headerClassName,
  scrollClassName,
  footerClassName,
}: LayerStyleEditorProps) {
  return (
    <section
      data-slot="layer-style-editor"
      data-wd-key={dataWdKey}
      role={ariaLabel ? "main" : undefined}
      aria-label={ariaLabel}
      className={cn("flex h-full w-full flex-col bg-card text-card-foreground", className)}
    >
      <header
        data-slot="layer-style-editor-header"
        data-wd-key={dataWdKey ? `${dataWdKey}.header` : undefined}
        className={cn(
          "z-20 flex h-10 shrink-0 items-center border-b border-border bg-card px-3",
          headerClassName,
        )}
      >
        <h2 className="m-0 grow truncate pr-2 text-[13px] leading-none font-semibold">{title}</h2>
        <div className="flex items-center gap-1.5">
          {actions.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={actionMenuLabel}
                    title={actionMenuLabel}
                    data-wd-key={actionMenuDataWdKey}
                  />
                }
              >
                <IconDotsVertical size={16} stroke={1.75} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                {actions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    disabled={action.disabled}
                    variant={action.variant}
                    data-wd-key={action.dataWdKey}
                    onClick={(event) => {
                      event.stopPropagation()
                      action.onSelect()
                    }}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          {onClose ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label={closeLabel}
              title={closeLabel}
            >
              <IconX size={16} stroke={1.75} />
            </Button>
          ) : null}
        </div>
      </header>

      <Tabs defaultValue={defaultTabId} className="flex grow flex-col overflow-hidden">
        <div
          className={cn("grow overflow-y-auto pb-16", scrollClassName)}
          style={{ scrollbarGutter: "stable" }}
        >
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className={cn("mt-0 h-full", tab.contentClassName)}
            >
              <LayerEditorGroup key={tab.groupKey ?? tab.id} sections={tab.sections} />
            </TabsContent>
          ))}
        </div>

        <Separator className="w-full" />
        <div
          data-slot="layer-style-editor-footer"
          className={cn("shrink-0 bg-card px-2 py-1", footerClassName)}
        >
          <TabsList
            className="grid h-8 w-full bg-muted p-0.5"
            style={{
              gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
            }}
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "h-7 text-xs font-medium text-muted-foreground",
                  "hover:text-foreground active:border-primary active:bg-primary active:text-primary-foreground",
                  "data-active:border-primary data-active:bg-primary data-active:font-semibold data-active:text-primary-foreground data-active:hover:text-primary-foreground",
                  "dark:data-active:border-primary dark:data-active:bg-primary dark:data-active:text-primary-foreground",
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </section>
  )
}
