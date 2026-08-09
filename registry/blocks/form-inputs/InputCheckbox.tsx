import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"

export type InputCheckboxProps = Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "defaultChecked" | "onChange" | "onCheckedChange" | "required" | "value"
> & {
  value?: boolean
  required?: boolean
  onChange(...args: unknown[]): unknown
}

export const InputCheckbox: React.FC<InputCheckboxProps> = ({
  value = false,
  required,
  onChange,
  ...props
}) => {
  return (
    <Checkbox
      {...props}
      aria-required={required || undefined}
      checked={value}
      onCheckedChange={(next) => onChange(next)}
    />
  )
}
