import { Component, type ReactNode } from "react"

type DemoErrorBoundaryProps = {
  readonly children: ReactNode
  readonly fallback: ReactNode
}

type DemoErrorBoundaryState = {
  readonly failed: boolean
}

export class DemoErrorBoundary extends Component<DemoErrorBoundaryProps, DemoErrorBoundaryState> {
  state: DemoErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): DemoErrorBoundaryState {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback
    }

    return this.props.children
  }
}
