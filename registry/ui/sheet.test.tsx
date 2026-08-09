import type { ComponentProps, ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@base-ui/react/dialog", () => {
  const Div = ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>
  const Button = ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  )

  return {
    Dialog: {
      Backdrop: Div,
      Close: Button,
      Description: Div,
      Popup: Div,
      Portal: ({ children }: { children: ReactNode }) => <>{children}</>,
      Root: ({ children }: { children: ReactNode }) => <>{children}</>,
      Title: Div,
      Trigger: Button,
    },
  }
})

import { Sheet, SheetBody, SheetContent } from "./sheet"

describe("Sheet", () => {
  it("contains scrolling and disables its transitions for reduced-motion users", () => {
    const html = renderToStaticMarkup(
      <Sheet open>
        <SheetContent>
          <SheetBody>Drawer body</SheetBody>
        </SheetContent>
      </Sheet>,
    )

    expect(html).toContain("motion-reduce:transition-none")
    expect(html).toContain("overscroll-contain")
  })
})
