import { OTPInputContext } from "input-otp"
import type { ReactElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/registry/lib/utils", () => ({
  cn: (...values: Array<string | undefined>) => values.filter(Boolean).join(" "),
}))

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./input-otp"

function renderSlot(slot: {
  char: string | null
  hasFakeCaret: boolean
  isActive: boolean
  placeholderChar: string | null
}) {
  return renderToStaticMarkup(
    <OTPInputContext.Provider value={{ isFocused: true, isHovering: false, slots: [slot] }}>
      <InputOTPSlot index={0} />
    </OTPInputContext.Provider>,
  )
}

describe("InputOTP", () => {
  it("uses square slots with the contract focus ring", () => {
    const markup = renderSlot({
      char: null,
      hasFakeCaret: false,
      isActive: true,
      placeholderChar: null,
    })

    expect(markup).toContain("rounded-none")
    expect(markup).toContain("border-input")
    expect(markup).toContain("focus-visible:border-ring")
    expect(markup).toContain("focus-visible:ring-(length:--focus-ring-width)")
    expect(markup).toContain("focus-visible:ring-ring/20")
  })

  it("marks the root, groups, and separators with component slots", () => {
    const input = InputOTP({
      children: <InputOTPGroup />,
      maxLength: 1,
      onChange: () => undefined,
      value: "",
    }) as ReactElement<{ "data-slot": string }>
    const group = InputOTPGroup({}) as ReactElement<{ "data-slot": string }>
    const separator = InputOTPSeparator({}) as ReactElement<{ "data-slot": string }>

    expect(input.props["data-slot"]).toBe("input-otp")
    expect(group.props["data-slot"]).toBe("input-otp-group")
    expect(separator.props["data-slot"]).toBe("input-otp-separator")
  })

  it("renders a controlled value into its matching slot", () => {
    const markup = renderSlot({
      char: "4",
      hasFakeCaret: false,
      isActive: true,
      placeholderChar: null,
    })

    expect(markup).toContain(">4<")
    expect(markup).toContain('data-active="true"')
  })
})
