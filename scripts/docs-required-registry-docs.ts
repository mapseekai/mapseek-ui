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
    "dialog",
    {
      category: "primitive",
      examples: ["dialog/basic", "dialog/confirmation", "dialog/long-content"],
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
    "skeleton",
    {
      category: "primitive",
      examples: ["skeleton/overview"],
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
    "textarea",
    {
      category: "primitive",
      examples: ["textarea/overview"],
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
    "layer-panel",
    {
      category: "block",
      examples: ["layer-panel/basic", "layer-panel/groups"],
    },
  ],
] as const)
