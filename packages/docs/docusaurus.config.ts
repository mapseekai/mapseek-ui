import path from "node:path"
import { fileURLToPath } from "node:url"
import type { Config, Plugin } from "@docusaurus/types"
import tailwindcss from "@tailwindcss/postcss"

const docsRoot = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(docsRoot, "../..")

function mapseekUiDocsPlugin(): Plugin {
  return {
    name: "mapseek-ui-docs",
    configurePostCss(options) {
      options.plugins.push(tailwindcss())
      return options
    },
    configureWebpack() {
      return {
        resolve: {
          alias: {
            "@/components/blocks": path.resolve(workspaceRoot, "registry/blocks"),
            "@/components/ui": path.resolve(workspaceRoot, "registry/ui"),
            "@/lib/mapseek-labels": path.resolve(workspaceRoot, "registry/lib/labels.ts"),
            "@/lib/svg-data-uri": path.resolve(workspaceRoot, "registry/lib/svg-data-uri.ts"),
            "@/lib/utils": path.resolve(workspaceRoot, "registry/lib/utils.ts"),
            "@": workspaceRoot,
            "@registry": path.resolve(workspaceRoot, "registry"),
          },
        },
        module: {
          rules: [
            {
              enforce: "pre",
              resourceQuery: /raw/,
              type: "javascript/auto",
              use: [path.resolve(docsRoot, "src/loaders/raw-source-loader.cjs")],
            },
          ],
        },
      }
    },
  }
}

const config: Config = {
  title: "Mapseek UI",
  tagline: "Source-installed map UI components for shadcn projects.",
  favicon: "img/mapseek.svg",
  url: "https://mapseek-ui.local",
  baseUrl: "/",
  organizationName: "mapseek",
  projectName: "ui",
  staticDirectories: ["static", "../../public"],
  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN", "en"],
    localeConfigs: {
      "zh-CN": { label: "简体中文" },
      en: { label: "English" },
    },
  },
  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],
  plugins: [mapseekUiDocsPlugin],
  themeConfig: {
    image: "img/mapseek.svg",
    navbar: {
      title: "Mapseek UI",
      logo: {
        alt: "Mapseek UI",
        src: "img/mapseek.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "Docs",
        },
        {
          to: "/getting-started/installation",
          position: "left",
          label: "Guides",
        },
        {
          to: "/components",
          position: "left",
          label: "Components",
        },
        {
          to: "/blocks",
          position: "left",
          label: "Blocks",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright ${new Date().getFullYear()} Mapseek UI.`,
    },
  },
}

export default config
