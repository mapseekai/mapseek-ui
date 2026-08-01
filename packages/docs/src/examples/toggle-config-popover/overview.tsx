import { ToggleConfigPopover } from "@registry/blocks/toggle-config-popover"
import { Checkbox } from "@registry/ui/checkbox"
import { Slider } from "@registry/ui/slider"
import { IconLine, IconMagnet, IconPointFilled } from "@tabler/icons-react"
import { useState } from "react"

type ToggleTarget = "vertex" | "edge"

export const zhToggleConfigPopoverLabels = {
  label: "吸附设置",
  toggleLabel: "顶点和边吸附",
  triggerLabel: "打开吸附设置",
  switchLabel: "吸附开关",
  threshold: "阈值",
  targets: "对象",
  vertex: "顶点",
  edge: "边",
  enabled: "已启用",
  disabled: "已关闭",
  settingsSuffix: "设置",
}

export const enToggleConfigPopoverLabels = {
  label: "Snapping settings",
  toggleLabel: "Vertex and edge snapping",
  triggerLabel: "Open snapping settings",
  switchLabel: "Snapping switch",
  threshold: "Threshold",
  targets: "Targets",
  vertex: "Vertex",
  edge: "Edge",
  enabled: "Enabled",
  disabled: "Disabled",
  settingsSuffix: " settings",
}

const toggleTargets: Array<{
  readonly key: ToggleTarget
  readonly Icon: typeof IconPointFilled
}> = [
  { key: "vertex", Icon: IconPointFilled },
  { key: "edge", Icon: IconLine },
]

export function ToggleConfigPopoverDemo({
  labels,
}: {
  readonly labels: typeof zhToggleConfigPopoverLabels
}) {
  const [enabled, setEnabled] = useState(true)
  const [threshold, setThreshold] = useState(8)
  const [targets, setTargets] = useState({ vertex: true, edge: true })

  function toggleTarget(key: ToggleTarget) {
    setTargets((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <section data-demo="toggle-config-popover" className="space-y-3">
      <div className="inline-flex h-10 items-center border border-border bg-card px-1 shadow-[var(--shadow-map-float)]">
        <ToggleConfigPopover
          icon={IconMagnet}
          label={labels.label}
          toggleLabel={labels.toggleLabel}
          triggerLabel={labels.triggerLabel}
          tooltip={`${labels.toggleLabel}: ${threshold}px`}
          switchLabel={labels.switchLabel}
          checked={enabled}
          onCheckedChange={setEnabled}
          labels={{ settingsSuffix: labels.settingsSuffix }}
        >
          <div className="border-b border-border px-3 py-2.5">
            <div className="mb-2 flex items-center">
              <span className="flex-1 text-[11px] leading-[14px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                {labels.threshold}
              </span>
              <span className="font-mono text-xs font-medium tabular-nums text-foreground">
                {threshold}
                <span className="ml-0.5 text-muted-foreground">px</span>
              </span>
            </div>
            <Slider
              min={2}
              max={32}
              value={[threshold]}
              disabled={!enabled}
              onValueChange={(value) => setThreshold(Array.isArray(value) ? value[0] : value)}
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>2 px</span>
              <span>32 px</span>
            </div>
          </div>
          <div className="px-3 pb-3 pt-2.5">
            <div className="mb-1.5 text-[11px] leading-[14px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
              {labels.targets}
            </div>
            {toggleTargets.map(({ key, Icon }) => (
              <label
                key={key}
                htmlFor={`docs-toggle-target-${key}`}
                className="flex h-[26px] items-center gap-2"
                style={{ cursor: enabled ? "pointer" : "not-allowed" }}
              >
                <Checkbox
                  id={`docs-toggle-target-${key}`}
                  disabled={!enabled}
                  checked={targets[key]}
                  onCheckedChange={() => toggleTarget(key)}
                />
                <Icon
                  size={13}
                  className={targets[key] && enabled ? "text-primary" : "text-muted-foreground"}
                />
                <span className="text-xs leading-none font-medium text-foreground">
                  {key === "vertex" ? labels.vertex : labels.edge}
                </span>
              </label>
            ))}
          </div>
        </ToggleConfigPopover>
      </div>
      <p data-demo-status="toggle-config-popover" className="m-0 font-mono text-xs">
        {enabled ? labels.enabled : labels.disabled} / {threshold}px
      </p>
    </section>
  )
}
