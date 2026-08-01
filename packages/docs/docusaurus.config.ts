import type { Config, Preset } from "@docusaurus/types"

const config: Config = {
  title: "Mapseek UI",
  tagline: "Source-installed map UI components for shadcn projects.",
  favicon: "img/mapseek.svg",
  url: "https://mapseek-ui.local",
  baseUrl: "/",
  organizationName: "mapseek",
  projectName: "ui",
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
      } satisfies Preset.Options,
    ],
  ],
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
