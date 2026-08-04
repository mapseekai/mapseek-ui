import { access } from "node:fs/promises"
import { expect, it } from "vitest"

const releaseArtifacts = [
  "packages/docs/out/index.html",
  "packages/docs/out/en/index.html",
  "packages/docs/out/components/button/index.html",
  "packages/docs/out/en/components/button/index.html",
  "public/r/registry.json",
  "public/r/button.json",
  "public/r/layer-panel.json",
] as const

it("emits the static docs and installable registry release artifacts", async () => {
  for (const artifact of releaseArtifacts) {
    await expect(access(artifact)).resolves.toBeUndefined()
  }
})
