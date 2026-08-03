import { ProductLogo } from "@registry/blocks/product-logo"
import { Button } from "@registry/ui/button"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

type ProductLogoFixture = {
  readonly src: string
  readonly alt: string
  readonly label: string
  readonly note: string
}

const labels = {
  "zh-CN": {
    toggleText: "切换文字",
    showing: "显示文字",
    hidden: "隐藏文字",
    logos: [
      { src: "/img/mapseek.png", alt: "Mapseek Cloud", label: "云服务", note: "主项目入口" },
      { src: "/img/mapseek.png", alt: "Mapseek Muse", label: "Muse", note: "样式编辑器" },
      { src: "/img/mapseek.png", alt: "Mapseek Loom", label: "Loom", note: "矢量编辑器" },
    ],
  },
  en: {
    toggleText: "Toggle text",
    showing: "Showing text",
    hidden: "Text hidden",
    logos: [
      {
        src: "/img/mapseek.png",
        alt: "Mapseek Cloud",
        label: "Cloud",
        note: "Primary project entry",
      },
      { src: "/img/mapseek.png", alt: "Mapseek Muse", label: "Muse", note: "Style editor" },
      { src: "/img/mapseek.png", alt: "Mapseek Loom", label: "Loom", note: "Vector editor" },
    ],
  },
}

export function ProductLogoDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale]
  const [showText, setShowText] = useState(true)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-demo-action="product-logo-toggle"
          onClick={() => setShowText((current) => !current)}
        >
          {demoLabels.toggleText}
        </Button>
        <span data-demo-status="product-logo" className="font-mono text-xs text-muted-foreground">
          {showText ? demoLabels.showing : demoLabels.hidden}
        </span>
      </div>
      <section className="grid gap-3 lg:grid-cols-3">
        {demoLabels.logos.map((item) => (
          <div
            key={item.alt}
            className="flex min-h-[220px] flex-col justify-between border border-border bg-background p-5"
          >
            <div>
              <p className="font-mono text-[11px] font-semibold text-muted-foreground uppercase">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
            </div>
            <div className="flex justify-center py-4">
              <ProductLogo src={item.src} alt={item.alt} size={28} showText={false} />
            </div>
          </div>
        ))}
      </section>
      <section className="flex flex-wrap items-center gap-6 border border-border bg-muted/30 p-5">
        {demoLabels.logos.map((item) => (
          <ProductLogo
            key={item.alt}
            src={item.src}
            alt={item.alt}
            label={item.alt}
            size={28}
            showText={showText}
          />
        ))}
      </section>
    </div>
  )
}
