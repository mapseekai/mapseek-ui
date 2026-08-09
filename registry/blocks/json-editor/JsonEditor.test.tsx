import { readFile } from "node:fs/promises"
import { EditorState, type Extension, StateField } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest"

interface CapturedCodeMirrorProps {
  extensions: Extension[]
  theme?: unknown
}

const codeMirrorProps = vi.hoisted(() => [] as CapturedCodeMirrorProps[])

vi.mock("@uiw/react-codemirror", () => ({
  default: (props: CapturedCodeMirrorProps) => {
    codeMirrorProps.push(props)
    return <div data-slot="code-mirror" />
  },
}))

vi.mock("@/lib/utils", () => ({
  cn: (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" "),
}))

import { JsonEditor, type JsonEditorProps, type JsonEditorTheme } from "./JsonEditor"

function renderEditor(props: Partial<Omit<JsonEditorProps, "value" | "onChange">> = {}) {
  return renderToStaticMarkup(
    <JsonEditor value={{ enabled: true }} onChange={() => undefined} {...props} />,
  )
}

function editorState() {
  const props = codeMirrorProps.at(-1)
  if (!props) throw new Error("Expected JsonEditor to render CodeMirror")

  return EditorState.create({ extensions: props.extensions })
}

function contentAttributes() {
  return Object.assign({}, ...editorState().facet(EditorView.contentAttributes))
}

describe("JsonEditor", () => {
  beforeEach(() => {
    codeMirrorProps.length = 0
  })

  it("labels an untitled fieldset and CodeMirror textbox with ariaLabel", () => {
    const html = renderEditor({ ariaLabel: "Style JSON" })

    expect(html).toContain('aria-label="Style JSON"')
    expect(contentAttributes()).toMatchObject({
      "aria-label": "Style JSON",
    })
  })

  it("uses one visible title identifier for the fieldset and CodeMirror textbox", () => {
    const html = renderEditor({ title: "Layer JSON", ariaLabel: "Ignored fallback" })
    const labelId = html.match(/aria-labelledby="([^"]+)"/)?.[1]

    expect(labelId).toBeTruthy()
    expect(html).toContain(`id="${labelId}"`)
    expect(contentAttributes()).toMatchObject({
      "aria-labelledby": labelId,
    })
    expect(html).not.toContain('aria-label="Ignored fallback"')
  })

  it.each([
    ["app", false, "var(--background)"],
    ["light", false, "#ffffff"],
    ["dark", true, "#0d1117"],
  ] as const)(
    "installs the %s palette independently of the UIW wrapper theme",
    (theme, dark, background) => {
      const html = renderEditor({ theme })

      expect(html).toContain(`data-json-editor-theme="${theme}"`)
      expect(html).toContain(`--json-editor-background:${background}`)
      expect(editorState().facet(EditorView.darkTheme)).toBe(dark)
      expect(codeMirrorProps.at(-1)?.theme).toBe("none")
    },
  )

  it("leaves colors to the consumer for the none theme", () => {
    const html = renderEditor({ theme: "none" })

    expect(html).toContain('data-json-editor-theme="none"')
    expect(html).not.toContain("--json-editor-background")
    expect(codeMirrorProps.at(-1)?.theme).toBe("none")
  })

  it("does not add an outer focus border or ring", () => {
    const html = renderEditor()

    expect(html).not.toContain("focus-within:border-ring")
    expect(html).not.toContain("focus-within:ring-3")
    expect(html).not.toContain("focus-within:ring-ring/20")
  })

  it("installs a custom theme extension without enabling a UIW palette", () => {
    const customTheme = StateField.define({
      create: () => "custom-theme",
      update: (value) => value,
    })
    const html = renderEditor({ theme: customTheme })

    expect(html).toContain('data-json-editor-theme="custom"')
    expect(html).not.toContain("--json-editor-background")
    expect(editorState().field(customTheme)).toBe("custom-theme")
    expect(codeMirrorProps.at(-1)?.theme).toBe("none")
  })

  it("keeps the public theme and visual tokens on the approved design contract", async () => {
    const source = await readFile(new URL("./JsonEditor.tsx", import.meta.url), "utf8")

    expectTypeOf<JsonEditorTheme>().toEqualTypeOf<"app" | "light" | "dark" | "none" | Extension>()
    expect(source).toContain("export type JsonEditorTheme = BuiltInJsonEditorTheme | Extension")
    expect(source).toContain('fontSize: "13px"')
    expect(source).toContain('{ tag: tags.propertyName, color: "var(--json-editor-cat-1)" }')
  })
})
