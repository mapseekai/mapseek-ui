import { Button } from "@registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@registry/ui/dialog"
import { Input } from "@registry/ui/input"
import { Label } from "@registry/ui/label"
import { Textarea } from "@registry/ui/textarea"
import { IconBraces, IconPlus } from "@tabler/icons-react"
import { useState } from "react"

export function LoomDialogExamples() {
  const [projectOpen, setProjectOpen] = useState(false)
  const [dirtyOpen, setDirtyOpen] = useState(false)
  const [operationOpen, setOperationOpen] = useState(false)
  const [name, setName] = useState("未命名工程")
  const [description, setDescription] = useState("")

  const canCreate = name.trim().length > 0

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          原 Loom 项目业务案例
        </h2>
        <p className="max-w-2xl text-xs text-muted-foreground">
          从原应用的真实用法合并：表单、三选确认，以及带图标标题和状态 footer 的数据操作。
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setProjectOpen(true)}>
          新建工程
        </Button>
        <Button variant="outline" onClick={() => setDirtyOpen(true)}>
          未保存的修改
        </Button>
        <Button variant="outline" onClick={() => setOperationOpen(true)}>
          数据操作
        </Button>
      </div>

      <Dialog open={projectOpen} onOpenChange={setProjectOpen}>
        <DialogContent
          width={440}
          title={
            <span className="inline-flex items-center gap-2">
              新建工程
              <span className="inline-flex items-center gap-1 border border-primary/30 bg-primary/10 px-1.5 py-px font-mono text-[10px] font-medium tracking-[0.04em] text-primary">
                <span className="size-[5px] bg-primary" />
                本地
              </span>
            </span>
          }
        >
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              if (canCreate) setProjectOpen(false)
            }}
          >
            <DialogBody className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showcase-project-name">名称 / Name</Label>
                  <span className="font-mono text-[10px] text-muted-foreground">必填</span>
                </div>
                <Input
                  id="showcase-project-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showcase-project-description">描述 / Description</Label>
                  <span className="font-mono text-[10px] text-muted-foreground">可选</span>
                </div>
                <Textarea
                  id="showcase-project-description"
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="简要说明工程用途、数据范围、协作者等"
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setProjectOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={!canCreate}>
                <IconPlus />
                创建工程
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dirtyOpen} onOpenChange={setDirtyOpen}>
        <DialogContent title="未保存的修改" width={440}>
          <DialogDescription>是否保存当前工程的修改？</DialogDescription>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDirtyOpen(false)}>
              取消
            </Button>
            <Button variant="outline" onClick={() => setDirtyOpen(false)}>
              放弃修改
            </Button>
            <Button onClick={() => setDirtyOpen(false)}>保存并继续</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={operationOpen} onOpenChange={setOperationOpen}>
        <DialogContent
          width={600}
          title={
            <span className="inline-flex items-center gap-2">
              <IconBraces className="text-primary" />
              <span>字段计算器</span>
              <span className="font-mono text-[10px] font-normal text-muted-foreground">
                land_use
              </span>
            </span>
          }
        >
          <DialogBody className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="showcase-target-field">目标字段</Label>
              <Input id="showcase-target-field" value="area_m2" readOnly />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="showcase-expression">表达式</Label>
              <Input id="showcase-expression" value="$area / 10000" readOnly />
            </div>
          </DialogBody>
          <DialogFooter className="sm:items-center">
            <span className="font-mono text-[10px] text-muted-foreground sm:me-auto">
              将更新 13 行 · area_m2
            </span>
            <Button variant="outline" onClick={() => setOperationOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setOperationOpen(false)}>应用</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
