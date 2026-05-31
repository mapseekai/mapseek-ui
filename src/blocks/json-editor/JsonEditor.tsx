import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { autocompletion } from "@codemirror/autocomplete"
import { json, jsonParseLinter } from "@codemirror/lang-json"
import {
  bracketMatching,
  foldGutter,
  indentOnInput,
} from "@codemirror/language"
import { lintGutter, linter } from "@codemirror/lint"
import { highlightSelectionMatches } from "@codemirror/search"
import { EditorState } from "@codemirror/state"
import { oneDark } from "@codemirror/theme-one-dark"
import { EditorView, lineNumbers } from "@codemirror/view"
import stringifyPretty from "json-stringify-pretty-compact"
import { cn } from "../../lib/utils"

export interface JsonEditorProps {
  value: unknown
  onChange(value: unknown): void
  title?: string | null
  ariaLabel?: string
  className?: string
  editorClassName?: string
  onFocus?(): void
  onBlur?(): void
  withScroll?: boolean
}

function formatJsonValue(value: unknown) {
  return stringifyPretty(value === undefined ? {} : value, {
    indent: 2,
    maxLength: 40,
  })
}

export function JsonEditor({
  value,
  onChange,
  title = "JSON",
  ariaLabel = "JSON editor",
  className,
  editorClassName,
  onFocus,
  onBlur,
  withScroll = false,
}: JsonEditorProps) {
  const [code, setCode] = useState(() => formatJsonValue(value))
  const [isFocused, setIsFocused] = useState(false)
  const isFocusedRef = useRef(false)

  const formattedValue = useMemo(() => formatJsonValue(value), [value])
  const extensions = useMemo(
    () => [
      lineNumbers(),
      foldGutter(),
      indentOnInput(),
      bracketMatching(),
      autocompletion(),
      highlightSelectionMatches(),
      json(),
      lintGutter(),
      linter(jsonParseLinter()),
      EditorState.tabSize.of(2),
      EditorView.lineWrapping,
    ],
    []
  )

  useEffect(() => {
    isFocusedRef.current = isFocused
  }, [isFocused])

  useEffect(() => {
    if (isFocused || code === formattedValue) {
      return
    }

    queueMicrotask(() => {
      if (!isFocusedRef.current) {
        setCode((currentCode) =>
          currentCode === formattedValue ? currentCode : formattedValue
        )
      }
    })
  }, [code, formattedValue, isFocused])

  const handleChange = useCallback(
    (nextCode: string) => {
      setCode(nextCode)

      try {
        onChange(JSON.parse(nextCode))
      } catch {
        // Keep invalid in-progress JSON visible until the user fixes it.
      }
    },
    [onChange]
  )

  const handleFocus = useCallback(() => {
    setCode(formattedValue)
    setIsFocused(true)
    onFocus?.()
  }, [formattedValue, onFocus])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    onBlur?.()
  }, [onBlur])

  return (
    <div
      className={cn(
        "flex h-[360px] max-h-full min-h-0 flex-col border border-border bg-card",
        withScroll && "h-full",
        className
      )}
      data-wd-key="json-editor"
      role="group"
      aria-label={ariaLabel}
    >
      {title !== null ? (
        <div className="flex h-8 shrink-0 items-center border-b border-border px-3">
          <span className="font-mono text-[11px] leading-none font-semibold tracking-[0.06em] text-muted-foreground uppercase">
            {title}
          </span>
        </div>
      ) : null}
      <div
        className={cn(
          "relative min-h-0 flex-1 overflow-hidden bg-background text-xs",
          editorClassName
        )}
      >
        <CodeMirror
          value={code}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          theme={oneDark}
          extensions={extensions}
          basicSetup={false}
          height="100%"
          className="h-full"
        />
      </div>
    </div>
  )
}
