import { CopyButton } from "@registry/ui/copy-button"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    copy: "复制",
    copied: "已复制",
    iconLabel: "复制数据集标识",
  },
  en: {
    copy: "Copy",
    copied: "Copied",
    iconLabel: "Copy dataset identifier",
  },
}

export function CopyButtonOverviewDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const copy = labels[locale]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyButton
        content="dataset.8f12-a91c"
        aria-label={copy.iconLabel}
        copiedLabel={copy.copied}
        data-demo-action="copy-button-icon"
      />
      <CopyButton
        content="dataset.8f12-a91c"
        variant="text"
        label={copy.copy}
        copiedLabel={copy.copied}
        data-demo-action="copy-button-text"
      />
      <CopyButton
        content="dataset.8f12-a91c"
        variant="ghost"
        label={copy.copy}
        copiedLabel={copy.copied}
        data-demo-action="copy-button-ghost"
      />
    </div>
  )
}
