import { IconCopy, IconExternalLink } from "@tabler/icons-react"
import { IconButton } from "../../components/icon-button"
import { Tooltip } from "../../components/tooltip"
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
  return (
    <div className="flex flex-col gap-2 border border-border p-3">
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
      <div className="flex items-center gap-1.5">
        <code className="mono min-w-0 flex-1 overflow-x-auto whitespace-nowrap border border-border bg-muted/40 px-2 py-1.5 text-[11px]">
          {url
            .split(/(\{[^}]+\})/g)
            .filter((part) => part.length > 0)
            .map((part, i) =>
              /^\{.+\}$/.test(part) ? (
                <span key={i} className="font-medium text-warning">
                  {part}
                </span>
              ) : (
                <span key={i} className="text-muted-foreground">
                  {part}
                </span>
              ),
            )}
        </code>
        <IconButton size="sm" title={copyLabel} aria-label={copyLabel} onClick={onCopy}>
          <IconCopy size={12} stroke={1.5} />
        </IconButton>
        <Tooltip content={openTooltip}>
          <IconButton
            size="sm"
            disabled={openDisabled}
            title={openLabel}
            aria-label={openLabel}
            onClick={onOpen}
          >
            <IconExternalLink size={12} stroke={1.5} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}
