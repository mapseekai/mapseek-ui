import { useState } from "react"
import { createRoot } from "react-dom/client"
import { AttrTableSheet } from "../../registry/blocks/attr-table/attr-table-sheet"
import { useTableSheetState } from "../../registry/blocks/attr-table/use-table-sheet-state"
import { JsonEditor } from "../../registry/blocks/json-editor/JsonEditor"
import { ColorInput } from "../../registry/ui/color-input/ColorInput"

function Fixture() {
  const [json, setJson] = useState<unknown>({ enabled: true, name: "Original" })
  const [color, setColor] = useState("#2563eb")
  const [disabled, setDisabled] = useState(false)
  const [sheetVisible, setSheetVisible] = useState(true)
  const sheetState = useTableSheetState()
  const component = new URLSearchParams(window.location.search).get("component")

  if (component === "json") {
    return (
      <>
        <JsonEditor value={json} onChange={setJson} ariaLabel="JSON document" />
        <button type="button" onClick={() => setJson({ external: true })}>
          Load external JSON
        </button>
        <output>{JSON.stringify(json)}</output>
      </>
    )
  }

  if (component === "sheet") {
    return (
      <>
        <button type="button" onClick={() => setSheetVisible((visible) => !visible)}>
          Toggle sheet
        </button>
        <output aria-label="Sheet height">{sheetState.height}</output>
        {sheetVisible && (
          <AttrTableSheet state={sheetState} fullscreenLabel="Toggle fullscreen" closeLabel="Close">
            Table contents
          </AttrTableSheet>
        )}
      </>
    )
  }

  return (
    <>
      <ColorInput
        value={color}
        onTextChange={setColor}
        aria-label="Color"
        swatchLabel="Choose color"
        disabled={disabled}
      />
      <button type="button" onClick={() => setColor("")}>
        Clear externally
      </button>
      <button type="button" onClick={() => setDisabled((value) => !value)}>
        Toggle disabled
      </button>
      <output>{color}</output>
    </>
  )
}

const root = document.getElementById("root")
if (!root) throw new Error("Missing fixture root")
createRoot(root).render(<Fixture />)
