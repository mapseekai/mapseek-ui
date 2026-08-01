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
    "collapsible",
    {
      category: "primitive",
      examples: ["collapsible/overview"],
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
    "json-viewer",
    {
      category: "primitive",
      examples: ["json-viewer/overview"],
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
    "skeleton",
    {
      category: "primitive",
      examples: ["skeleton/overview"],
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
    "layer-panel",
    {
      category: "block",
      examples: ["layer-panel/basic", "layer-panel/groups"],
    },
  ],
] as const)
