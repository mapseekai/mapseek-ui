import { IconChevronRight } from "@tabler/icons-react"
import type { JSX } from "react"
import React, { useMemo } from "react"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/ui/collapsible"
import { CopyButton } from "@/registry/ui/copy-button"

interface JsonViewerProps {
  data: Record<string, unknown> | unknown[]
  className?: string
  showLineNumbers?: boolean
  showColorIndent?: boolean
  collapseOn?: "click" | "doubleClick"
  defaultExpanded?: boolean | number
  title?: string
  expandAllLabel?: string
  collapseAllLabel?: string
  copyLabel?: string
  copiedLabel?: string
  itemLabel?: string
  itemsLabel?: string
  copyContent?: string
  copyFeedbackDurationMs?: number
}

type DataType = "string" | "number" | "boolean" | "null" | "object" | "array" | "unknown"

const getDataType = (value: unknown): DataType => {
  if (value === null) return "null"
  if (Array.isArray(value)) return "array"
  const type = typeof value
  if (type === "string" || type === "number" || type === "boolean" || type === "object") {
    return type
  }
  return "unknown"
}

const getTypeStyle = (type: DataType): string => {
  switch (type) {
    case "string":
      return "text-cat-1"
    case "number":
      return "text-cat-3"
    case "boolean":
      return "text-cat-2"
    case "null":
      return "text-muted-foreground"
    default:
      return ""
  }
}

