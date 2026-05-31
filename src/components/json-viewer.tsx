import React, { useMemo } from "react"
import type { JSX } from "react"
import { cn } from "../lib/utils"
import { Button } from "./button"
import { Collapsible, CollapsibleContent } from "./collapsible"
import { IconCheck, IconChevronRight, IconCopy } from "@tabler/icons-react"

interface JsonViewerProps {
  data: Record<string, unknown>
  className?: string
  showLineNumbers?: boolean
  showColorIndent?: boolean
  collapseOn?: "click" | "doubleClick"
  defaultExpanded?: boolean | number
  title?: string
  expandAllLabel?: string
  collapseAllLabel?: string
  copyFeedbackDurationMs?: number
}

type DataType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "object"
  | "array"
  | "unknown"

const getDataType = (value: unknown): DataType => {
  if (value === null) return "null"
  if (Array.isArray(value)) return "array"
  const type = typeof value
  if (
    type === "string" ||
    type === "number" ||
    type === "boolean" ||
    type === "object"
  ) {
    return type
  }
  return "unknown"
}

const getTypeStyle = (type: DataType): string => {
  switch (type) {
    case "string":
      return "text-green-600 dark:text-green-400"
    case "number":
      return "text-orange-600 dark:text-orange-400"
    case "boolean":
      return "text-blue-600 dark:text-blue-400"
    case "null":
      return "text-gray-500 dark:text-gray-400"
    default:
      return ""
  }
}

