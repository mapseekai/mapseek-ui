import { IconCheck, IconClipboard } from "@tabler/icons-react"
import { type ComponentProps, useEffect, useRef, useState } from "react"

import { Button } from "@/registry/ui/button"
import { IconButton } from "@/registry/ui/icon-button"

type CopyButtonProps = Omit<ComponentProps<"button">, "children" | "onClick"> & {
  content: string
  variant?: "icon" | "text" | "ghost"
  label?: string
  copiedLabel?: string
  duration?: number
  textSize?: ComponentProps<typeof Button>["size"]
  onCopy?: () => void
  onCopiedChange?: (copied: boolean) => void
  onCopyError?: (error: unknown) => void
}

function CopyButton({
  content,
  variant = "icon",
  label = "复制",
  copiedLabel = "已复制",
  duration = 2000,
  textSize = "sm",
  onCopy,
  onCopiedChange,
  onCopyError,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      window.clearTimeout(resetTimer.current)
    },
    [],
  )

  const handleCopy = async () => {
    window.clearTimeout(resetTimer.current)

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      onCopiedChange?.(true)
      onCopy?.()
      resetTimer.current = window.setTimeout(() => {
        setCopied(false)
        onCopiedChange?.(false)
        resetTimer.current = undefined
      }, duration)
    } catch (error) {
      setCopied(false)
      onCopiedChange?.(false)
      onCopyError?.(error)
    }
  }

  const currentLabel = copied ? copiedLabel : label
  const accessibleLabel = copied ? copiedLabel : (ariaLabel ?? label)
  const icon = copied ? (
    <IconCheck
      data-icon="inline-start"
      className={variant === "icon" ? "size-3.5 text-primary" : "text-primary"}
    />
  ) : (
    <IconClipboard
      data-icon="inline-start"
      className={variant === "icon" ? "size-3.5" : undefined}
    />
  )

  if (variant === "icon") {
    return (
      <IconButton
        type={type}
        data-slot="copy-button"
        size="xs"
        label={accessibleLabel}
        onClick={() => void handleCopy()}
        {...props}
      >
        {icon}
      </IconButton>
    )
  }

  return (
    <Button
      type={type}
      data-slot="copy-button"
      variant={variant === "ghost" ? "ghost" : "outline"}
      size={textSize}
      aria-label={accessibleLabel}
      onClick={() => void handleCopy()}
      {...props}
    >
      {icon}
      <span aria-live="polite">{currentLabel}</span>
    </Button>
  )
}

export type { CopyButtonProps }
export { CopyButton }
