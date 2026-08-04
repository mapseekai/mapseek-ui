"use client"

import { Component, type ReactNode } from "react"

type DemoErrorBoundaryProps = {
  readonly children: ReactNode
  readonly fallback: ReactNode
}

type DemoErrorBoundaryState = {
  readonly failed: boolean
  readonly message?: string
}

export class DemoErrorBoundary extends Component<DemoErrorBoundaryProps, DemoErrorBoundaryState> {
  state: DemoErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(error: unknown): DemoErrorBoundaryState {
    return { failed: true, message: error instanceof Error ? error.message : String(error) }
  }

  override componentDidCatch(error: unknown): void {
    console.error("[DemoErrorBoundary]", error)
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback
    }

    return this.props.children
  }
}
