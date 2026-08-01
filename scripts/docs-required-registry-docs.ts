export type RequiredRegistryDoc = {
  readonly category: "primitive" | "block"
  readonly examples: readonly string[]
}

export const requiredRegistryDocs: ReadonlyMap<string, RequiredRegistryDoc> = new Map([
  [
    "accordion",
    {
      category: "primitive",
      examples: ["accordion/overview"],
    },
  ],
  [
    "avatar",
    {
      category: "primitive",
      examples: ["avatar/overview"],
    },
  ],
  [
    "badge",
    {
      category: "primitive",
      examples: ["badge/overview"],
    },
  ],
  [
    "button",
    {
      category: "primitive",
      examples: ["button/basic", "button/variants", "button/sizes"],
    },
  ],
  [
    "card",
    {
      category: "primitive",
      examples: ["card/overview"],
    },
  ],
  [
    "chart",
    {
      category: "primitive",
      examples: ["chart/overview"],
    },
  ],
  [
    "checkbox",
    {
      category: "primitive",
      examples: ["checkbox/overview"],
    },
  ],
  [
    "collapsible",
    {
      category: "primitive",
      examples: ["collapsible/overview"],
    },
  ],
  [
    "combobox",
    {
      category: "primitive",
      examples: ["combobox/overview"],
    },
  ],
  [
    "command",
    {
      category: "primitive",
      examples: ["command/overview"],
    },
  ],
  [
    "confirm-dialog",
    {
      category: "primitive",
      examples: ["confirm-dialog/overview"],
    },
  ],
  [
    "context-menu",
    {
      category: "primitive",
      examples: ["context-menu/overview"],
    },
  ],
  [
    "dialog",
    {
      category: "primitive",
      examples: ["dialog/basic", "dialog/confirmation", "dialog/long-content"],
    },
  ],
  [
    "dropdown-menu",
    {
      category: "primitive",
      examples: ["dropdown-menu/overview"],
    },
  ],
  [
    "empty",
    {
      category: "primitive",
      examples: ["empty/overview"],
    },
  ],
  [
    "field",
    {
      category: "primitive",
      examples: ["field/overview"],
    },
  ],
  [
    "icon-button",
    {
      category: "primitive",
      examples: ["icon-button/overview"],
    },
  ],
  [
    "input",
    {
      category: "primitive",
      examples: ["input/overview"],
    },
  ],
  [
    "input-group",
    {
      category: "primitive",
      examples: ["input-group/overview"],
    },
  ],
  [
    "json-viewer",
    {
      category: "primitive",
      examples: ["json-viewer/overview"],
    },
  ],
  [
    "label",
    {
      category: "primitive",
      examples: ["label/overview"],
    },
  ],
  [
    "pagination",
    {
      category: "primitive",
      examples: ["pagination/overview"],
    },
  ],
  [
    "popover",
    {
      category: "primitive",
      examples: ["popover/overview"],
    },
  ],
  [
    "progress",
    {
      category: "primitive",
      examples: ["progress/overview"],
    },
  ],
  [
    "separator",
    {
      category: "primitive",
      examples: ["separator/overview"],
    },
  ],
  [
    "select",
    {
      category: "primitive",
      examples: ["select/overview"],
    },
  ],
  [
    "sheet",
    {
      category: "primitive",
      examples: ["sheet/overview"],
    },
  ],
  [
    "skeleton",
    {
      category: "primitive",
      examples: ["skeleton/overview"],
    },
  ],
  [
    "sonner",
    {
      category: "primitive",
      examples: ["sonner/overview"],
    },
  ],
  [
    "slider",
    {
      category: "primitive",
      examples: ["slider/overview"],
    },
  ],
  [
    "switch",
    {
      category: "primitive",
      examples: ["switch/overview"],
    },
  ],
  [
    "table",
    {
      category: "primitive",
      examples: ["table/overview"],
    },
  ],
  [
    "tabs",
    {
      category: "primitive",
      examples: ["tabs/overview"],
    },
  ],
  [
    "textarea",
    {
      category: "primitive",
      examples: ["textarea/overview"],
    },
  ],
  [
    "tooltip",
    {
      category: "primitive",
      examples: ["tooltip/overview"],
    },
  ],
  [
    "toggle",
    {
      category: "primitive",
      examples: ["toggle/overview"],
    },
  ],
  [
    "toggle-group",
    {
      category: "primitive",
      examples: ["toggle-group/overview"],
    },
  ],
  [
    "app-top-bar",
    {
      category: "block",
      examples: ["app-top-bar/overview"],
    },
  ],
  [
    "add-field-form",
    {
      category: "block",
      examples: ["add-field-form/overview"],
    },
  ],
  [
    "attr-inspector",
    {
      category: "block",
      examples: ["attr-inspector/overview"],
    },
  ],
  [
    "attr-table",
    {
      category: "block",
      examples: ["attr-table/overview"],
    },
  ],
  [
    "crs-picker",
    {
      category: "block",
      examples: ["crs-picker/overview"],
    },
  ],
  [
    "filter-panel",
    {
      category: "block",
      examples: ["filter-panel/overview"],
    },
  ],
  [
    "form-inputs",
    {
      category: "block",
      examples: ["form-inputs/overview"],
    },
  ],
  [
    "geojson-view",
    {
      category: "block",
      examples: ["geojson-view/overview"],
    },
  ],
  [
    "json-editor",
    {
      category: "block",
      examples: ["json-editor/overview"],
    },
  ],
  [
    "layer-panel",
    {
      category: "block",
      examples: ["layer-panel/basic", "layer-panel/groups"],
    },
  ],
  [
    "layer-editor-group",
    {
      category: "block",
      examples: ["layer-editor-group/overview"],
    },
  ],
  [
    "layer-style-editor",
    {
      category: "block",
      examples: ["layer-style-editor/overview"],
    },
  ],
  [
    "layout",
    {
      category: "block",
      examples: ["layout/overview"],
    },
  ],
  [
    "map-controls",
    {
      category: "block",
      examples: ["map-controls/overview"],
    },
  ],
  [
    "map-coordinate-status",
    {
      category: "block",
      examples: ["map-coordinate-status/overview"],
    },
  ],
  [
    "map-switcher",
    {
      category: "block",
      examples: ["map-switcher/overview"],
    },
  ],
  [
    "number-range-input",
    {
      category: "block",
      examples: ["number-range-input/overview"],
    },
  ],
  [
    "pixel-probe",
    {
      category: "block",
      examples: ["pixel-probe/overview"],
    },
  ],
  [
    "schema-form",
    {
      category: "block",
      examples: ["schema-form/overview"],
    },
  ],
  [
    "split-tool-picker",
    {
      category: "block",
      examples: ["split-tool-picker/overview"],
    },
  ],
] as const)