/** Renders a leaf (non-object/array) JSON value as a single colored span. */
const LeafValue: React.FC<{ value: unknown; type: DataType }> = ({ value, type }) => {
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
  return <span className={cn(typeStyle, "whitespace-nowrap")}>{String(value)}</span>
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const isKeyboardTriggeredChange = (event: Event): boolean =>
  event instanceof KeyboardEvent || (event instanceof MouseEvent && event.detail === 0)

const calculateLineCount = (data: unknown, expandedPaths: Set<string>, path = "root"): number => {
  if (isPlainObject(data)) {
    if (!expandedPaths.has(path)) return 1
    const entries = Object.entries(data)
    if (entries.length === 0) return 2
    return (
      2 +
      entries.reduce<number>(
        (acc, [key, value]) => acc + calculateLineCount(value, expandedPaths, `${path}.${key}`),
        0,
      )
    )
  }

  if (Array.isArray(data)) {
    if (!expandedPaths.has(path)) return 1
    if (data.length === 0) return 2
    return (
      2 +
      data.reduce<number>(
        (acc, item, index) => acc + calculateLineCount(item, expandedPaths, `${path}[${index}]`),
        0,
      )
    )
  }

  return 1
}

const generateAllPaths = (
  data: unknown,
  maxLevel: number = Infinity,
  currentLevel: number = 0,
  currentPath: string = "root",
): Set<string> => {
  const paths = new Set<string>()
  if (currentLevel > maxLevel) return paths

  if (Array.isArray(data)) {
    paths.add(currentPath)
    data.forEach((item, index) => {
      generateAllPaths(item, maxLevel, currentLevel + 1, `${currentPath}[${index}]`).forEach(
        (p) => {
          paths.add(p)
        },
      )
    })
  } else if (isPlainObject(data)) {
    paths.add(currentPath)
    Object.entries(data).forEach(([key, value]) => {
      generateAllPaths(value, maxLevel, currentLevel + 1, `${currentPath}.${key}`).forEach((p) => {
        paths.add(p)
      })
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
  copyLabel = "复制",
  copiedLabel = "已复制",
  itemLabel = "项",
  itemsLabel = "项",
  copyContent,
  copyFeedbackDurationMs = 3000,
}) => {
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(() => {
    if (typeof defaultExpanded === "number") {
      return generateAllPaths(data, defaultExpanded)
    }
    if (defaultExpanded === true) {
      return generateAllPaths(data)
    }
    return new Set<string>(["root"])
  })

  const setNodeExpanded = (path: string, open?: boolean) => {
    setExpandedPaths((previous) => {
      const next = new Set(previous)
      const shouldOpen = open ?? !next.has(path)
      if (shouldOpen) {
        next.add(path)
      } else {
        next.delete(path)
      }
      return next
    })
  }

  const expandAll = () => setExpandedPaths(generateAllPaths(data))
  const collapseAll = () => setExpandedPaths(new Set<string>(["root"]))
  const serializedData = useMemo(() => JSON.stringify(data, null, 2), [data])
  const resolvedCopyContent = copyContent ?? serializedData

  const lineCount = useMemo(
    () => calculateLineCount(data, expandedPaths, "root"),
    [data, expandedPaths],
  )

  return (
    <div
      className={cn(
        "relative flex w-full flex-col bg-card font-mono text-body-lg leading-6 text-foreground",
        className,
      )}
    >
      <div className="z-10 flex h-8 shrink-0 items-center gap-2 border-b border-border px-3">
        <div className="text-label-sm leading-none text-muted-foreground uppercase">{title}</div>
        <span className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={expandAll}
          className="rounded-none px-2 text-body-sm-medium text-muted-foreground hover:text-foreground"
        >
          {expandAllLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={collapseAll}
          className="rounded-none px-2 text-body-sm-medium text-muted-foreground hover:text-foreground"
        >
          {collapseAllLabel}
        </Button>
        <CopyButton
          content={resolvedCopyContent}
          label={copyLabel}
          copiedLabel={copiedLabel}
          duration={copyFeedbackDurationMs}
          className="rounded-none bg-transparent text-foreground hover:bg-accent/50"
        />
      </div>
      <div className="min-h-0 w-full flex-1 overflow-auto p-3">
        <div className="flex">
          {showLineNumbers && (
            <div className="hidden sm:block">
              <LineNumbers lineCount={lineCount} />
            </div>
          )}
          <div className="min-w-0 flex-1 rounded-none">
            <JsonNode
              data={data}
              path="root"
              expandedPaths={expandedPaths}
              setNodeExpanded={setNodeExpanded}
              showColorIndent={showColorIndent}
              collapseOn={collapseOn}
              itemLabel={itemLabel}
              itemsLabel={itemsLabel}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const LineNumbers: React.FC<{ lineCount: number }> = ({ lineCount }) => {
  return (
    <div className="mr-4 flex flex-col border-r border-border pr-4 text-right text-muted-foreground select-none">
      {Array.from({ length: lineCount }, (_, i) => i + 1).map((lineNumber) => (
        <div key={lineNumber} className="h-6 text-body-md leading-6 tabular-nums opacity-50">
          {lineNumber}
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
  setNodeExpanded: (path: string, open?: boolean) => void
  showComma?: boolean
  objectKey?: string
  showColorIndent?: boolean
  collapseOn?: "click" | "doubleClick"
  itemLabel: string
  itemsLabel: string
}

const JsonNode: React.FC<JsonNodeProps> = ({
  data,
  level = 0,
  path,
  expandedPaths,
  setNodeExpanded,
  showComma,
  objectKey,
  showColorIndent,
  collapseOn,
  itemLabel,
  itemsLabel,
}) => {
  const dataType = getDataType(data)

  let element: JSX.Element
  if (Array.isArray(data)) {
    element = (
      <JsonArray
        data={data}
        level={level}
        path={path}
        expandedPaths={expandedPaths}
        setNodeExpanded={setNodeExpanded}
        showComma={showComma}
        objectKey={objectKey}
        showColorIndent={showColorIndent}
        collapseOn={collapseOn}
        itemLabel={itemLabel}
        itemsLabel={itemsLabel}
      />
    )
  } else if (isPlainObject(data)) {
    element = (
      <JsonObject
        data={data}
        level={level}
        path={path}
        expandedPaths={expandedPaths}
        setNodeExpanded={setNodeExpanded}
        showComma={showComma}
        objectKey={objectKey}
        showColorIndent={showColorIndent}
        collapseOn={collapseOn}
        itemLabel={itemLabel}
        itemsLabel={itemsLabel}
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
  "border-cat-4/60",
  "border-cat-3/60",
  "border-cat-1/60",
  "border-cat-2/60",
  "border-cat-5/60",
]

const JsonCollapseTrigger: React.FC<{
  objectKey?: string
  isOpen: boolean
  bracket: string
  closeBracket: string
  count: number
  showComma?: boolean
  collapseOn?: "click" | "doubleClick"
  itemLabel: string
  itemsLabel: string
  onToggle: () => void
}> = ({
  objectKey,
  isOpen,
  bracket,
  closeBracket,
  count,
  showComma,
  collapseOn,
  itemLabel,
  itemsLabel,
  onToggle,
}) => {
  return (
    <CollapsibleTrigger
      render={
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="group -ml-1 w-full justify-start rounded-none px-1 text-left font-[inherit] leading-6 text-foreground aria-expanded:bg-transparent"
        />
      }
      onDoubleClick={collapseOn === "doubleClick" ? onToggle : undefined}
    >
      {objectKey && (
        <span
          className={cn(
            "group inline-flex items-center text-cat-5",
            bracket === "{" && "font-medium",
          )}
        >
          {`'${objectKey}'`}
          <span className="mx-1 text-muted-foreground">: </span>
        </span>
      )}
      <span className="inline-flex size-4 items-center justify-center p-0 text-muted-foreground group-hover:text-foreground">
        <IconChevronRight
          size={14}
          stroke={1.5}
          className={cn(
            "shrink-0 transition-transform motion-reduce:transition-none",
            isOpen && "rotate-90",
          )}
        />
      </span>
      <span className="text-muted-foreground">{bracket}</span>
      {!isOpen && (
        <>
          <span className="text-muted-foreground">…</span>
          <span className="text-muted-foreground">
            {closeBracket} ({count} {count === 1 ? itemLabel : itemsLabel})
          </span>
          {showComma && <span className="text-muted-foreground">,</span>}
        </>
      )}
    </CollapsibleTrigger>
  )
}

const indentClass = (level: number, showColorIndent?: boolean): string =>
  cn("border-l pl-5", showColorIndent ? indentColors[level % indentColors.length] : "border-border")

const JsonObject: React.FC<{
  objectKey?: string
  data: Record<string, unknown>
  level: number
  path: string
  expandedPaths: Set<string>
  setNodeExpanded: (path: string, open?: boolean) => void
  showComma?: boolean
  showColorIndent?: boolean
  collapseOn?: "click" | "doubleClick"
  itemLabel: string
  itemsLabel: string
}> = ({
  data,
  level,
  path,
  expandedPaths,
  setNodeExpanded,
  showComma,
  objectKey,
  showColorIndent,
  collapseOn,
  itemLabel,
  itemsLabel,
}) => {
  const entries = Object.entries(data)
  const isOpen = expandedPaths.has(path)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open, eventDetails) => {
        if (collapseOn === "doubleClick" && !isKeyboardTriggeredChange(eventDetails.event)) {
          eventDetails.cancel()
          return
        }
        setNodeExpanded(path, open)
      }}
    >
      <div>
        <JsonCollapseTrigger
          objectKey={objectKey}
          isOpen={isOpen}
          bracket="{"
          closeBracket="}"
          count={entries.length}
          showComma={showComma}
          collapseOn={collapseOn}
          itemLabel={itemLabel}
          itemsLabel={itemsLabel}
          onToggle={() => setNodeExpanded(path)}
        />
        <CollapsibleContent keepMounted>
          <div className={indentClass(level, showColorIndent)}>
            {entries.map(([key, value], index) => {
              const childPath = `${path}.${key}`
              const childType = getDataType(value)
              const isChildCollapsible = childType === "object" || childType === "array"
              const isChildOpen = isChildCollapsible && expandedPaths.has(childPath)

              return (
                <div
                  key={key}
                  className={cn(
                    "group rounded-none",
                    !isChildCollapsible && "flex min-h-6 items-start",
                    isChildOpen ? "" : "hover:bg-accent/50",
                  )}
                >
                  {isChildCollapsible ? (
                    <JsonNode
                      data={value}
                      level={level + 1}
                      path={childPath}
                      expandedPaths={expandedPaths}
                      setNodeExpanded={setNodeExpanded}
                      showComma={index < entries.length - 1}
                      objectKey={key}
                      showColorIndent={showColorIndent}
                      collapseOn={collapseOn}
                      itemLabel={itemLabel}
                      itemsLabel={itemsLabel}
                    />
                  ) : (
                    <>
                      <span className="inline-flex items-center text-cat-5">{`'${key}'`}</span>
                      <span className="text-muted-foreground">: </span>
                      <JsonNode
                        data={value}
                        level={level + 1}
                        path={childPath}
                        expandedPaths={expandedPaths}
                        setNodeExpanded={setNodeExpanded}
                        showComma={index < entries.length - 1}
                        showColorIndent={showColorIndent}
                        collapseOn={collapseOn}
                        itemLabel={itemLabel}
                        itemsLabel={itemsLabel}
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
  setNodeExpanded: (path: string, open?: boolean) => void
  showComma?: boolean
  showColorIndent?: boolean
  collapseOn?: "click" | "doubleClick"
  itemLabel: string
  itemsLabel: string
}> = ({
  data,
  level,
  path,
  expandedPaths,
  setNodeExpanded,
  showComma,
  objectKey,
  showColorIndent,
  collapseOn,
  itemLabel,
  itemsLabel,
}) => {
  const isOpen = expandedPaths.has(path)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open, eventDetails) => {
        if (collapseOn === "doubleClick" && !isKeyboardTriggeredChange(eventDetails.event)) {
          eventDetails.cancel()
          return
        }
        setNodeExpanded(path, open)
      }}
    >
      <div>
        <JsonCollapseTrigger
          objectKey={objectKey}
          isOpen={isOpen}
          bracket="["
          closeBracket="]"
          count={data.length}
          showComma={showComma}
          collapseOn={collapseOn}
          itemLabel={itemLabel}
          itemsLabel={itemsLabel}
          onToggle={() => setNodeExpanded(path)}
        />
        <CollapsibleContent keepMounted>
          <div className={indentClass(level, showColorIndent)}>
            {data.map((item, index) => {
              const childPath = `${path}[${index}]`
              const childType = getDataType(item)
              const isChildCollapsible = childType === "object" || childType === "array"
              const isChildOpen = isChildCollapsible && expandedPaths.has(childPath)

              return (
                <div
                  key={childPath}
                  className={cn(
                    "group rounded-none",
                    !isChildCollapsible && "flex min-h-6 items-start",
                    isChildOpen ? "" : "hover:bg-accent/50",
                  )}
                >
                  <JsonNode
                    data={item}
                    level={level + 1}
                    path={childPath}
                    expandedPaths={expandedPaths}
                    setNodeExpanded={setNodeExpanded}
                    showComma={index < data.length - 1}
                    showColorIndent={showColorIndent}
                    collapseOn={collapseOn}
                    itemLabel={itemLabel}
                    itemsLabel={itemsLabel}
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
