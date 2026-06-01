import type * as React from "react"

export type StyleEditorPanelRootProps = {
  children: React.ReactNode
  className?: string
  dataWdKey?: string
}

export type StyleEditorPanelHeaderProps = {
  title: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export type StyleEditorPanelContentProps = {
  children: React.ReactNode
  className?: string
  scrollClassName?: string
}

export type StyleEditorPanelSectionProps = {
  title?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export type StyleEditorPanelCardProps = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  meta?: React.ReactNode
  action?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export type StyleEditorPanelEmptyProps = {
  children: React.ReactNode
  className?: string
}
