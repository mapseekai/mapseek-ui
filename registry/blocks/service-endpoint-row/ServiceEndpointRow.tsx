// biome-ignore-all lint/a11y/noNoninteractiveTabindex: The horizontally scrollable URL must be keyboard reachable.
// biome-ignore-all lint/a11y/useSemanticElements: The URL must retain native code semantics while exposing a named region.
import { IconExternalLink } from "@tabler/icons-react"
import { CopyButton } from "@/components/ui/copy-button"
import { IconButton, iconButtonVariants } from "@/components/ui/icon-button"
import { Tag } from "@/components/ui/tag"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { ServiceEndpointRowProps } from "./types"

/**
 * 单个服务地址行：图标 + 标题/副标题 + 方法标签 + URL + 复制 / 新窗口打开。
 * 纯展示 block：文案经 props，复制结果经回调，打开行为支持链接或应用回调。
 */
export function ServiceEndpointRow({
  title,
  subtitle,
  method,
  url,
  onCopy,
  onCopyError,
  copyLabel,
  copiedLabel,
  icon,
  openDisabled,
  openTooltip,
  openLabel,
  openHref,
  onOpen,
}: ServiceEndpointRowProps) {
  const urlSegments = getUrlSegments(url)
  const isOpenDisabled = Boolean(openDisabled || (!openHref && !onOpen))

  return (
    <div
      data-slot="service-endpoint-row"
      className="flex w-full min-w-0 max-w-full flex-col gap-2 overflow-hidden border border-border p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {icon ? (
            <span aria-hidden="true" className="shrink-0">
              {icon}
            </span>
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col">
            <span title={title} className="truncate text-headline-sm">
              {title}
            </span>
            <span title={subtitle} className="mono truncate text-body-sm text-muted-foreground">
              {subtitle}
            </span>
          </div>
        </div>
        <Tag color="gray" variant="outline" translate="no">
          {method}
        </Tag>
      </div>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-1.5">
        <code
          data-slot="service-endpoint-url"
          role="region"
          tabIndex={0}
          dir="ltr"
          translate="no"
          aria-label={url}
          title={url}
          className="mono scroll-fade-x flex h-8 min-w-0 items-center overflow-x-auto whitespace-nowrap border border-input bg-input-surface px-2 text-body-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-(length:--focus-ring-width) focus-visible:ring-ring/20"
        >
          {urlSegments.map((segment) => (
            <span
              key={segment.key}
              className={isTemplateParameter(segment.part) ? "font-medium" : undefined}
            >
              {segment.part}
            </span>
          ))}
        </code>
        <CopyButton
          content={url}
          aria-label={copyLabel}
          label={copyLabel}
          copiedLabel={copiedLabel ?? copyLabel}
          title={copyLabel}
          iconSize="md"
          onCopy={onCopy}
          onCopyError={onCopyError}
        />
        {openHref && !isOpenDisabled ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href={openHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={openLabel}
                  title={openLabel}
                  className={iconButtonVariants({ size: "md" })}
                  onClick={onOpen}
                >
                  <IconExternalLink stroke={1.5} />
                </a>
              }
            />
            <TooltipContent>{openTooltip || openLabel}</TooltipContent>
          </Tooltip>
        ) : (
          <IconButton
            size="md"
            aria-disabled={isOpenDisabled || undefined}
            label={openLabel}
            tooltip={openTooltip || openLabel}
            onClick={(event) => {
              if (isOpenDisabled) {
                event.preventDefault()
                return
              }
              onOpen?.()
            }}
          >
            <IconExternalLink stroke={1.5} />
          </IconButton>
        )}
      </div>
    </div>
  )
}

function isTemplateParameter(part: string) {
  return /^\{.+\}$/.test(part)
}

function getUrlSegments(url: string) {
  const counts = new Map<string, number>()
  return url
    .split(/(\{[^}]+\})/g)
    .filter((part) => part.length > 0)
    .map((part) => {
      const occurrence = counts.get(part) ?? 0
      counts.set(part, occurrence + 1)
      return { key: `${part}:${occurrence}`, part }
    })
}
