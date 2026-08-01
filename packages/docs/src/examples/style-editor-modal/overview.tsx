import {
  StyleEditorModal,
  StyleEditorModalActions,
  StyleEditorModalAlert,
  StyleEditorModalKbd,
  StyleEditorModalSection,
  StyleEditorModalSourceCard,
  StyleEditorModalTile,
} from "@registry/blocks/style-editor-modal"
import { Button } from "@registry/ui/button"
import { Input } from "@registry/ui/input"
import { Label } from "@registry/ui/label"
import { IconCirclePlus } from "@tabler/icons-react"
import { useState } from "react"

export const zhStyleEditorModalLabels = {
  open: "打开样式弹窗",
  title: "保存地图样式",
  alert: "样式包含未绑定的数据源。",
  dismiss: "关闭提示",
  sectionTitle: "访问令牌",
  sectionDescription: "保存前确认令牌和样式来源。",
  tokenLabel: "MapTiler",
  tokenValue: "pk.live-demo",
  templateTitle: "样式模板",
  sourceTitle: "数据源卡片",
  sourceName: "#openmaptiles",
  sourceTypeLabel: "类型",
  sourceTypeValue: "vector",
  cancel: "取消",
  save: "保存",
  discarded: "已取消保存",
  saved: "已保存样式",
  templateStatus: "已选择模板",
  shortcut: "快捷键",
}

export const enStyleEditorModalLabels = {
  open: "Open style modal",
  title: "Save map style",
  alert: "The style contains an unbound source.",
  dismiss: "Dismiss alert",
  sectionTitle: "Access tokens",
  sectionDescription: "Confirm tokens and style sources before saving.",
  tokenLabel: "MapTiler",
  tokenValue: "pk.live-demo",
  templateTitle: "Style templates",
  sourceTitle: "Source card",
  sourceName: "#openmaptiles",
  sourceTypeLabel: "Type",
  sourceTypeValue: "vector",
  cancel: "Cancel",
  save: "Save",
  discarded: "Discarded changes",
  saved: "Saved style",
  templateStatus: "Selected template",
  shortcut: "Shortcut",
}

function FieldRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Label className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input value={value} readOnly />
    </Label>
  )
}

export function StyleEditorModalDemo({
  labels,
}: {
  readonly labels: typeof zhStyleEditorModalLabels
}) {
  const [open, setOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(true)
  const [status, setStatus] = useState(labels.discarded)

  return (
    <section data-demo="style-editor-modal" className="space-y-3">
      <Button
        type="button"
        variant="outline"
        data-demo-action="style-editor-modal-open"
        onClick={() => setOpen(true)}
      >
        {labels.open}
      </Button>
      <p data-demo-status="style-editor-modal" className="m-0 font-mono text-xs">
        {status}
      </p>
      <StyleEditorModal
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) setStatus(labels.discarded)
        }}
        title={labels.title}
        dataWdKey="docs:style-editor-modal"
      >
        {showAlert ? (
          <StyleEditorModalAlert
            dismissLabel={labels.dismiss}
            onDismiss={() => setShowAlert(false)}
          >
            {labels.alert}
          </StyleEditorModalAlert>
        ) : null}
        <StyleEditorModalSection
          title={labels.sectionTitle}
          description={labels.sectionDescription}
        >
          <FieldRow label={labels.tokenLabel} value={labels.tokenValue} />
          <p className="text-xs text-muted-foreground">
            {labels.shortcut} <StyleEditorModalKbd>Ctrl</StyleEditorModalKbd> +{" "}
            <StyleEditorModalKbd>S</StyleEditorModalKbd>
          </p>
        </StyleEditorModalSection>
        <StyleEditorModalSection title={labels.templateTitle}>
          <div className="grid grid-cols-2 gap-3">
            {["OpenMapTiles", "Bright"].map((template) => (
              <StyleEditorModalTile
                key={template}
                title={template}
                action={<IconCirclePlus className="h-5 w-5" />}
                onClick={() => setStatus(`${labels.templateStatus}: ${template}`)}
              />
            ))}
          </div>
        </StyleEditorModalSection>
        <StyleEditorModalSection title={labels.sourceTitle}>
          <StyleEditorModalSourceCard title={labels.sourceName}>
            <FieldRow label={labels.sourceTypeLabel} value={labels.sourceTypeValue} />
          </StyleEditorModalSourceCard>
          <StyleEditorModalActions>
            <Button
              type="button"
              variant="outline"
              data-demo-action="style-editor-modal-cancel"
              onClick={() => {
                setOpen(false)
                setStatus(labels.discarded)
              }}
            >
              {labels.cancel}
            </Button>
            <Button
              type="button"
              data-demo-action="style-editor-modal-save"
              onClick={() => {
                setOpen(false)
                setStatus(labels.saved)
              }}
            >
              {labels.save}
            </Button>
          </StyleEditorModalActions>
        </StyleEditorModalSection>
      </StyleEditorModal>
    </section>
  )
}
