import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion"

function renderAccordion() {
  return renderToStaticMarkup(
    <Accordion defaultValue={["item"]}>
      <AccordionItem value="item">
        <AccordionTrigger>Item</AccordionTrigger>
        <AccordionContent>Content</AccordionContent>
      </AccordionItem>
    </Accordion>,
  )
}

describe("Accordion motion", () => {
  it("limits trigger transitions to the properties it changes", () => {
    const html = renderAccordion()
    const trigger = html.match(/<button[^>]*data-slot="accordion-trigger"[^>]*>/)?.[0]

    expect(trigger).toContain("transition-[background-color,border-color,color]")
    expect(trigger).toContain("motion-reduce:transition-none")
    expect(trigger).not.toContain("transition-all")
  })

  it("disables panel transitions when reduced motion is requested", () => {
    const html = renderAccordion()
    const panel = html.match(/<div[^>]*data-slot="accordion-content"[^>]*>/)?.[0]

    expect(panel).toContain("transition-[height,opacity]")
    expect(panel).toContain("motion-reduce:transition-none")
  })
})

describe("Accordion icons", () => {
  it("renders consistent decorative chevrons", () => {
    const html = renderAccordion()
    const icons = html.match(/<svg[^>]*data-slot="accordion-trigger-icon"[^>]*>/g) ?? []

    expect(html).toContain("**:data-[slot=accordion-trigger-icon]:size-3.5")
    expect(icons).toHaveLength(2)
    for (const icon of icons) {
      expect(icon).toContain('width="14"')
      expect(icon).toContain('height="14"')
      expect(icon).toContain('stroke-width="1.5"')
      expect(icon).toContain('aria-hidden="true"')
    }
  })
})
