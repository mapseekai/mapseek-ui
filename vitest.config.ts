import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

const repositoryRoot = fileURLToPath(new URL("./", import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@/components/ui": fileURLToPath(new URL("./registry/ui", import.meta.url)),
      "@/components/blocks": fileURLToPath(new URL("./registry/blocks", import.meta.url)),
      "@/lib/utils": fileURLToPath(new URL("./registry/lib/utils.ts", import.meta.url)),
      "@/lib/mapseek-labels": fileURLToPath(new URL("./registry/lib/labels.ts", import.meta.url)),
      "@/lib/svg-data-uri": fileURLToPath(
        new URL("./registry/lib/svg-data-uri.ts", import.meta.url),
      ),
      "@": repositoryRoot,
      "@registry": fileURLToPath(new URL("./registry", import.meta.url)),
    },
  },
})
