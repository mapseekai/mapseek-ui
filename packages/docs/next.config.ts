import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const config: NextConfig = {
  basePath,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      "tw-animate-css": "./node_modules/tw-animate-css/dist/tw-animate.css",
    },
  },
}

export default createMDX()(config)
