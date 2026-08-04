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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@registry/ui/select"
import { IconPlaylistAdd, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
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
  },
  en: {
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
  },
}

type FilterRow = {
  readonly id: string
  readonly value: string
}

function FilterOperator({ label }: { readonly label: string }) {
  return (
    <Select value="==" onValueChange={() => undefined}>
      <SelectTrigger aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="==">==</SelectItem>
          <SelectItem value="!=">!=</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function StyleFilterEditorDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [rows, setRows] = useState<FilterRow[]>([{ id: "class-park", value: "park" }])
  const [status, setStatus] = useState(demoLabels.info)

  function addRow() {
    setRows((current) => [...current, { id: `class-water-${current.length + 1}`, value: "water" }])
    setStatus(demoLabels.added)
  }

  function removeRow(id: string) {
    setRows((current) => current.filter((row) => row.id !== id))
    setStatus(demoLabels.removed)
  }

  return (
    <section className="max-w-2xl space-y-4">
      <div className="space-y-2 border border-border bg-card p-3">
        {rows.map((row, index) => (
          <StyleFilterEditorRow
            key={row.id}
            action={
              <Button
                type="button"
                size="icon-xs"
                variant="destructive"
                aria-label={`${demoLabels.remove}: ${index + 1}`}
                data-demo-action={`style-filter-editor-remove-${index}`}
                onClick={() => removeRow(row.id)}
              >
                <IconTrash />
              </Button>
            }
          >
            <StyleFilterEditorSingle
              property={<Input aria-label={demoLabels.property} value="class" readOnly />}
              operator={<FilterOperator label={demoLabels.operator} />}
              value={<Input aria-label={demoLabels.value} value={row.value} readOnly />}
            />
          </StyleFilterEditorRow>
        ))}
        <StyleFilterEditorInlineError>{demoLabels.invalid}</StyleFilterEditorInlineError>
        <StyleFilterEditorActions>
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-demo-action="style-filter-editor-add"
            onClick={addRow}
          >
            <IconPlaylistAdd />
            {demoLabels.add}
          </Button>
        </StyleFilterEditorActions>
      </div>
      <StyleFilterEditorUnsupported
        action={
          <Button type="button" size="sm">
            {demoLabels.upgrade}
          </Button>
        }
      >
        {demoLabels.unsupported}
      </StyleFilterEditorUnsupported>
      <StyleFilterEditorInfo>{demoLabels.info}</StyleFilterEditorInfo>
      <p data-demo-status="style-filter-editor" className="m-0 font-mono text-xs">
        {status}
      </p>
    </section>
  )
}
