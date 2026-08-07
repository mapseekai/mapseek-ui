import { Button } from "@registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@registry/ui/dialog"
import { Input } from "@registry/ui/input"
import { Label } from "@registry/ui/label"
import { Textarea } from "@registry/ui/textarea"
import { IconBraces } from "@tabler/icons-react"
import { useState } from "react"
import type { LocalizedDemoProps } from "./types"

const labels = {
  "zh-CN": {
    basic: {
      uncontrolledTrigger: "打开对话框",
      uncontrolledTitle: "图层属性",
      uncontrolledDescription: "编辑当前图层的基本信息。",
      uncontrolledBody: "DialogBody 是正文区域，适合放置说明、表单或局部设置。",
      cancel: "取消",
      confirm: "确认",
      controlledTrigger: "受控打开",
      controlledTitle: "受控对话框",
      controlledBody: "open 与 onOpenChange 由外部状态拥有，Dialog 仍保留焦点管理和 Escape 关闭。",
      controlledClose: "关闭",
      controlledStateLabel: "受控状态",
      controlledStateOpen: "已打开",
      controlledStateClosed: "已关闭",
    },
    confirmation: {
      trigger: "未保存的修改",
      title: "未保存的修改",
      description: "是否保存当前工程的修改？此流程保留取消、放弃修改、保存并继续三个结果。",
      cancel: "取消",
      discard: "放弃修改",
      save: "保存并继续",
      statusLabel: "最近选择",
      idleStatus: "尚未选择",
      canceledStatus: "已取消",
      discardedStatus: "已放弃修改",
      savedStatus: "已保存并继续",
    },
    longContent: {
      trigger: "打开长内容对话框",
      title: "字段计算器",
      description: "长内容保留在 portal 中，正文区域独立滚动，不被示例容器裁切。",
      badge: "land_use",
      targetFieldLabel: "目标字段",
      targetFieldValue: "area_m2",
      expressionLabel: "表达式",
      expressionValue: "$area / 10000",
      noteLabel: "说明",
      noteValue: "根据当前几何面积批量计算公顷值，并写回目标字段。",
      sections: [
        { title: "输入检查", body: "确认目标字段可写，表达式只引用当前图层已有字段。" },
        { title: "影响范围", body: "将更新当前筛选结果中的 13 行，未选中的图层不会被修改。" },
        { title: "回滚策略", body: "应用前会记录当前字段快照，失败时恢复到操作前状态。" },
        { title: "审计记录", body: "计算表达式、操作者和更新时间会写入处理日志，方便之后追踪。" },
      ],
      footerStatus: "将更新 13 行 · area_m2",
      cancel: "取消",
      apply: "应用",
    },
  },
  en: {
    basic: {
      uncontrolledTrigger: "Open dialog",
      uncontrolledTitle: "Layer properties",
      uncontrolledDescription: "Edit the current layer metadata.",
      uncontrolledBody: "DialogBody is the body region for copy, forms, or local settings.",
      cancel: "Cancel",
      confirm: "Confirm",
      controlledTrigger: "Open controlled",
      controlledTitle: "Controlled dialog",
      controlledBody:
        "open and onOpenChange are owned by external state while Dialog keeps focus management and Escape close.",
      controlledClose: "Close",
      controlledStateLabel: "Controlled state",
      controlledStateOpen: "Open",
      controlledStateClosed: "Closed",
    },
    confirmation: {
      trigger: "Unsaved changes",
      title: "Unsaved changes",
      description:
        "Save the current project changes? This flow keeps cancel, discard, and save-and-continue outcomes.",
      cancel: "Cancel",
      discard: "Discard changes",
      save: "Save and continue",
      statusLabel: "Last choice",
      idleStatus: "No choice yet",
      canceledStatus: "Canceled",
      discardedStatus: "Discarded changes",
      savedStatus: "Saved and continued",
    },
    longContent: {
      trigger: "Open long-content dialog",
      title: "Field calculator",
      description:
        "Long content stays in the portal, with an independently scrolling body that is not clipped by the demo container.",
      badge: "land_use",
      targetFieldLabel: "Target field",
      targetFieldValue: "area_m2",
      expressionLabel: "Expression",
      expressionValue: "$area / 10000",
      noteLabel: "Note",
      noteValue:
        "Calculate hectare values from the current geometry area and write them back to the target field.",
      sections: [
        {
          title: "Input check",
          body: "Confirm that the target field is writable and that the expression only references fields from the current layer.",
        },
        {
          title: "Impact",
          body: "The operation updates 13 rows in the current filtered result; unselected layers are not changed.",
        },
        {
          title: "Rollback",
          body: "The current field snapshot is recorded before applying the operation, then restored if the operation fails.",
        },
        {
          title: "Audit record",
          body: "The expression, operator, and update time are written to the processing log for later tracing.",
        },
      ],
      footerStatus: "Will update 13 rows · area_m2",
      cancel: "Cancel",
      apply: "Apply",
    },
  },
}

