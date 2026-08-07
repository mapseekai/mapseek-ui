import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react"
import * as React from "react"

import { cn } from "@/registry/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/ui/input-group"

/**
 * Combobox compound built on @base-ui/react. Renders an
 * autocomplete-capable text input with a popover list. Compose:
 *
 *   <Combobox>
 *     <ComboboxInput placeholder="…" />
 *     <ComboboxContent>
 *       <ComboboxList>
 *         <ComboboxItem value="x">X</ComboboxItem>
 *       </ComboboxList>
 *       <ComboboxEmpty>No results.</ComboboxEmpty>
 *     </ComboboxContent>
 *   </Combobox>
 *
 * Mirrors the shadcn/ui combobox API but uses base-ui parts and this
 * package's square-corner / border-first design tokens.
 */

const Combobox = ComboboxPrimitive.Root

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-3.5 cursor-pointer", className)}
      {...props}
    >
      {children}
      <IconChevronDown
        className="text-muted-foreground pointer-events-none"
        size={12}
        stroke={1.5}
      />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cn(className)}
      {...props}
      render={
        <InputGroupButton variant="ghost" size="icon-xs">
          <IconX className="pointer-events-none" />
        </InputGroupButton>
      }
    />
  )
}

type ComboboxInputProps = ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean
  showClear?: boolean
  disabled?: boolean
  ref?: React.Ref<HTMLInputElement>
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ref,
  ...props
}: ComboboxInputProps) {
  return (
    <InputGroup className={cn("w-auto", className)}>
      <ComboboxPrimitive.Input
        ref={ref}
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
            render={<ComboboxTrigger />}
          />
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  )
}

type ComboboxContentProps = ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxContentProps) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-3000 outline-none"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "max-h-72 min-w-36 overflow-hidden border border-border bg-popover text-popover-foreground outline-none",
            "max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+(--spacing(7)))]",
            "transition-opacity duration-100 data-ending-style:opacity-0 data-starting-style:opacity-0",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "scroll-py-1 overflow-y-auto overscroll-contain p-1",
        "max-h-[min(calc(--spacing(72)-(--spacing(9))),calc(var(--available-height)-(--spacing(9))))]",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center justify-between gap-2 px-2 py-2 text-body-md outline-hidden",
        "data-highlighted:bg-accent/50",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none flex size-3.5 items-center justify-center text-primary">
            <IconCheck className="pointer-events-none" size={10} stroke={2} />
          </span>
        }
      />
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" className={cn(className)} {...props} />
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn("px-2 py-1.5 text-label-md uppercase text-muted-foreground", className)}
      {...props}
    />
  )
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full items-center justify-center py-2 text-center text-body-md text-muted-foreground",
        "data-[state=visible]:flex",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-8 flex-wrap items-center gap-1 border border-input bg-input-surface px-2 py-1 text-body-md transition-colors",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20",
        "has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20",
        "dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
        "has-data-[slot=combobox-chip]:px-1",
        className,
      )}
      {...props}
    />
  )
}

type ComboboxChipProps = ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean
}

function ComboboxChip({ className, children, showRemove = true, ...props }: ComboboxChipProps) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-5 w-fit items-center justify-center gap-1 whitespace-nowrap bg-muted px-1.5 text-body-sm-medium text-foreground",
        "has-data-[slot=combobox-chip-remove]:pr-0",
        "has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          className="-ml-1 opacity-50 hover:opacity-100"
          data-slot="combobox-chip-remove"
          render={
            <InputGroupButton variant="ghost" size="icon-xs">
              <IconX className="pointer-events-none" />
            </InputGroupButton>
          }
        />
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn("min-w-16 flex-1 outline-none", className)}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
