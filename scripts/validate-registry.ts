import { resolve } from "node:path"
import { assertValidCatalog, BASE_COMPONENTS, BLOCKS } from "./registry-model"

const repoRoot = resolve(import.meta.dir, "..")
const items = await assertValidCatalog(repoRoot)
if (Bun.argv.includes("--complete")) {
  const expected = new Set<string>([...BASE_COMPONENTS, ...BLOCKS])
  const actual = new Set(items.map((item) => item.name))
  const unexpected = [...actual].filter((name) => !expected.has(name))
  const missing = [...expected].filter((name) => !actual.has(name))
  if (unexpected.length || missing.length) throw new Error(`inventory mismatch: missing ${missing.join(", ")}; unexpected ${unexpected.join(", ")}`)
}
