import { IconExternalLink, IconLink } from "@tabler/icons-react"
import type { CSSProperties, ReactNode } from "react"
import { useState } from "react"

import { CardTabs, CardTabsContent, CardTabsList, CardTabsTrigger } from "@/components/ui/card-tabs"
import { IconButton } from "@/components/ui/icon-button"
import { Tag, type TagColor } from "@/components/ui/tag"
import { cn } from "@/lib/utils"

import type {
  LinkedRefGroup,
  LinkedRefItem,
  LinkedRefItemActions,
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
  { color: TagColor; className?: string; dot: string | null }
> = {
  active: {
    color: "green",
    dot: "bg-primary",
  },
  ready: {
    color: "blue",
    className: "border-info/30 bg-info/10 text-info",
    dot: "bg-info",
  },
  draft: { color: "gray", dot: null },
  failed: {
    color: "orange",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
}

/**
 * 引用关系列表（Layer 2 presentational block）。
 * 顶部一排可选的 summary 卡片（数据集 / 地图集 / 工作流，带彩色图标盒 + 计数），
 * 下方 section bar + 选中分组的条目列表。所有文案 / icon 经 props 注入；
 * 无 i18n、无副作用。条目操作由调用方通过 itemActions 注入。
 */
export function LinkedRefList({ groups, kindIcons, itemActions }: LinkedRefListProps) {
  const [selected, setSelected] = useState(groups[0]?.key ?? "")
  const selectedValue = groups.some((group) => group.key === selected)
    ? selected
    : (groups[0]?.key ?? "")

  return (
    <CardTabs value={selectedValue} onValueChange={setSelected} className="w-full min-w-0">
      <CardTabsList
        className="grid h-auto w-full grid-cols-1 gap-0 sm:grid-cols-[repeat(var(--linked-ref-columns),minmax(0,1fr))]"
        style={{ "--linked-ref-columns": groups.length } as CSSProperties}
      >
        {groups.map((group) => (
          <SummaryCard key={group.key} group={group} icon={kindIcons[group.kind]} />
        ))}
      </CardTabsList>

      {groups.map((group) => (
        <CardTabsContent key={group.key} value={group.key} className="p-0!">
          <div className="flex items-center gap-2 bg-muted/30 px-4 py-2.5">
            <span aria-hidden="true" className="shrink-0">
              {kindIcons[group.kind]}
            </span>
            <span className="text-headline-sm text-foreground">{group.title}</span>
            <Tag color="gray" size="sm" className="tnum">
              {group.count}
            </Tag>
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
                  group={group}
                  kind={group.kind}
                  icon={kindIcons[group.kind]}
                  itemActions={itemActions}
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
      className="group/ref-tab h-auto w-full min-w-0 flex-col gap-2 px-4 py-3 text-left whitespace-normal"
    >
      <span className="flex items-center gap-2 text-headline-sm text-foreground group-data-active/ref-tab:text-primary">
        <span
          aria-hidden="true"
          className={cn("flex size-9 items-center justify-center border", KIND_BOX[group.kind])}
        >
          {icon}
        </span>
        {group.title}
      </span>
      <span>
        <span className="mono tnum text-headline-lg">{group.count}</span>{" "}
        <span className="text-body-sm text-muted-foreground group-data-active/ref-tab:text-primary">
          {unit}
        </span>
      </span>
    </CardTabsTrigger>
  )
}

function ItemRow({
  item,
  group,
  kind,
  icon,
  itemActions,
}: {
  item: LinkedRefItem
  group: LinkedRefGroup
  kind: LinkedRefKind
  icon: ReactNode
  itemActions?: LinkedRefItemActions
}) {
  return (
    <li className="flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-3 last:border-b-0 sm:flex-nowrap sm:gap-3 sm:px-4">
      <span
        aria-hidden="true"
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
      {itemActions?.open || itemActions?.copyLink ? (
        <span className="flex shrink-0 items-center gap-1">
          {itemActions.open ? (
            <IconButton
              size="xs"
              label={itemActions.open.label}
              tooltip
              onClick={() => itemActions.open?.onAction(item, group)}
            >
              <IconExternalLink aria-hidden="true" stroke={1.5} />
            </IconButton>
          ) : null}
          {itemActions.copyLink ? (
            <IconButton
              size="xs"
              label={itemActions.copyLink.label}
              tooltip
              onClick={() => itemActions.copyLink?.onAction(item, group)}
            >
              <IconLink aria-hidden="true" stroke={1.5} />
            </IconButton>
          ) : null}
        </span>
      ) : null}
    </li>
  )
}

function StatusPill({ status }: { status: { label: string; tone: LinkedRefStatusTone } }) {
  const tone = STATUS_TONE[status.tone]
  return (
    <Tag size="sm" color={tone.color} className={cn("gap-1", tone.className)}>
      {tone.dot ? (
        <span aria-hidden="true" className={cn("size-1.5 rounded-full", tone.dot)} />
      ) : null}
      {status.label}
    </Tag>
  )
}
