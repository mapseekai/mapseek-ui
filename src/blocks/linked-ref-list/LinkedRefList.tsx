import { useState } from "react"
import type { ReactNode } from "react"
import { IconExternalLink, IconLink } from "@tabler/icons-react"

import { IconButton } from "@workspace/ui/components/icon-button"
import { Tooltip } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

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
const STATUS_TONE: Record<
  LinkedRefStatusTone,
  { pill: string; dot: string | null }
> = {
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
        <div className="border border-border">
          <div className="flex items-center gap-2 bg-muted/30 px-4 py-2.5">
            <span className="shrink-0">{kindIcons[active.kind]}</span>
            <span className="text-sm font-medium text-foreground">
              {active.title}
            </span>
            <span className="mono border border-border bg-background px-1.5 text-[11px] text-muted-foreground">
              {active.count}
            </span>
            {active.summary ? (
              <span className="ml-auto truncate text-[11px] text-muted-foreground">
                {active.summary}
              </span>
            ) : null}
          </div>

          {active.items.length > 0 ? (
            <ul className="flex flex-col">
              {active.items.map((item) => (
                <ItemRow
                  key={item.key}
                  item={item}
                  kind={active.kind}
                  icon={kindIcons[active.kind]}
                  openLabel={openLabel}
                />
              ))}
            </ul>
          ) : null}
        </div>
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
  icon: ReactNode
  selected: boolean
  onSelect: () => void
}) {
  const unit = group.summaryLabel.replace(/^\s*\d[\d,]*\s*/, "")
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "-mb-px flex flex-col gap-2 border-b-2 bg-background px-4 py-3 text-left transition-colors",
        selected
          ? "border-primary bg-cat-1/8"
          : "border-transparent hover:bg-muted/20"
      )}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        <span
          className={cn(
            "flex size-9 items-center justify-center border",
            KIND_BOX[group.kind]
          )}
        >
          {icon}
        </span>
        {group.title}
      </span>
      <span>
        <span className="mono text-xl font-medium">{group.count}</span>{" "}
        <span className="text-[11px] text-muted-foreground">{unit}</span>
      </span>
    </button>
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
    <li className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center border",
          KIND_BOX[kind]
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-foreground">{item.name}</div>
        {item.subtitle || item.id ? (
          <div className="truncate text-[11px] text-muted-foreground">
            {item.subtitle}
            {item.subtitle && item.id ? " · " : null}
            {item.id ? <span className="mono">{item.id}</span> : null}
          </div>
        ) : null}
      </div>
      {item.time ? (
        <span className="mono tnum shrink-0 text-[11px] text-muted-foreground">
          {item.time}
        </span>
      ) : null}
      {item.status ? <StatusPill status={item.status} /> : null}
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

function StatusPill({
  status,
}: {
  status: { label: string; tone: LinkedRefStatusTone }
}) {
  const tone = STATUS_TONE[status.tone]
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 border px-1.5 py-0.5 text-[11px]",
        tone.pill
      )}
    >
      {tone.dot ? (
        <span className={cn("size-1.5 rounded-full", tone.dot)} />
      ) : null}
      {status.label}
    </span>
  )
}
