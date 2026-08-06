import { Button } from "@registry/ui/button"
import {
  ButtonRadioGroup,
  ButtonRadioGroupItem,
  type ButtonRadioGroupSize,
  type ButtonRadioGroupVariant,
} from "@registry/ui/button-radio-group"
import { Separator } from "@registry/ui/separator"
import { IconBox, IconMap2, IconStack2 } from "@tabler/icons-react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

type Option = {
  readonly label: string
  readonly value: string
}

const sizes = [
  { label: "XS · 24px", value: "xs" },
  { label: "SM · 28px", value: "sm" },
  { label: "Default · 32px", value: "default" },
  { label: "LG · 36px", value: "lg" },
] as const satisfies ReadonlyArray<{ label: string; value: ButtonRadioGroupSize }>

const variants = [
  { label: "Default", value: "default" },
  { label: "Soft", value: "soft" },
] as const satisfies ReadonlyArray<{ label: string; value: ButtonRadioGroupVariant }>

const labels = {
  "zh-CN": {
    add: "添加图层",
    dynamicTitle: "按钮式单选",
    groupLabel: "选择活动图层",
    iconOnlyLabel: "选择视图（仅图标）",
    iconsTitle: "图标选项",
    layer: (index: number) => `图层 ${index}`,
    layers: "图层",
    map: "地图",
    resources: "资源",
    selected: "当前选择",
    sizesTitle: "尺寸对比",
    variantsTitle: "选中态变体",
  },
  en: {
    add: "Add layer",
    dynamicTitle: "Button radio group",
    groupLabel: "Choose an active layer",
    iconOnlyLabel: "Choose a view (icons only)",
    iconsTitle: "Icon options",
    layer: (index: number) => `Layer ${index}`,
    layers: "Layers",
    map: "Map",
    resources: "Resources",
    selected: "Selected",
    sizesTitle: "Size comparison",
    variantsTitle: "Selected-state variants",
  },
}

function initialOptions(demoLabels: (typeof labels)["zh-CN"]): Option[] {
  return [1, 2, 3].map((index) => ({ label: demoLabels.layer(index), value: `layer-${index}` }))
}

export function ButtonRadioGroupOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [options, setOptions] = useState(() => initialOptions(demoLabels))
  const [value, setValue] = useState("layer-1")
  const [values, setValues] = useState<Record<ButtonRadioGroupSize, string>>({
    xs: "layer-1",
    sm: "layer-1",
    default: "layer-1",
    lg: "layer-1",
  })
  const selected = options.find((option) => option.value === value)

  function addOption() {
    setOptions((current) => {
      const index = current.length + 1
      return [...current, { label: demoLabels.layer(index), value: `layer-${index}` }]
    })
  }

  return (
    <section className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-3" data-demo="button-radio-group-controlled">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.dynamicTitle}
        </h4>
        <ButtonRadioGroup aria-label={demoLabels.groupLabel} value={value} onValueChange={setValue}>
          {options.map((option) => (
            <ButtonRadioGroupItem
              key={option.value}
              data-demo-action={`button-radio-group-${option.value}`}
              value={option.value}
            >
              {option.label}
            </ButtonRadioGroupItem>
          ))}
        </ButtonRadioGroup>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-demo-action="button-radio-group-add"
            onClick={addOption}
          >
            {demoLabels.add}
          </Button>
          <p className="text-xs text-muted-foreground" data-demo="button-radio-group-value">
            {demoLabels.selected}: {selected?.label}
          </p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3" data-demo="button-radio-group-variants">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.variantsTitle}
        </h4>
        {variants.map(({ label, value: variant }) => (
          <div className="flex flex-col gap-1.5" key={variant}>
            <span className="text-xs font-medium text-foreground">{label}</span>
            <ButtonRadioGroup
              aria-label={`${demoLabels.groupLabel} · ${label}`}
              data-demo-variant={variant}
              defaultValue="layer-2"
              variant={variant}
            >
              {[1, 2, 3].map((index) => (
                <ButtonRadioGroupItem key={index} value={`layer-${index}`}>
                  {demoLabels.layer(index)}
                </ButtonRadioGroupItem>
              ))}
            </ButtonRadioGroup>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-3" data-demo="button-radio-group-icons">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.iconsTitle}
        </h4>
        <ButtonRadioGroup
          aria-label={demoLabels.iconsTitle}
          defaultValue="map"
          size="lg"
          variant="default"
        >
          <ButtonRadioGroupItem value="map" icon={<IconMap2 />}>
            {demoLabels.map}
          </ButtonRadioGroupItem>
          <ButtonRadioGroupItem value="layers" icon={<IconStack2 />}>
            {demoLabels.layers}
          </ButtonRadioGroupItem>
          <ButtonRadioGroupItem value="resources" icon={<IconBox />}>
            {demoLabels.resources}
          </ButtonRadioGroupItem>
        </ButtonRadioGroup>
        <ButtonRadioGroup
          aria-label={demoLabels.iconOnlyLabel}
          defaultValue="layers"
          size="sm"
          variant="soft"
        >
          <ButtonRadioGroupItem value="map" icon={<IconMap2 />} aria-label={demoLabels.map} />
          <ButtonRadioGroupItem
            value="layers"
            icon={<IconStack2 />}
            aria-label={demoLabels.layers}
          />
          <ButtonRadioGroupItem
            value="resources"
            icon={<IconBox />}
            aria-label={demoLabels.resources}
          />
        </ButtonRadioGroup>
      </div>

      <Separator />

      <div className="flex flex-col gap-4" data-demo="button-radio-group-sizes">
        <h4 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase">
          {demoLabels.sizesTitle}
        </h4>
        {sizes.map(({ label, value: size }) => (
          <div className="flex flex-col gap-1.5" key={size}>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-foreground">{label}</span>
              <span className="text-muted-foreground">
                {demoLabels.selected}: {values[size].replace("layer-", "")}
              </span>
            </div>
            <ButtonRadioGroup
              aria-label={`${demoLabels.groupLabel} · ${label}`}
              data-demo-size={size}
              size={size}
              value={values[size]}
              onValueChange={(value) => setValues((current) => ({ ...current, [size]: value }))}
            >
              {[1, 2, 3].map((index) => (
                <ButtonRadioGroupItem
                  key={index}
                  data-demo-action={`button-radio-group-${size}-layer-${index}`}
                  value={`layer-${index}`}
                >
                  {demoLabels.layer(index)}
                </ButtonRadioGroupItem>
              ))}
            </ButtonRadioGroup>
          </div>
        ))}
      </div>
    </section>
  )
}