/** Renders a leaf (non-object/array) JSON value as a single colored span. */
const LeafValue: React.FC<{ value: unknown; type: DataType }> = ({
  value,
  type,
}) => {
  const typeStyle = getTypeStyle(type)
  if (type === "string") {
    return (
      <span className={cn(typeStyle, "wrap-break-words whitespace-pre-wrap")}>
        {`'${value as string}'`}
      </span>
    )
  }
  if (type === "null") {
    return <span className={cn(typeStyle, "whitespace-nowrap")}>null</span>
  }
  return (
    <span className={cn(typeStyle, "whitespace-nowrap")}>{String(value)}</span>
  )
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const calculateLineCount = (
  data: unknown,
  expandedPaths: Set<string>,
  path = "root"
): number => {
  const dataType = getDataType(data)

  if (dataType === "object") {
    if (!expandedPaths.has(path)) return 1
    const entries = Object.entries(data as Record<string, unknown>)
    if (entries.length === 0) return 2
    return (
      2 +
      entries.reduce<number>(
        (acc, [key, value]) =>
          acc + calculateLineCount(value, expandedPaths, `${path}.${key}`),
        0
      )
    )
  }

  if (dataType === "array") {
    if (!expandedPaths.has(path)) return 1
    const items = data as unknown[]
    if (items.length === 0) return 2
    return (
      2 +
      items.reduce<number>(
        (acc, item, index) =>
          acc + calculateLineCount(item, expandedPaths, `${path}[${index}]`),
        0
      )
    )
  }

  return 1
}

const generateAllPaths = (
  data: unknown,
  maxLevel: number = Infinity,
  currentLevel: number = 0,
  currentPath: string = "root"
): Set<string> => {
  const paths = new Set<string>()
  if (currentLevel > maxLevel) return paths

  if (Array.isArray(data)) {
    paths.add(currentPath)
    data.forEach((item, index) => {
      generateAllPaths(
        item,
        maxLevel,
        currentLevel + 1,
        `${currentPath}[${index}]`
      ).forEach((p) => paths.add(p))
    })
  } else if (isPlainObject(data)) {
    paths.add(currentPath)
    Object.entries(data).forEach(([key, value]) => {
      generateAllPaths(
        value,
        maxLevel,
        currentLevel + 1,
        `${currentPath}.${key}`
      ).forEach((p) => paths.add(p))
    })
  }
  return paths
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  className,
  showLineNumbers = true,
  showColorIndent = false,
  collapseOn = "click",
  defaultExpanded = false,
  title,
  expandAllLabel = "全部展开",
  collapseAllLabel = "全部收起",
  copyFeedbackDurationMs = 3000,
}) => {
  const [copied, setCopied] = React.useState(false)
  const copyFeedbackTimerRef = React.useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined)
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(() => {
    if (typeof defaultExpanded === "number") {
      return generateAllPaths(data, defaultExpanded)
    }
    if (defaultExpanded === true) {
      return generateAllPaths(data)
    }
    return new Set<string>(["root"])
  })

  const toggleNode = (path: string) => {
    setExpandedPaths((prev) => {
      const newPaths = new Set(prev)
      if (newPaths.has(path)) {
        newPaths.delete(path)
      } else {
        newPaths.add(path)
      }
      return newPaths
    })
  }

  const expandAll = () => setExpandedPaths(generateAllPaths(data))
  const collapseAll = () => setExpandedPaths(new Set<string>(["root"]))
  const copyToClipboard = async () => {
    setCopied(true)
    if (copyFeedbackTimerRef.current) {
      clearTimeout(copyFeedbackTimerRef.current)
    }
    copyFeedbackTimerRef.current = setTimeout(() => {
      setCopied(false)
      copyFeedbackTimerRef.current = undefined
    }, copyFeedbackDurationMs)
    try {
      await navigator.clipboard?.writeText(JSON.stringify(data, null, 2))
    } catch {
      // The visual acknowledgement should not disappear just because the
      // browser blocks clipboard writes in a restricted environment.
    }
  }

  React.useEffect(() => {
    return () => {
      if (copyFeedbackTimerRef.current) {
        clearTimeout(copyFeedbackTimerRef.current)
      }
    }
  }, [])

  const lineCount = useMemo(
    () => calculateLineCount(data, expandedPaths, "root"),
    [data, expandedPaths]
  )

  return (
    <div
      className={cn(
        "relative flex w-full flex-col bg-card font-mono text-[13px] leading-6 text-foreground",
        className
      )}
    >
      <div className="z-10 flex h-8 shrink-0 items-center gap-2 border-b border-border px-3">
        <div className="text-[11px] leading-none font-semibold tracking-[0.06em] text-muted-foreground uppercase">
          {title}
        </div>
        <span className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          onClick={expandAll}
          className="h-6 rounded-none px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          {expandAllLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={collapseAll}
          className="h-6 rounded-none px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          {collapseAllLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => {
            void copyToClipboard()
          }}
          className={cn(
            "h-7 rounded-none bg-transparent text-foreground hover:bg-muted",
            copied ? "gap-1.5 px-2" : "w-7 px-0"
          )}
          title={copied ? "已复制" : "复制"}
          aria-live="polite"
        >
          {copied ? (
            <>
              <IconCheck size={14} stroke={1.7} />
              <span className="text-[11px] font-medium">已复制</span>
            </>
          ) : (
            <IconCopy size={14} stroke={1.5} />
          )}
        </Button>
      </div>
      <div className="min-h-0 w-full flex-1 overflow-auto p-3">
        <pre className="flex">
          {showLineNumbers && (
            <div className="hidden sm:block">
              <LineNumbers lineCount={lineCount} />
            </div>
          )}
          <code>
            <JsonNode
              data={data}
              path="root"
              expandedPaths={expandedPaths}
              toggleNode={toggleNode}
              showColorIndent={showColorIndent}
              collapseOn={collapseOn}
            />
          </code>
        </pre>
      </div>
    </div>
  )
}

const LineNumbers: React.FC<{ lineCount: number }> = ({ lineCount }) => {
  return (
    <div className="mr-4 flex flex-col border-r border-border pr-4 text-right text-muted-foreground select-none">
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i} className="h-6 text-xs leading-6 tabular-nums opacity-50">
          {i + 1}
        </div>
      ))}
    </div>
  )
}

interface JsonNodeProps {
  data: unknown
  level?: number
  path: string
  expandedPaths: Set<string>
  toggleNode: (path: string) => void
  showComma?: boolean
  objectKey?: string
  showColorIndent?: boolean
  collapseOn?: "click" | "doubleClick"
}

