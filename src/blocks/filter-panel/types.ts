import type * as React from "react"

export type FilterMode = "builder" | "sql"

export interface FilterCondition {
  id: number
  conn: "AND" | "OR"
  field: string
  op: string
  value: string
}

export interface FilterValue {
  mode: FilterMode
  rows: FilterCondition[]
  sql: string
}

export interface FilterPanelProps {
  fields: string[]
  value: FilterValue
  onChange: (next: FilterValue) => void
  className?: string
  children: React.ReactNode
}

export interface FilterPanelContextValue {
  fields: string[]
  value: FilterValue
  onChange: (next: FilterValue) => void
}

export const EMPTY_FILTER: FilterValue = {
  mode: "builder",
  rows: [],
  sql: "",
}
