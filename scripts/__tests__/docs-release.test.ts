import { access } from "node:fs/promises"
import { expect, it } from "vitest"

const releaseArtifacts = [
  "packages/docs/build/index.html",
  "packages/docs/build/en/index.html",
  "packages/docs/build/components/button/index.html",
  "packages/docs/build/en/components/button/index.html",
  "packages/docs/build/r/registry.json",
  "packages/docs/build/r/button.json",
  "packages/docs/build/r/layer-panel.json",
] as const

it("emits the static docs and installable registry release artifacts", async () => {
  for (const artifact of releaseArtifacts) {
    await expect(access(artifact)).resolves.toBeNull()
  }
})
