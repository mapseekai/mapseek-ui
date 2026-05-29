import { useState } from "react"
import { IconExternalLink, IconLink } from "@tabler/icons-react"

import { Badge } from "@workspace/ui/components/badge"
import { IconButton } from "@workspace/ui/components/icon-button"
import { Tooltip } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

import type {
  LinkedRefGroup,
  LinkedRefItem,
  LinkedRefListProps,
  LinkedRefStatusTone,
} from "./types"

const TONE_VARIANT: Record<
  LinkedRefStatusTone,
  "default" | "outline" | "destructive" | "secondary"
> = {
  active: "default",
  draft: "outline",
  failed: "destructive",
  ready: "secondary",
}

/**
 * 引用关系列表（Layer 2 presentational block）。
 * 顶部一排可选的 summary 卡片（数据集 / 地图集 / 工作流），
 * 下方展示选中分组的条目列表。所有文案 / icon 经 props 注入；
 * 无 i18n、无副作用。action 按钮恒为 disabled（尚未接入 API）。
 */
export function LinkedRefList({
  groups,
  kindIcons,
  openLabel,
}: LinkedRefListProps) {
  const [selected, setSelected] = useState(0)
  const active = groups[selected]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-px bg-border">
        {groups.map((group, i) => (
          <SummaryCard
            key={group.key}
            group={group}
            icon={kindIcons[group.kind]}
            selected={i === selected}
            onSelect={() => setSelected(i)}
          />
        ))}
      </div>

      {active ? (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {active.title}
            </span>
            <Badge variant="secondary">{active.count}</Badge>
            {active.summary ? (
              <span className="ml-auto text-[11px] text-muted-foreground">
                {active.summary}
              </span>
            ) : null}
          </div>

          {active.items.length > 0 ? (
            <ul className="flex flex-col gap-px">
              {active.items.map((item) => (
                <ItemRow
                  key={item.key}
                  item={item}
                  icon={kindIcons[active.kind]}
                  openLabel={openLabel}
                />
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

function SummaryCard({
  group,
  icon,
  selected,
  onSelect,
}: {
  group: LinkedRefGroup
  icon: React.ReactNode
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col gap-1 bg-background px-4 py-3 text-left transition-colors",
        "border-b-2 border-transparent",
        selected
          ? "border-primary bg-muted/40"
          : "hover:bg-muted/20"
      )}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {group.title}
      </span>
      <span className="text-[11px] text-muted-foreground">
        {group.summaryLabel}
      </span>
    </button>
  )
}

function ItemRow({
  item,
  icon,
  openLabel,
}: {
  item: LinkedRefItem
  icon: React.ReactNode
  openLabel?: string
}) {
  return (
    <li className="flex items-center gap-3 border border-border px-3 py-2 text-xs">
      <span className="shrink-0">{icon}</span>
      <span className="font-medium text-foreground">{item.name}</span>
      {item.subtitle || item.id ? (
        <span className="truncate text-muted-foreground">
          {item.subtitle}
          {item.subtitle && item.id ? " · " : null}
          {item.id ? <span className="mono">{item.id}</span> : null}
        </span>
      ) : null}
      {item.time ? (
        <span className="mono tnum ml-auto shrink-0 text-muted-foreground">
          {item.time}
        </span>
      ) : null}
      {item.status ? (
        <Badge
          variant={TONE_VARIANT[item.status.tone]}
          className={item.time ? undefined : "ml-auto"}
        >
          {item.status.label}
        </Badge>
      ) : null}
      <span className="flex shrink-0 items-center gap-1">
        <Tooltip content={openLabel}>
          <IconButton size="sm" disabled aria-label={openLabel}>
            <IconExternalLink size={14} stroke={1.5} />
          </IconButton>
        </Tooltip>
        <Tooltip content={openLabel}>
          <IconButton size="sm" disabled aria-label={openLabel}>
            <IconLink size={14} stroke={1.5} />
          </IconButton>
        </Tooltip>
      </span>
    </li>
  )
}
