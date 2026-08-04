import { IconExternalLink } from "@tabler/icons-react"
import { CopyButton } from "@/components/ui/copy-button"
import { IconButton } from "@/components/ui/icon-button"
import { InputGroup, InputGroupText } from "@/components/ui/input-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { ServiceEndpointRowProps } from "./types"

/**
 * 单个服务地址行：图标 + 标题/副标题 + 方法标签 + URL + 复制 / 新窗口打开。
 * 纯展示 block：文案经 props，复制/打开经回调；无 i18n/toast/clipboard。
 */
export function ServiceEndpointRow({
  title,
  subtitle,
  method,
  url,
  onCopy,
  copyLabel,
  icon,
  openDisabled,
  openTooltip,
  openLabel,
  onOpen,
}: ServiceEndpointRowProps) {
  const urlSegments = getUrlSegments(url)

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-2 overflow-hidden border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {icon}
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-medium">{title}</span>
            <span className="mono text-[11px] uppercase text-muted-foreground">{subtitle}</span>
          </div>
        </div>
        <span className="mono shrink-0 border border-info/25 bg-info/10 px-1.5 py-0.5 text-[11px] text-info">
          {method}
        </span>
      </div>
      <div className="flex min-w-0 items-center gap-1.5">
        <InputGroup className="h-auto min-h-8 w-auto flex-1 overflow-hidden bg-muted/40">
          <InputGroupText className="mono min-w-0 max-w-full flex-1 gap-0 overflow-x-auto whitespace-nowrap px-2 py-1.5 text-[11px]">
            {urlSegments.map((segment) =>
              /^\{.+\}$/.test(segment.part) ? (
                <span key={segment.key} className="font-medium text-warning">
                  {segment.part}
                </span>
              ) : (
                <span key={segment.key} className="text-muted-foreground">
                  {segment.part}
                </span>
              ),
            )}
          </InputGroupText>
        </InputGroup>
        <CopyButton
          content={url}
          aria-label={copyLabel}
          label={copyLabel}
          title={copyLabel}
          onCopy={onCopy}
        />
        <Tooltip>
          <TooltipTrigger
            render={
              <IconButton
                size="sm"
                disabled={openDisabled}
                title={openLabel}
                aria-label={openLabel}
                onClick={onOpen}
              >
                <IconExternalLink stroke={1.5} />
              </IconButton>
            }
          />
          <TooltipContent>{openTooltip}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
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
