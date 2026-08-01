import {
  StyleFilterEditorActions,
  StyleFilterEditorInfo,
  StyleFilterEditorInlineError,
  StyleFilterEditorRow,
  StyleFilterEditorSingle,
  StyleFilterEditorUnsupported,
} from "@registry/blocks/style-filter-editor"
import { Button } from "@registry/ui/button"
import { Input } from "@registry/ui/input"
import { Select } from "@registry/ui/select"
import { IconPlaylistAdd, IconTrash } from "@tabler/icons-react"
import { useState } from "react"

export const zhStyleFilterEditorLabels = {
  property: "属性",
  value: "值",
  add: "添加过滤器",
  remove: "删除过滤器",
  invalid: "过滤条件值不能为空。",
  unsupported: "不支持嵌套过滤器。",
  upgrade: "升级为表达式",
  info: "已检测到旧版过滤器，可切换回过滤器编辑器继续编辑。",
  added: "已添加过滤器",
  removed: "已删除过滤器",
  operator: "运算符",
}

export const enStyleFilterEditorLabels = {
  property: "Property",
  value: "Value",
  add: "Add filter",
  remove: "Remove filter",
  invalid: "Filter value is required.",
  unsupported: "Nested filters are not supported.",
  upgrade: "Upgrade to expression",
  info: "A legacy filter was detected and can be edited in the filter editor.",
  added: "Added filter",
  removed: "Removed filter",
  operator: "Operator",
}

type FilterRow = {
  readonly id: string
  readonly value: string
}

function FilterOperator({ label }: { readonly label: string }) {
  return (
    <Select aria-label={label} value="==" onValueChange={() => undefined}>
      <Select.Item value="==">==</Select.Item>
      <Select.Item value="!=">!=</Select.Item>
    </Select>
  )
}

export function StyleFilterEditorDemo({
  labels,
}: {
  readonly labels: typeof zhStyleFilterEditorLabels
}) {
  const [rows, setRows] = useState<FilterRow[]>([{ id: "class-park", value: "park" }])
  const [status, setStatus] = useState(labels.info)

  function addRow() {
    setRows((current) => [...current, { id: `class-water-${current.length + 1}`, value: "water" }])
    setStatus(labels.added)
  }

  function removeRow(id: string) {
    setRows((current) => current.filter((row) => row.id !== id))
    setStatus(labels.removed)
  }

  return (
    <section data-demo="style-filter-editor" className="max-w-2xl space-y-4">
      <div className="space-y-2 border border-border bg-card p-3">
        {rows.map((row, index) => (
          <StyleFilterEditorRow
            key={row.id}
            action={
              <Button
                type="button"
                size="icon-xs"
                variant="destructive"
                aria-label={`${labels.remove}: ${index + 1}`}
                data-demo-action={`style-filter-editor-remove-${index}`}
                onClick={() => removeRow(row.id)}
              >
                <IconTrash />
              </Button>
            }
          >
            <StyleFilterEditorSingle
              property={<Input aria-label={labels.property} value="class" readOnly />}
              operator={<FilterOperator label={labels.operator} />}
              value={<Input aria-label={labels.value} value={row.value} readOnly />}
            />
          </StyleFilterEditorRow>
        ))}
        <StyleFilterEditorInlineError>{labels.invalid}</StyleFilterEditorInlineError>
        <StyleFilterEditorActions>
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-demo-action="style-filter-editor-add"
            onClick={addRow}
          >
            <IconPlaylistAdd />
            {labels.add}
          </Button>
        </StyleFilterEditorActions>
      </div>
      <StyleFilterEditorUnsupported
        action={
          <Button type="button" size="sm">
            {labels.upgrade}
          </Button>
        }
      >
        {labels.unsupported}
      </StyleFilterEditorUnsupported>
      <StyleFilterEditorInfo>{labels.info}</StyleFilterEditorInfo>
      <p data-demo-status="style-filter-editor" className="m-0 font-mono text-xs">
        {status}
      </p>
    </section>
  )
}