const JsonNode: React.FC<JsonNodeProps> = ({
  data,
  level = 0,
  path,
  expandedPaths,
  toggleNode,
  showComma,
  objectKey,
  showColorIndent,
  collapseOn,
}) => {
  const dataType = getDataType(data)

  let element: JSX.Element
  if (dataType === "array") {
    element = (
      <JsonArray
        data={data as unknown[]}
        level={level}
        path={path}
        expandedPaths={expandedPaths}
        toggleNode={toggleNode}
        showComma={showComma}
        objectKey={objectKey}
        showColorIndent={showColorIndent}
        collapseOn={collapseOn}
      />
    )
  } else if (dataType === "object") {
    element = (
      <JsonObject
        data={data as Record<string, unknown>}
        level={level}
        path={path}
        expandedPaths={expandedPaths}
        toggleNode={toggleNode}
        showComma={showComma}
        objectKey={objectKey}
        showColorIndent={showColorIndent}
        collapseOn={collapseOn}
      />
    )
  } else {
    element = <LeafValue value={data} type={dataType} />
  }

  return (
    <>
      {element}
      {dataType !== "object" && dataType !== "array" && showComma && (
        <span className="text-muted-foreground">,</span>
      )}
    </>
  )
}

const indentColors = [
  "border-red-300/60 dark:border-red-700/60",
  "border-yellow-300/60 dark:border-yellow-700/60",
  "border-green-300/60 dark:border-green-700/60",
  "border-blue-300/60 dark:border-blue-700/60",
  "border-purple-300/60 dark:border-purple-700/60",
]

const CollapseTrigger: React.FC<{
  objectKey?: string
  isOpen: boolean
  bracket: string
  closeBracket: string
  count: number
  showComma?: boolean
  collapseOn?: "click" | "doubleClick"
  onToggle: () => void
}> = ({
  objectKey,
  isOpen,
  bracket,
  closeBracket,
  count,
  showComma,
  collapseOn,
  onToggle,
}) => (
  <div
    className={cn(
      "group -ml-1 inline-flex h-6 w-full cursor-pointer items-center rounded-sm px-1 text-left leading-6 select-none",
      isOpen && "hover:bg-muted-foreground/20"
    )}
    onDoubleClick={collapseOn === "doubleClick" ? onToggle : undefined}
    onClick={collapseOn === "doubleClick" ? undefined : onToggle}
  >
    {objectKey && (
      <span
        className={cn(
          "group inline-flex items-center text-purple-600 dark:text-purple-400",
          bracket === "{" && "font-medium"
        )}
      >
        {`'${objectKey}'`}
        <span className="mx-1 text-muted-foreground">: </span>
      </span>
    )}
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className="h-4 w-4 p-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
    >
      <IconChevronRight
        size={14}
        stroke={1.5}
        className={cn("shrink-0 transition-transform", isOpen && "rotate-90")}
      />
    </Button>
    <span className="text-muted-foreground">{bracket}</span>
    {!isOpen && (
      <>
        <span className="text-muted-foreground">...</span>
        <span className="text-muted-foreground">
          {closeBracket} ({count} {count === 1 ? "item" : "items"})
        </span>
        {showComma && <span className="text-muted-foreground">,</span>}
      </>
    )}
  </div>
)

const indentClass = (level: number, showColorIndent?: boolean): string =>
  cn(
    "border-l pl-5",
    showColorIndent
      ? indentColors[level % indentColors.length]
      : "border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
  )

