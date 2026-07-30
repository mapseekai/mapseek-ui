import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const fixturePackages = [
  fileURLToPath(new URL("../../fixtures/vite-react-template/package.json", import.meta.url)),
  fileURLToPath(new URL("../../fixtures/vite-react-smoke/package.json", import.meta.url)),
]

describe("Vite React fixtures", () => {
  it("typechecks the app project that includes installed sources", async () => {
    const packages = await Promise.all(fixturePackages.map(async (path) => JSON.parse(await readFile(path, "utf8")) as {
      scripts?: Record<string, string>
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }))

    for (const packageJson of packages) {
      expect(packageJson.scripts?.typecheck).toBe("tsc --noEmit -p tsconfig.app.json")
      expect(packageJson.dependencies?.typescript).toBe("^5.9.3")
      expect(packageJson.devDependencies).toMatchObject({ "@types/react": "latest", "@types/react-dom": "latest" })
    }
  })
})
