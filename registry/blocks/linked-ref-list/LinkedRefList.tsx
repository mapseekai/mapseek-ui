import { IconExternalLink, IconLink } from "@tabler/icons-react"
import type { ReactNode } from "react"
import { useState } from "react"

import { CardTabs, CardTabsContent, CardTabsList, CardTabsTrigger } from "@/components/ui/card-tabs"
import { IconButton } from "@/components/ui/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import type {
  LinkedRefGroup,
  LinkedRefItem,
  LinkedRefKind,
  LinkedRefListProps,
  LinkedRefStatusTone,
} from "./types"

/** 每个分类的图标盒色调（数据集绿 / 地图集蓝 / 工作流紫）。 */
const KIND_BOX: Record<LinkedRefKind, string> = {
  dataset: "border-cat-1/25 bg-cat-1/10",
  mapset: "border-cat-2/25 bg-cat-2/10",
  workflow: "border-cat-5/25 bg-cat-5/10",
}

/** 状态药丸：边框/底色/文字 + 是否带前导圆点。 */
const STATUS_TONE: Record<LinkedRefStatusTone, { pill: string; dot: string | null }> = {
  active: {
    pill: "border-primary/25 bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  ready: { pill: "border-info/25 bg-info/10 text-info", dot: "bg-info" },
  draft: { pill: "border-border text-muted-foreground", dot: null },
  failed: {
    pill: "border-destructive/25 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
}

/**
 * 引用关系列表（Layer 2 presentational block）。
 * 顶部一排可选的 summary 卡片（数据集 / 地图集 / 工作流，带彩色图标盒 + 计数），
 * 下方 section bar + 选中分组的条目列表。所有文案 / icon 经 props 注入；
 * 无 i18n、无副作用。action 按钮恒为 disabled（尚未接入 API）。
 */
export function LinkedRefList({ groups, kindIcons, openLabel }: LinkedRefListProps) {
  const [selected, setSelected] = useState(groups[0]?.key ?? "")
  const selectedValue = groups.some((group) => group.key === selected)
    ? selected
    : (groups[0]?.key ?? "")

  return (
    <CardTabs value={selectedValue} onValueChange={setSelected}>
      <CardTabsList
        className="grid h-auto gap-0"
        style={{ gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))` }}
      >
        {groups.map((group) => (
          <SummaryCard key={group.key} group={group} icon={kindIcons[group.kind]} />
        ))}
      </CardTabsList>

      {groups.map((group) => (
        <CardTabsContent key={group.key} value={group.key} className="p-0!">
          <div className="flex items-center gap-2 bg-muted/30 px-4 py-2.5">
            <span className="shrink-0">{kindIcons[group.kind]}</span>
            <span className="text-headline-sm text-foreground">{group.title}</span>
            <span className="mono border border-border bg-background px-1.5 text-body-sm text-muted-foreground">
              {group.count}
            </span>
            {group.summary ? (
              <span className="ml-auto truncate text-body-sm text-muted-foreground">
                {group.summary}
              </span>
            ) : null}
          </div>

          {group.items.length > 0 ? (
            <ul className="flex flex-col">
              {group.items.map((item) => (
                <ItemRow
                  key={item.key}
                  item={item}
                  kind={group.kind}
                  icon={kindIcons[group.kind]}
                  openLabel={openLabel}
                />
              ))}
            </ul>
          ) : null}
        </CardTabsContent>
      ))}
    </CardTabs>
  )
}

function SummaryCard({ group, icon }: { group: LinkedRefGroup; icon: ReactNode }) {
  const unit = group.summaryLabel.replace(/^\s*\d[\d,]*\s*/, "")
  return (
    <CardTabsTrigger
      value={group.key}
      className="group/ref-tab h-auto min-w-0 flex-col gap-2 px-4 py-3 text-left"
    >
      <span className="flex items-center gap-2 text-headline-sm text-foreground group-data-active/ref-tab:text-primary">
        <span
          className={cn("flex size-9 items-center justify-center border", KIND_BOX[group.kind])}
        >
          {icon}
        </span>
        {group.title}
      </span>
      <span>
        <span className="mono text-xl font-medium">{group.count}</span>{" "}
        <span className="text-body-sm text-muted-foreground group-data-active/ref-tab:text-primary">
          {unit}
        </span>
      </span>
    </CardTabsTrigger>
  )
}

function ItemRow({
  item,
  kind,
  icon,
  openLabel,
}: {
  item: LinkedRefItem
  kind: LinkedRefKind
  icon: ReactNode
  openLabel?: string
}) {
  return (
    <li className="flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-3 last:border-b-0 sm:flex-nowrap sm:gap-3 sm:px-4">
      <span
        className={cn("flex size-9 shrink-0 items-center justify-center border", KIND_BOX[kind])}
      >
        {icon}
      </span>
      <div className="min-w-0 basis-[calc(100%-2.75rem)] sm:flex-1 sm:basis-auto">
        <div className="text-headline-sm text-foreground">{item.name}</div>
        {item.subtitle || item.id ? (
          <div className="truncate text-body-sm text-muted-foreground">
            {item.subtitle}
            {item.subtitle && item.id ? " · " : null}
            {item.id ? <span className="mono">{item.id}</span> : null}
          </div>
        ) : null}
      </div>
      {item.time ? (
        <span className="mono tnum ml-11 shrink-0 text-body-sm text-muted-foreground sm:ml-0">
          {item.time}
        </span>
      ) : null}
      {item.status ? <StatusPill status={item.status} /> : null}
      <span className="flex shrink-0 items-center gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <IconButton size="sm" disabled aria-label={openLabel}>
                <IconExternalLink stroke={1.5} />
              </IconButton>
            }
          />
          <TooltipContent>{openLabel}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <IconButton size="sm" disabled aria-label={openLabel}>
                <IconLink stroke={1.5} />
              </IconButton>
            }
          />
          <TooltipContent>{openLabel}</TooltipContent>
        </Tooltip>
      </span>
    </li>
  )
}

function StatusPill({ status }: { status: { label: string; tone: LinkedRefStatusTone } }) {
  const tone = STATUS_TONE[status.tone]
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 border px-1.5 py-0.5 text-body-sm",
        tone.pill,
      )}
    >
      {tone.dot ? <span className={cn("size-1.5 rounded-full", tone.dot)} /> : null}
      {status.label}
    </span>
  )
}
