import type { CSSProperties, ReactNode } from "react"

export type StyleColorInputMode = "button" | "button-input" | "input"

export type StyleColorPopoverOpenChangeDetails = {
  reason?: string
  event?: Event
  cancel?: () => void
}

export type StyleColorInputRenderPickerContext = {
  value: string
  close: () => void
}

export type StyleColorInputProps = {
  value?: string
  defaultValue?: string
  name?: string
  style?: CSSProperties
  mode?: StyleColorInputMode
  open?: boolean
  inputPlaceholder?: string
  swatchLabel?: string
  "aria-label"?: string
  onOpenChange?: (
    open: boolean,
    details?: StyleColorPopoverOpenChangeDetails
  ) => void
  onTextChange?: (value: string) => void
  onPickerChange?: (value: unknown, formatted?: string) => void
  onTextFocus?: () => void
  onTextBlur?: () => void
  renderPicker?: (context: StyleColorInputRenderPickerContext) => ReactNode
}
