import type * as React from "react"

export type StyleFunctionPanelProps = {
  title: React.ReactNode
  children: React.ReactNode
  className?: string
}

export type StyleFunctionStopsTableColumn = {
  id: string
  label: React.ReactNode
  className?: string
  colSpan?: number
}

export type StyleFunctionStopsTableProps = {
  caption: React.ReactNode
  columns: StyleFunctionStopsTableColumn[]
  children: React.ReactNode
  className?: string
}
