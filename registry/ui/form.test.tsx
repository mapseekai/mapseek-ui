import type * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

const fieldState = vi.hoisted(() => ({
  error: { message: "Dataset name is required" } as { message: string } | undefined,
}))

vi.mock("react-hook-form", () => ({
  Controller: ({
    render,
  }: {
    render: (props: { field: Record<string, never> }) => React.ReactNode
  }) => render({ field: {} }),
  FormProvider: ({ children }: { children: React.ReactNode }) => children,
  useFormContext: () => ({
    formState: {},
    getFieldState: () => fieldState,
  }),
}))

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"

describe("Form", () => {
  it("composes invalid field primitives with accessible error state", () => {
    const html = renderToStaticMarkup(
      <FormField
        control={{} as never}
        name="name"
        render={() => (
          <FormItem>
            <FormLabel>Dataset name</FormLabel>
            <FormControl>
              <input />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />,
    )

    expect(html).toContain('data-slot="form-item"')
    expect(html).toContain('data-slot="form-label"')
    expect(html).toContain('data-slot="form-control"')
    expect(html).toContain('aria-invalid="true"')
    expect(html).toContain('role="alert"')
    expect(html).toContain("Dataset name is required")
  })
  it("does not render a message without an error or message children", () => {
    fieldState.error = undefined

    const html = renderToStaticMarkup(
      <FormField
        control={{} as never}
        name="name"
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />,
    )

    expect(html).toContain('data-slot="form-item"')
    expect(html).not.toContain('data-slot="form-message"')
  })
})
