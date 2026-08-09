import { ToggleGroup, ToggleGroupItem } from "@registry/ui/toggle-group"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    singleSelect: "单选",
    left: "左对齐",
    center: "居中",
    right: "右对齐",
    alignment: (value: string) => `对齐：${value}`,
    none: "无",
    multiSelect: "多选",
    bold: "加粗",
    italic: "斜体",
    underline: "下划线",
    disabled: "禁用",
    styles: (value: string) => `样式：${value}`,
  },
  en: {
    singleSelect: "Single select",
    left: "Left",
    center: "Center",
    right: "Right",
    alignment: (value: string) => `Alignment: ${value}`,
    none: "none",
    multiSelect: "Multi select",
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    disabled: "Disabled",
    styles: (value: string) => `Styles: ${value}`,
  },
}

export function ToggleGroupOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const [alignment, setAlignment] = useState(["left"])
  const [styles, setStyles] = useState(["bold"])
  const demoLabels = labels[locale]

  return (
    <div className="space-y-8">
      <section className="space-y-3" data-demo="toggle-group-single">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.singleSelect}
        </h4>
        <ToggleGroup
          className="max-w-full flex-wrap"
          value={alignment}
          onValueChange={setAlignment}
        >
          <ToggleGroupItem value="left">{demoLabels.left}</ToggleGroupItem>
          <ToggleGroupItem value="center">{demoLabels.center}</ToggleGroupItem>
          <ToggleGroupItem value="right">{demoLabels.right}</ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-muted-foreground" data-demo="toggle-group-alignment">
          {demoLabels.alignment(alignment.join(", ") || demoLabels.none)}
        </p>
      </section>

      <section className="space-y-3" data-demo="toggle-group-multiple">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.multiSelect}
        </h4>
        <ToggleGroup className="max-w-full flex-wrap" value={styles} onValueChange={setStyles}>
          <ToggleGroupItem value="bold">{demoLabels.bold}</ToggleGroupItem>
          <ToggleGroupItem value="italic">{demoLabels.italic}</ToggleGroupItem>
          <ToggleGroupItem value="underline">{demoLabels.underline}</ToggleGroupItem>
          <ToggleGroupItem value="disabled" disabled>
            {demoLabels.disabled}
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-muted-foreground" data-demo="toggle-group-styles">
          {demoLabels.styles(styles.join(", ") || demoLabels.none)}
        </p>
      </section>
    </div>
  )
}
