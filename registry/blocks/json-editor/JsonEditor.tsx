import { autocompletion } from "@codemirror/autocomplete"
import { json, jsonParseLinter } from "@codemirror/lang-json"
import {
  bracketMatching,
  foldGutter,
  HighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language"
import { linter, lintGutter } from "@codemirror/lint"
import { highlightSelectionMatches } from "@codemirror/search"
import { EditorState, type Extension } from "@codemirror/state"
import { EditorView, lineNumbers } from "@codemirror/view"
import { tags } from "@lezer/highlight"
import CodeMirror from "@uiw/react-codemirror"
import stringifyPretty from "json-stringify-pretty-compact"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type JsonEditorTheme = "app" | "light" | "dark" | "none" | Extension

export interface JsonEditorProps {
  value: unknown
  onChange(value: unknown): void
  title?: string | null
  ariaLabel?: string
  className?: string
  editorClassName?: string
  headerClassName?: string
  titleClassName?: string
  theme?: JsonEditorTheme
  onFocus?(): void
  onBlur?(): void
  withScroll?: boolean
}

const appJsonEditorTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
  },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    lineHeight: "1.5",
  },
  ".cm-content": {
    minHeight: "100%",
    padding: "8px 0",
    caretColor: "var(--foreground)",
  },
  ".cm-line": {
    padding: "0 12px 0 8px",
  },
  ".cm-gutters": {
    backgroundColor: "var(--muted)",
    color: "var(--muted-foreground)",
    borderRight: "1px solid var(--border)",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    minWidth: "32px",
    padding: "0 8px 0 6px",
  },
  ".cm-foldGutter .cm-gutterElement": {
    padding: "0 5px",
  },
  ".cm-gutter-lint": {
    width: "2px",
  },
  ".cm-gutter-lint .cm-gutterElement": {
    minWidth: "2px",
    padding: "0",
    overflow: "hidden",
  },
  ".cm-activeLine": {
    backgroundColor: "var(--selection-bg)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--selection-bg)",
    color: "var(--foreground)",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "var(--selection-bg-mid)",
  },
  "&.cm-focused": {
    outline: "none",
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "var(--foreground)",
  },
  "&.cm-focused .cm-matchingBracket": {
    backgroundColor: "var(--selection-bg-deep)",
    outline: "1px solid var(--primary)",
  },
  ".cm-tooltip": {
    border: "1px solid var(--border)",
    backgroundColor: "var(--popover)",
    color: "var(--popover-foreground)",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: "var(--selection-bg)",
    color: "var(--foreground)",
  },
  ".cm-diagnostic-error": {
    borderLeftColor: "var(--destructive)",
  },
  ".cm-lintRange-error": {
    backgroundImage:
      "linear-gradient(45deg, transparent 65%, var(--destructive) 80%, transparent 90%)",
  },
})

const appJsonHighlightStyle = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.propertyName, color: "var(--primary)" },
    { tag: tags.string, color: "var(--cat-2)" },
    { tag: tags.number, color: "var(--cat-3)" },
    { tag: tags.bool, color: "var(--cat-4)" },
    { tag: tags.null, color: "var(--muted-foreground)" },
    { tag: tags.punctuation, color: "var(--muted-foreground)" },
  ]),
)

function formatJsonValue(value: unknown) {
  return stringifyPretty(value === undefined ? {} : value, {
    indent: 2,
    maxLength: 40,
  })
}

export function JsonEditor({
  value,
  onChange,
  title = null,
  ariaLabel = "JSON editor",
  className,
  editorClassName,
  headerClassName,
  titleClassName,
  theme = "app",
  onFocus,
  onBlur,
  withScroll = false,
}: JsonEditorProps) {
  const [code, setCode] = useState(() => formatJsonValue(value))
  const [isFocused, setIsFocused] = useState(false)
  const isFocusedRef = useRef(false)
  const formattedValueRef = useRef(code)
  const pendingFormattedValueRef = useRef<string | null>(null)

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
      theme === "app" ? [appJsonEditorTheme, appJsonHighlightStyle] : [],
      EditorState.tabSize.of(2),
      EditorView.lineWrapping,
    ],
    [theme],
  )
  const codeMirrorTheme = theme === "app" ? "none" : theme

  useEffect(() => {
    isFocusedRef.current = isFocused
  }, [isFocused])

  useEffect(() => {
    if (formattedValueRef.current === formattedValue) {
      return
    }

    formattedValueRef.current = formattedValue
    pendingFormattedValueRef.current = formattedValue

    if (isFocused) {
      return
    }

    queueMicrotask(() => {
      if (isFocusedRef.current || formattedValueRef.current !== formattedValue) {
        return
      }

      pendingFormattedValueRef.current = null
      setCode((currentCode) => (currentCode === formattedValue ? currentCode : formattedValue))
    })
  }, [formattedValue, isFocused])

  useEffect(() => {
    if (isFocused || pendingFormattedValueRef.current === null) {
      return
    }

    const pendingFormattedValue = pendingFormattedValueRef.current
    queueMicrotask(() => {
      if (isFocusedRef.current || formattedValueRef.current !== pendingFormattedValue) {
        return
      }

      pendingFormattedValueRef.current = null
      setCode((currentCode) =>
        currentCode === pendingFormattedValue ? currentCode : pendingFormattedValue,
      )
    })
  }, [isFocused])

  const handleChange = useCallback(
    (nextCode: string) => {
      setCode(nextCode)

      try {
        onChange(JSON.parse(nextCode))
      } catch {
        // Keep invalid in-progress JSON visible until the user fixes it.
      }
    },
    [onChange],
  )

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    onFocus?.()
  }, [onFocus])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    onBlur?.()
  }, [onBlur])

  return (
    <fieldset
      className={cn(
        "relative m-0 flex h-[360px] max-h-full min-h-0 w-full flex-col overflow-hidden border border-input bg-background p-0",
        withScroll && "h-full",
        className,
      )}
      data-wd-key="json-editor"
      aria-label={ariaLabel}
    >
      {title !== null ? (
        <div
          className={cn(
            "flex h-8 shrink-0 items-center border-b border-border bg-muted/40 px-3",
            headerClassName,
          )}
        >
          <span
            className={cn(
              "font-mono text-[11px] leading-none font-semibold tracking-[0.06em] text-muted-foreground uppercase",
              titleClassName,
            )}
          >
            {title}
          </span>
        </div>
      ) : null}
      <div
        className={cn(
          "relative min-h-0 flex-1 overflow-hidden bg-background text-xs",
          editorClassName,
        )}
      >
        <CodeMirror
          value={code}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          theme={codeMirrorTheme}
          extensions={extensions}
          basicSetup={false}
          height="100%"
          className="h-full"
        />
      </div>
    </fieldset>
  )
}
