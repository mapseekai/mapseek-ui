import { writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import themeRegistry from "../registry/theme/registry.json"

class MissingThemeError extends Error {
  constructor() {
    super("The registry does not contain the Mapseek theme item")
    this.name = "MissingThemeError"
  }
}

function serializeVariables(variables: Record<string, string>): string {
  return Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n")
}

// Registry `css` blocks are nested at-rule trees:
// - string value              → declaration (`prop: value;`)
// - empty object value        → statement (`@import "x";`, `@apply …;`)
// - non-empty object value    → nested rule (`selector { … }`, `@layer { … }`)
function serializeCssBlock(block: Record<string, unknown>, depth = 0): string {
  const pad = "  ".repeat(depth)
  const lines: string[] = []
  for (const [key, value] of Object.entries(block)) {
    if (typeof value === "string") {
      lines.push(`${pad}${key}: ${value};`)
    } else if (value && typeof value === "object" && Object.keys(value).length === 0) {
      lines.push(`${pad}${key};`)
    } else if (value && typeof value === "object") {
      lines.push(
        `${pad}${key} {`,
        serializeCssBlock(value as Record<string, unknown>, depth + 1),
        `${pad}}`,
      )
    }
  }
  return lines.join("\n")
}

const theme = themeRegistry.items.find((item) => item.name === "theme")
if (!theme) throw new MissingThemeError()

const cssBlock = theme.css as Record<string, unknown>
const imports = Object.keys(cssBlock).filter((key) => key.startsWith("@import"))
const rest = Object.fromEntries(
  Object.entries(cssBlock).filter(([key]) => !key.startsWith("@import")),
)

const stylesheet = `/* biome-ignore-all format: generated registry theme */

${imports.join(";\n")};

${serializeCssBlock(rest)}

@theme inline {
${serializeVariables(theme.cssVars.theme)}
}

:root {
${serializeVariables(theme.cssVars.light)}
}

.dark,
[data-theme="dark"] {
${serializeVariables(theme.cssVars.dark)}
}
`

await Promise.all([
  writeFile(resolve(import.meta.dirname, "../packages/docs/app/theme.generated.css"), stylesheet),
  writeFile(resolve(import.meta.dirname, "../showcase/src/theme.generated.css"), stylesheet),
])
