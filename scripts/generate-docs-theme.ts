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

const theme = themeRegistry.items.find((item) => item.name === "theme")
if (!theme) throw new MissingThemeError()

const stylesheet = `/* biome-ignore-all format: generated registry theme */

@theme inline {
${serializeVariables(theme.cssVars.theme)}
}

:root {
${serializeVariables(theme.cssVars.light)}
}

.dark {
${serializeVariables(theme.cssVars.dark)}
}
`

await writeFile(
  resolve(import.meta.dir, "../packages/docs/src/css/theme.generated.css"),
  stylesheet,
)
