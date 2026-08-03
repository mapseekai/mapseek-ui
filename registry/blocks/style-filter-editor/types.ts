import type * as React from "react"

export type StyleFilterEditorRowProps = {
  children: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export type StyleFilterEditorSingleProps = {
  property: React.ReactNode
  operator: React.ReactNode
  value?: React.ReactNode
  className?: string
}

export type StyleFilterEditorActionsProps = {
  children: React.ReactNode
  className?: string
}

export type StyleFilterEditorInlineErrorProps = {
  children: React.ReactNode
  className?: string
}

export type StyleFilterEditorUnsupportedProps = {
  children: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export type StyleFilterEditorInfoProps = {
  children: React.ReactNode
  className?: string
}
