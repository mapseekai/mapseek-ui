import type * as React from "react"

export type StyleEditorModalProps = {
  open: boolean
  title: React.ReactNode
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  disablePointerDismissal?: boolean
  className?: string
  dataWdKey?: string
}

export type StyleEditorModalSectionProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export type StyleEditorModalAlertProps = {
  children: React.ReactNode
  onDismiss?: () => void
  dismissLabel?: string
  className?: string
}

export type StyleEditorModalActionsProps = {
  children: React.ReactNode
  className?: string
}

export type StyleEditorModalTileProps = {
  title: React.ReactNode
  imageUrl?: string
  onClick?: () => void
  action?: React.ReactNode
  className?: string
}

export type StyleEditorModalSourceCardProps = {
  title: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}
