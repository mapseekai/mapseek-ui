import type { Toast as ToastPrimitive } from "@base-ui/react/toast"
import {
  IconAlertOctagonFilled,
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconInfoCircleFilled,
  IconLoader,
} from "@tabler/icons-react"
import type { ComponentType, ReactElement } from "react"
import { describe, expect, it } from "vitest"

import { createToastManager, Toast, Toaster, ToastIcon } from "./toast"

describe("Toast", () => {
  it("uses a sharp, bordered, shadowless typed surface", () => {
    const element = Toast({ toast: {} as ToastPrimitive.Root.Props["toast"] }) as ReactElement<{
      className: string
    }>

    expect(element.props.className).toContain("rounded-none")
    expect(element.props.className).toContain("border-border")
    expect(element.props.className).toContain("shadow-none")
    expect(element.props.className).toContain("data-[type=success]:border-primary")
    expect(element.props.className).toContain("data-[type=error]:border-destructive")
    expect(element.props.className).toContain("data-[type=warning]:border-warning")
    expect(element.props.className).toContain("data-[type=info]:border-info")
    expect(element.props.className).toContain("data-[type=success]:bg-[color-mix")
  })

  it.each([
    ["success", IconCircleCheckFilled, "text-primary"],
    ["info", IconInfoCircleFilled, "text-info"],
    ["warning", IconAlertTriangleFilled, "text-warning"],
    ["error", IconAlertOctagonFilled, "text-destructive"],
    ["loading", IconLoader, "text-muted-foreground"],
  ])("maps %s to a filled semantic icon", (type, iconType, colorClass) => {
    const wrapper = ToastIcon({ type }) as ReactElement<{
      children: ReactElement<{ className: string }, ComponentType<{ className: string }>>
    }>
    const icon = wrapper.props.children

    expect(icon.type).toBe(iconType)
    expect(icon.props.className).toContain(colorClass)
  })

  it("defaults to a 2500ms timeout while allowing caller overrides", () => {
    const manager = createToastManager()
    const defaulted = Toaster({ toastManager: manager }) as ReactElement<{ timeout: number }>
    expect(defaulted.props.timeout).toBe(2500)

    const element = Toaster({ toastManager: manager, limit: 4, timeout: 3000 }) as ReactElement<{
      toastManager: typeof manager
      limit: number
      timeout: number
    }>

    expect(element.props.toastManager).toBe(manager)
    expect(element.props.limit).toBe(4)
    expect(element.props.timeout).toBe(3000)
  })
})