const JsonObject: React.FC<{
  objectKey?: string
  data: Record<string, unknown>
  level: number
  path: string
  expandedPaths: Set<string>
  toggleNode: (path: string) => void
  showComma?: boolean
  showColorIndent?: boolean
  collapseOn?: "click" | "doubleClick"
}> = ({
  data,
  level,
  path,
  expandedPaths,
  toggleNode,
  showComma,
  objectKey,
  showColorIndent,
  collapseOn,
}) => {
  const entries = Object.entries(data)
  const isOpen = expandedPaths.has(path)

  return (
    <Collapsible open={isOpen} onOpenChange={() => toggleNode(path)} asChild>
      <div>
        <CollapseTrigger
          objectKey={objectKey}
          isOpen={isOpen}
          bracket="{"
          closeBracket="}"
          count={entries.length}
          showComma={showComma}
          collapseOn={collapseOn}
          onToggle={() => toggleNode(path)}
        />
        <CollapsibleContent className="transition-all duration-200">
          <div className={indentClass(level, showColorIndent)}>
            {entries.map(([key, value], index) => {
              const childPath = `${path}.${key}`
              const childType = getDataType(value)
              const isChildCollapsible =
                childType === "object" || childType === "array"
              const isChildOpen =
                isChildCollapsible && expandedPaths.has(childPath)

              return (
                <div
                  key={key}
                  className={cn(
                    "group rounded-md",
                    !isChildCollapsible && "flex min-h-6 items-start",
                    isChildOpen ? "" : "hover:bg-muted-foreground/20"
                  )}
                >
                  {isChildCollapsible ? (
                    <JsonNode
                      data={value}
                      level={level + 1}
                      path={childPath}
                      expandedPaths={expandedPaths}
                      toggleNode={toggleNode}
                      showComma={index < entries.length - 1}
                      objectKey={key}
                      showColorIndent={showColorIndent}
                      collapseOn={collapseOn}
                    />
                  ) : (
                    <>
                      <span className="inline-flex items-center text-purple-600 dark:text-purple-400">
                        {`'${key}'`}
                      </span>
                      <span className="text-muted-foreground">: </span>
                      <JsonNode
                        data={value}
                        level={level + 1}
                        path={childPath}
                        expandedPaths={expandedPaths}
                        toggleNode={toggleNode}
                        showComma={index < entries.length - 1}
                        showColorIndent={showColorIndent}
                        collapseOn={collapseOn}
                      />
                    </>
                  )}
                </div>
              )
            })}
          </div>
          <div>
            <span className="text-muted-foreground">{"}"}</span>
            {showComma && <span className="text-muted-foreground">,</span>}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

const JsonArray: React.FC<{
  objectKey?: string
  data: unknown[]
  level: number
  path: string
  expandedPaths: Set<string>
  toggleNode: (path: string) => void
  showComma?: boolean
  showColorIndent?: boolean
  collapseOn?: "click" | "doubleClick"
}> = ({
  data,
  level,
  path,
  expandedPaths,
  toggleNode,
  showComma,
  objectKey,
  showColorIndent,
  collapseOn,
}) => {
  const isOpen = expandedPaths.has(path)

  return (
    <Collapsible open={isOpen} onOpenChange={() => toggleNode(path)} asChild>
      <div>
        <CollapseTrigger
          objectKey={objectKey}
          isOpen={isOpen}
          bracket="["
          closeBracket="]"
          count={data.length}
          showComma={showComma}
          collapseOn={collapseOn}
          onToggle={() => toggleNode(path)}
        />
        <CollapsibleContent className="transition-all duration-200">
          <div className={indentClass(level, showColorIndent)}>
            {data.map((item, index) => {
              const childPath = `${path}[${index}]`
              const childType = getDataType(item)
              const isChildCollapsible =
                childType === "object" || childType === "array"
              const isChildOpen =
                isChildCollapsible && expandedPaths.has(childPath)

              return (
                <div
                  key={index}
                  className={cn(
                    "group rounded-md",
                    !isChildCollapsible && "flex min-h-6 items-start",
                    isChildOpen ? "" : "hover:bg-muted-foreground/20"
                  )}
                >
                  <JsonNode
                    data={item}
                    level={level + 1}
                    path={childPath}
                    expandedPaths={expandedPaths}
                    toggleNode={toggleNode}
                    showComma={index < data.length - 1}
                    showColorIndent={showColorIndent}
                    collapseOn={collapseOn}
                  />
                </div>
              )
            })}
          </div>
          <div>
            <span className="text-muted-foreground">]</span>
            {showComma && <span className="text-muted-foreground">,</span>}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

export { JsonViewer }
export default JsonViewer
