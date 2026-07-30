import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const fixturePackage = fileURLToPath(new URL("../../fixtures/vite-react-template/package.json", import.meta.url))

describe("Vite React fixture", () => {
  it("typechecks the app project that includes installed sources", async () => {
    const packageJson = JSON.parse(await readFile(fixturePackage, "utf8")) as { scripts?: Record<string, string>; devDependencies?: Record<string, string> }
    expect(packageJson.scripts?.typecheck).toBe("tsc --noEmit -p tsconfig.app.json")
    expect(packageJson.devDependencies).toMatchObject({ "@types/react": "latest", "@types/react-dom": "latest" })
  })
})
