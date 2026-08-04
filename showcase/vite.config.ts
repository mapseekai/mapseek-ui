import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const showcaseRoot = fileURLToPath(new URL(".", import.meta.url))
const repositoryRoot = fileURLToPath(new URL("../", import.meta.url))

export default defineConfig({
  root: showcaseRoot,
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@/components/ui": fileURLToPath(new URL("../registry/ui", import.meta.url)),
      "@/components/blocks": fileURLToPath(new URL("../registry/blocks", import.meta.url)),
      "@/lib/utils": fileURLToPath(new URL("../registry/lib/utils.ts", import.meta.url)),
      "@/lib/mapseek-labels": fileURLToPath(new URL("../registry/lib/labels.ts", import.meta.url)),
      "@/lib/svg-data-uri": fileURLToPath(new URL("../registry/lib/svg-data-uri.ts", import.meta.url)),
      "@": repositoryRoot,
      "@registry": fileURLToPath(new URL("../registry", import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: process.env.VITE_OUT_DIR
      ? fileURLToPath(new URL(`../${process.env.VITE_OUT_DIR}`, import.meta.url))
      : `${repositoryRoot}packages/docs/out/showcase`,
    emptyOutDir: true,
  },
})
