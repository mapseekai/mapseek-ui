import type { ReactNode } from "react"

export type ServiceEndpointRowProps = {
  title: string
  subtitle: string
  method: "GET"
  url: string
  onCopy: () => void
  copyLabel: string
  icon?: ReactNode
  openDisabled?: boolean
  openTooltip?: string
  openLabel?: string
  onOpen?: () => void
}
