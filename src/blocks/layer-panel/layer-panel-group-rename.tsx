import { IconFolder } from "@tabler/icons-react"
import { Input } from "@workspace/ui/components/input"
import * as React from "react"
import { runSafeCallback } from "./layer-panel-shared"
import type { LayerPanelRenameResult } from "./types"
import { useLayerPanelContext } from "./use-layer-panel"

export function LayerPanelGroupRename({
  group,
  onFinish,
}: {
  readonly group: string
  readonly onFinish: () => void
}) {
  const ctx = useLayerPanelContext()
  const [renameValue, setRenameValue] = React.useState(group)
  const [renameError, setRenameError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)
  const pendingRef = React.useRef(false)
  const mountedRef = React.useRef(true)
  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const commitRename = async () => {
    if (pendingRef.current) return
    const next = renameValue.trim()
    if (!next || next === group) {
      onFinish()
      return
    }
    pendingRef.current = true
    setPending(true)
    let result: void | LayerPanelRenameResult
    try {
      result = await ctx.onGroupRename?.(group, next)
    } catch {
      pendingRef.current = false
      if (mountedRef.current) {
        setPending(false)
        setRenameError("重命名失败")
      }
      return
    }
    pendingRef.current = false
    if (!mountedRef.current) return
    setPending(false)
    if (result && !result.ok) {
      setRenameError(result.message)
      return
    }
    onFinish()
  }

  const handleCommit = () => {
    runSafeCallback(commitRename, () => {
      if (mountedRef.current) {
        pendingRef.current = false
        setPending(false)
        setRenameError("重命名失败")
      }
    })
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="flex min-w-0 items-center gap-2">
        <IconFolder className="size-4 shrink-0 text-primary" />
        <Input
          autoFocus
          value={renameValue}
          disabled={pending}
          aria-label={`重命名分组 ${group}`}
          aria-invalid={renameError ? true : undefined}
          onChange={(event) => {
            setRenameValue(event.target.value)
            setRenameError(null)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleCommit()
            if (event.key === "Escape") onFinish()
          }}
          onBlur={handleCommit}
          className="h-5 min-w-0 flex-1 rounded-md px-1 text-xs"
        />
      </div>
      {renameError ? (
        <div role="alert" className="pl-6 text-[11px] text-destructive">
          {renameError}
        </div>
      ) : null}
    </div>
  )
}
