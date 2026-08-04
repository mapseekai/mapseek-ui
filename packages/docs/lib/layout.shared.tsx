import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import Image from "next/image"

import { LocaleSwitcher } from "@/src/components/LocaleSwitcher"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image src={`${basePath}/img/mapseek.png`} alt="Mapseek UI" width={24} height={24} />
          Mapseek UI
        </>
      ),
    },
    links: [
      { text: "Docs", url: "/", active: "url" },
      { text: "Guides", url: "/getting-started/installation", active: "nested-url" },
      { text: "Components", url: "/components", active: "nested-url" },
      { text: "Blocks", url: "/blocks", active: "nested-url" },
      { text: "Showcase", url: `${basePath}/showcase/`, external: true },
      { type: "custom", children: <LocaleSwitcher /> },
    ],
    githubUrl: "https://github.com/mapseekai/mapseek-ui",
  }
}
