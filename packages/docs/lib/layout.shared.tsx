import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

import { LocaleSwitcher } from "@/src/components/LocaleSwitcher"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <img src="/img/mapseek.png" alt="Mapseek UI" width={24} height={24} />
          Mapseek UI
        </>
      ),
    },
    links: [
      { text: "Docs", url: "/", active: "url" },
      { text: "Guides", url: "/getting-started/installation", active: "nested-url" },
      { text: "Components", url: "/components", active: "nested-url" },
      { text: "Blocks", url: "/blocks", active: "nested-url" },
      { text: "Showcase", url: "/showcase/", external: true },
      { type: "custom", children: <LocaleSwitcher /> },
    ],
    githubUrl: "https://github.com/mapseek/mapseek-ui",
  }
}
