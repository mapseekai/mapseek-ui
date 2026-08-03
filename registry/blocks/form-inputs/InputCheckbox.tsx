import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"

export type InputCheckboxProps = {
  value?: boolean
  style?: React.CSSProperties
  onChange(...args: unknown[]): unknown
}

export const InputCheckbox: React.FC<InputCheckboxProps> = ({ value = false, onChange, style }) => {
  return <Checkbox checked={value} onCheckedChange={(next) => onChange(next)} style={style} />
}
