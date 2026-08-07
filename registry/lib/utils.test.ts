import { describe, expect, it } from "vitest"

import { cn } from "./utils"

describe("cn type-scale handling", () => {
  it("keeps the text color when a type-scale size overrides another size", () => {
    // Regression: twMerge treated `text-body-md` as a text color and dropped
    // `text-primary-foreground`, rendering the xs Button with dark text.
    const merged = cn("text-body-md-medium bg-primary text-primary-foreground", "h-6 text-body-md")
    expect(merged).toContain("text-primary-foreground")
    expect(merged).toContain("text-body-md")
    expect(merged).not.toContain("text-body-md-medium")
  })

  it("does not treat headline/label/display tokens as colors", () => {
    expect(cn("text-headline-lg", "text-muted-foreground")).toBe(
      "text-headline-lg text-muted-foreground",
    )
    expect(cn("text-label-sm", "text-destructive")).toBe("text-label-sm text-destructive")
    expect(cn("text-data-display", "text-foreground")).toBe("text-data-display text-foreground")
  })

  it("still dedupes competing type-scale sizes and text colors", () => {
    expect(cn("text-body-md", "text-body-sm")).toBe("text-body-sm")
    expect(cn("text-primary", "text-destructive")).toBe("text-destructive")
  })
})
