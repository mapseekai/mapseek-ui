import type { ReactNode } from "react"

export type ServiceEndpointRowProps = {
  title: string
  subtitle: string
  method: "GET"
  url: string
  onCopy: () => void
  onCopyError?: (error: unknown) => void
  copyLabel: string
  copiedLabel?: string
  icon?: ReactNode
  openDisabled?: boolean
  openTooltip?: string
  openLabel: string
  openHref?: string
  onOpen?: () => void
}
