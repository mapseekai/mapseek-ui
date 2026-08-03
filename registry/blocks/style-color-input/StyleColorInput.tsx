import { useId, useRef, useState } from "react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "./ColorPicker"
import type { StyleColorInputProps, StyleColorPopoverOpenChangeDetails } from "./types"

function shouldKeepPopoverOpenForColorInput(
  isOpen: boolean,
  eventDetails: StyleColorPopoverOpenChangeDetails | undefined,
  input: HTMLInputElement | null,
) {
  if (isOpen || !input) return false
  if (eventDetails?.reason !== "outside-press" && eventDetails?.reason !== "focus-out") {
    return false
  }

  const target = eventDetails.event?.target
  const eventStartedFromInput = target instanceof Node && input.contains(target)
  const inputStillHasFocus = input.ownerDocument.activeElement === input

  return eventStartedFromInput || inputStillHasFocus
}

export function StyleColorInput({
  value,
  defaultValue = "#000000",
  name,
  style,
  mode = "button-input",
  layout = "swatch-input",
  open,
  inputPlaceholder,
  swatchLabel,
  "aria-label": ariaLabel,
  onOpenChange,
  onTextChange,
  onPickerChange,
  onTextFocus,
  onTextBlur,
  renderPicker,
}: StyleColorInputProps) {
  const reactId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const displayValue = value || defaultValue
  const isControlled = open !== undefined
  const isOpen = open ?? uncontrolledOpen
  const hasButton = mode === "button" || mode === "button-input"
  const hasInput = mode === "input" || mode === "button-input"

  const setOpen = (nextOpen: boolean, details?: StyleColorPopoverOpenChangeDetails) => {
    if (shouldKeepPopoverOpenForColorInput(nextOpen, details, inputRef.current)) {
      details?.cancel?.()
      return
    }

    if (!isControlled) setUncontrolledOpen(nextOpen)
    onOpenChange?.(nextOpen, details)
  }

  const handlePickerChange = (nextValue: unknown, formatted?: string) => {
    if (onPickerChange) {
      onPickerChange(nextValue, formatted)
      return
    }

    const colorValue = formatPickerValue(nextValue, formatted)
    if (colorValue) onTextChange?.(colorValue)
  }

  const picker = renderPicker?.({
    value: displayValue,
    close: () => setOpen(false),
  }) ?? (
    <ColorPicker value={displayValue} onChange={handlePickerChange} className="w-64">
      <ColorPickerSelection className="h-48 w-full" />
      <div className="flex flex-col gap-2">
        <ColorPickerHue />
        <ColorPickerAlpha />
      </div>
      <div className="flex items-center gap-2">
        <ColorPickerOutput />
        <ColorPickerEyeDropper />
      </div>
      <ColorPickerFormat />
    </ColorPicker>
  )

  const swatch = hasButton ? (
    <PopoverTrigger
      render={
        <button
          type="button"
          aria-label={swatchLabel ?? ariaLabel ?? "Open color picker"}
          className="h-6 w-6 shrink-0 cursor-pointer border border-input bg-background"
          style={{ backgroundColor: displayValue }}
        />
      }
    />
  ) : null

  const renderInput = (openPickerOnInteract: boolean) => (
    <input
      id={reactId}
      ref={inputRef}
      aria-label={ariaLabel}
      spellCheck="false"
      autoComplete="off"
      className={cn(
        "h-7 w-full bg-transparent px-2 text-xs focus-visible:outline-none",
        "border border-input focus-visible:ring-1 focus-visible:ring-ring",
      )}
      style={style}
      name={name}
      placeholder={inputPlaceholder ?? defaultValue}
      value={displayValue}
      onChange={(event) => onTextChange?.(event.target.value)}
      onFocus={() => {
        onTextFocus?.()
        if (openPickerOnInteract) setOpen(true)
      }}
      onClick={() => {
        if (openPickerOnInteract) setOpen(true)
      }}
      onBlur={onTextBlur}
    />
  )

  if (mode === "input") {
    return (
      <div className="flex w-full items-center">
        <Popover open={isOpen} onOpenChange={setOpen}>
          <div className="relative w-full">
            <PopoverTrigger
              render={
                <button
                  type="button"
                  aria-hidden="true"
                  tabIndex={-1}
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                />
              }
            />
            {renderInput(true)}
          </div>
          <PopoverContent className="w-auto p-4" align="start">
            {picker}
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  const input = hasInput ? renderInput(mode === "button-input") : null
  const controls =
    layout === "input-swatch" ? (
      <>
        {input}
        <Popover open={isOpen} onOpenChange={setOpen}>
          {swatch}
          <PopoverContent className="w-auto p-4" align="start">
            {picker}
          </PopoverContent>
        </Popover>
      </>
    ) : (
      <>
        <Popover open={isOpen} onOpenChange={setOpen}>
          {swatch}
          <PopoverContent className="w-auto p-4" align="start">
            {picker}
          </PopoverContent>
        </Popover>
        {input}
      </>
    )

  return <div className="flex w-full items-center gap-2">{controls}</div>
}

function formatPickerValue(value: unknown, formatted?: string): string {
  if (formatted) return formatted
  if (!Array.isArray(value)) return ""

  const [r, g, b, rawA] = value
  const safeR = Math.round(Number(r) || 0)
  const safeG = Math.round(Number(g) || 0)
  const safeB = Math.round(Number(b) || 0)
  const alpha = Number(rawA)
  const safeA = Number.isFinite(alpha) ? alpha : 1

  return `rgba(${safeR}, ${safeG}, ${safeB}, ${safeA})`
}
