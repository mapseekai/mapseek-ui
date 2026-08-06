import { renderToStaticMarkup } from "react-dom/server"
import { expect, it } from "vitest"
import { SelectOverviewDemo } from "./SelectShowcase"

it("shows the default fixed-width trigger without a demo width override", () => {
  const html = renderToStaticMarkup(<SelectOverviewDemo />)
  const widthSection = html.match(/<section[^>]*data-demo="select-widths"[\s\S]*?<\/section>/)?.[0]
  const fixedTriggerClasses = widthSection?.match(/data-width="fixed"[^>]*class="([^"]+)"/)?.[1]

  expect(fixedTriggerClasses?.split(/\s+/)).toContain("w-full")
  expect(fixedTriggerClasses?.split(/\s+/)).not.toContain("w-28")
})

it("lets every size example follow the selected content width", () => {
  const html = renderToStaticMarkup(<SelectOverviewDemo />)
  const sizeSection =
    html.match(/<section[^>]*data-demo="select-small"[\s\S]*?<\/section>/)?.[0] ?? ""
  const triggers = sizeSection.match(/<button[^>]*data-slot="select-trigger"[^>]*>/g) ?? []

  expect(triggers).toHaveLength(4)

  for (const trigger of triggers) {
    const classes = trigger.match(/class="([^"]+)"/)?.[1].split(/\s+/)

    expect(trigger).toContain('data-width="content"')
    expect(classes).toContain("w-fit")
    expect(classes).not.toContain("w-28")
  }
})