export function DialogBasicDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale].basic
  const [controlledOpen, setControlledOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger
            render={
              <Button data-demo="dialog-basic-uncontrolled-trigger" variant="outline">
                {demoLabels.uncontrolledTrigger}
              </Button>
            }
          />
          <DialogContent
            title={demoLabels.uncontrolledTitle}
            description={demoLabels.uncontrolledDescription}
          >
            <DialogBody>
              <p className="text-sm text-muted-foreground">{demoLabels.uncontrolledBody}</p>
            </DialogBody>
            <DialogFooter>
              <DialogClose
                render={
                  <Button data-demo="dialog-basic-cancel" variant="outline" size="sm">
                    {demoLabels.cancel}
                  </Button>
                }
              />
              <Button data-demo="dialog-basic-confirm" size="sm">
                {demoLabels.confirm}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={controlledOpen} onOpenChange={setControlledOpen}>
          <DialogTrigger
            render={
              <Button data-demo="dialog-basic-controlled-trigger" variant="outline">
                {demoLabels.controlledTrigger}
              </Button>
            }
          />
          <DialogContent title={demoLabels.controlledTitle}>
            <DialogBody>
              <p className="text-sm text-muted-foreground">{demoLabels.controlledBody}</p>
            </DialogBody>
            <DialogFooter>
              <Button
                data-demo="dialog-basic-controlled-close"
                size="sm"
                onClick={() => setControlledOpen(false)}
              >
                {demoLabels.controlledClose}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p data-demo="dialog-basic-controlled-state" className="text-xs text-muted-foreground">
        {demoLabels.controlledStateLabel}:{" "}
        {controlledOpen ? demoLabels.controlledStateOpen : demoLabels.controlledStateClosed}
      </p>
    </div>
  )
}

export function DialogConfirmationDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale].confirmation
  const [status, setStatus] = useState(demoLabels.idleStatus)

  return (
    <div className="flex flex-col items-start gap-3">
      <Dialog>
        <DialogTrigger
          render={
            <Button data-demo="dialog-confirmation-trigger" variant="outline">
              {demoLabels.trigger}
            </Button>
          }
        />
        <DialogContent title={demoLabels.title} width={440}>
          <DialogBody>
            <DialogDescription>{demoLabels.description}</DialogDescription>
          </DialogBody>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  data-demo="dialog-confirmation-cancel"
                  variant="ghost"
                  onClick={() => setStatus(demoLabels.canceledStatus)}
                >
                  {demoLabels.cancel}
                </Button>
              }
            />
            <DialogClose
              render={
                <Button
                  data-demo="dialog-confirmation-discard"
                  variant="outline"
                  onClick={() => setStatus(demoLabels.discardedStatus)}
                >
                  {demoLabels.discard}
                </Button>
              }
            />
            <DialogClose
              render={
                <Button
                  data-demo="dialog-confirmation-save"
                  onClick={() => setStatus(demoLabels.savedStatus)}
                >
                  {demoLabels.save}
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p data-demo="dialog-confirmation-status" className="text-xs text-muted-foreground">
        {demoLabels.statusLabel}: {status}
      </p>
    </div>
  )
}

export function DialogLongContentDemo({ locale = "zh-CN" }: LocalizedDemoProps) {
  const demoLabels = labels[locale].longContent
  return (
    <div className="flex flex-wrap gap-3">
      <Dialog>
        <DialogTrigger
          render={
            <Button data-demo="dialog-long-content-trigger" variant="outline">
              {demoLabels.trigger}
            </Button>
          }
        />
        <DialogContent
          width={640}
          className="max-h-[calc(100vh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto]"
        >
          <DialogHeader>
            <DialogTitle>
              <span className="inline-flex items-center gap-2">
                <IconBraces className="text-primary" />
                <span>{demoLabels.title}</span>
                <span className="font-mono text-[10px] font-normal text-muted-foreground">
                  {demoLabels.badge}
                </span>
              </span>
            </DialogTitle>
            <DialogDescription>{demoLabels.description}</DialogDescription>
          </DialogHeader>
          <DialogBody className="min-h-0 overflow-y-auto px-1">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="docs-dialog-target-field">{demoLabels.targetFieldLabel}</Label>
                <Input id="docs-dialog-target-field" value={demoLabels.targetFieldValue} readOnly />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="docs-dialog-expression">{demoLabels.expressionLabel}</Label>
                <Input id="docs-dialog-expression" value={demoLabels.expressionValue} readOnly />
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <Label htmlFor="docs-dialog-note">{demoLabels.noteLabel}</Label>
              <Textarea id="docs-dialog-note" rows={3} value={demoLabels.noteValue} readOnly />
            </div>
            <div className="mt-4 grid gap-3">
              {demoLabels.sections.map((section) => (
                <section key={section.title} className="border border-border p-3">
                  <h4 className="m-0 font-mono text-xs font-medium">{section.title}</h4>
                  <p className="mt-1 mb-0 text-xs text-muted-foreground">{section.body}</p>
                </section>
              ))}
            </div>
          </DialogBody>
          <DialogFooter className="sm:items-center">
            <span className="font-mono text-[10px] text-muted-foreground sm:me-auto">
              {demoLabels.footerStatus}
            </span>
            <DialogClose
              render={
                <Button data-demo="dialog-long-content-cancel" variant="outline">
                  {demoLabels.cancel}
                </Button>
              }
            />
            <DialogClose
              render={<Button data-demo="dialog-long-content-apply">{demoLabels.apply}</Button>}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
