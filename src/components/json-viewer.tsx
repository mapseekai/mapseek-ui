import React, { useMemo } from "react";
import type { JSX } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Collapsible, CollapsibleContent } from "./collapsible";
import { IconButton } from "./icon-button";
import { IconChevronRight, IconCopy } from "@tabler/icons-react";

interface JsonViewerProps {
  data: Record<string, unknown>;
  className?: string;
  showLineNumbers?: boolean;
  showColorIndent?: boolean;
  collapseOn?: "click" | "doubleClick";
  defaultExpanded?: boolean | number;
  title?: string;
}

type DataType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "object"
  | "array"
  | "unknown";

const getDataType = (value: unknown): DataType => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  const type = typeof value;
  if (
    type === "string" ||
    type === "number" ||
    type === "boolean" ||
    type === "object"
  ) {
    return type;
  }
  return "unknown";
};

const getTypeStyle = (type: DataType): string => {
  switch (type) {
    case "string":
      return "text-green-600 dark:text-green-400";
    case "number":
      return "text-orange-600 dark:text-orange-400";
    case "boolean":
      return "text-blue-600 dark:text-blue-400";
    case "null":
      return "text-gray-500 dark:text-gray-400";
    default:
      return "";
  }
};

/** Renders a leaf (non-object/array) JSON value as a single colored span. */
const LeafValue: React.FC<{ value: unknown; type: DataType }> = ({
  value,
  type
}) => {
  const typeStyle = getTypeStyle(type);
  if (type === "string") {
    return (
      <span className={cn(typeStyle, "whitespace-pre-wrap wrap-break-words")}>
        {`'${value as string}'`}
      </span>
    );
  }
  if (type === "null") {
    return <span className={cn(typeStyle, "whitespace-nowrap")}>null</span>;
  }
  return (
    <span className={cn(typeStyle, "whitespace-nowrap")}>{String(value)}</span>
  );
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const calculateLineCount = (
  data: unknown,
  expandedPaths: Set<string>,
  path = "root"
): number => {
  const dataType = getDataType(data);

  if (dataType === "object") {
    if (!expandedPaths.has(path)) return 1;
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return 2;
    return (
      2 +
      entries.reduce<number>(
        (acc, [key, value]) =>
          acc + calculateLineCount(value, expandedPaths, `${path}.${key}`),
        0
      )
    );
  }

  if (dataType === "array") {
    if (!expandedPaths.has(path)) return 1;
    const items = data as unknown[];
    if (items.length === 0) return 2;
    return (
      2 +
      items.reduce<number>(
        (acc, item, index) =>
          acc + calculateLineCount(item, expandedPaths, `${path}[${index}]`),
        0
      )
    );
  }

  return 1;
};

const generateAllPaths = (
  data: unknown,
  maxLevel: number = Infinity,
  currentLevel: number = 0,
  currentPath: string = "root"
): Set<string> => {
  const paths = new Set<string>();
  if (currentLevel > maxLevel) return paths;

  if (Array.isArray(data)) {
    paths.add(currentPath);
    data.forEach((item, index) => {
      generateAllPaths(
        item,
        maxLevel,
        currentLevel + 1,
        `${currentPath}[${index}]`
      ).forEach((p) => paths.add(p));
    });
  } else if (isPlainObject(data)) {
    paths.add(currentPath);
    Object.entries(data).forEach(([key, value]) => {
      generateAllPaths(
        value,
        maxLevel,
        currentLevel + 1,
        `${currentPath}.${key}`
      ).forEach((p) => paths.add(p));
    });
  }
  return paths;
};

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  className,
  showLineNumbers = true,
  showColorIndent = false,
  collapseOn = "click",
  defaultExpanded = false,
  title
}) => {
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(() => {
    if (typeof defaultExpanded === "number") {
      return generateAllPaths(data, defaultExpanded);
    }
    if (defaultExpanded === true) {
      return generateAllPaths(data);
    }
    return new Set<string>(["root"]);
  });

  const toggleNode = (path: string) => {
    setExpandedPaths((prev) => {
      const newPaths = new Set(prev);
      if (newPaths.has(path)) {
        newPaths.delete(path);
      } else {
        newPaths.add(path);
      }
      return newPaths;
    });
  };

  const lineCount = useMemo(
    () => calculateLineCount(data, expandedPaths, "root"),
    [data, expandedPaths]
  );

  return (
    <div
      className={cn(
        "relative font-mono text-[13px] leading-6 w-full text-foreground bg-secondary/10 dark:bg-muted/50 rounded-md border border-border flex flex-col",
        className
      )}
    >
      <div className="flex justify-between items-center p-2 z-10 gap-2">
        <div className="text-xs font-medium text-muted-foreground px-2">
          {title}
        </div>
        <IconButton
          size="sm"
          onClick={() => {
            void navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
          }}
          className="size-7 rounded-none bg-transparent hover:bg-muted text-foreground"
          title="Copy"
        >
          <IconCopy size={14} stroke={1.5} />
        </IconButton>
      </div>
      <div className="w-full overflow-auto flex-1 p-4 pt-0">
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
  );
};

const LineNumbers: React.FC<{ lineCount: number }> = ({ lineCount }) => {
  return (
    <div className="flex flex-col text-right pr-4 text-muted-foreground select-none border-r border-border mr-4">
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i} className="h-6 leading-6 text-xs tabular-nums opacity-50">
          {i + 1}
        </div>
      ))}
    </div>
  );
};

interface JsonNodeProps {
  data: unknown;
  level?: number;
  path: string;
  expandedPaths: Set<string>;
  toggleNode: (path: string) => void;
  showComma?: boolean;
  objectKey?: string;
  showColorIndent?: boolean;
  collapseOn?: "click" | "doubleClick";
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
  collapseOn
}) => {
  const dataType = getDataType(data);

  let element: JSX.Element;
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
    );
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
    );
  } else {
    element = <LeafValue value={data} type={dataType} />;
  }

  return (
    <>
      {element}
      {dataType !== "object" && dataType !== "array" && showComma && (
        <span className="text-muted-foreground">,</span>
      )}
    </>
  );
};

const indentColors = [
  "border-red-300/60 dark:border-red-700/60",
  "border-yellow-300/60 dark:border-yellow-700/60",
  "border-green-300/60 dark:border-green-700/60",
  "border-blue-300/60 dark:border-blue-700/60",
  "border-purple-300/60 dark:border-purple-700/60"
];

const CollapseTrigger: React.FC<{
  objectKey?: string;
  isOpen: boolean;
  bracket: string;
  closeBracket: string;
  count: number;
  showComma?: boolean;
  collapseOn?: "click" | "doubleClick";
  onToggle: () => void;
}> = ({
  objectKey,
  isOpen,
  bracket,
  closeBracket,
  count,
  showComma,
  collapseOn,
  onToggle
}) => (
  <div
    className={cn(
      "inline-flex items-center text-left h-6 leading-6 group rounded-sm px-1 -ml-1 w-full cursor-pointer select-none",
      isOpen && "hover:bg-muted-foreground/20"
    )}
    onDoubleClick={collapseOn === "doubleClick" ? onToggle : undefined}
    onClick={collapseOn === "doubleClick" ? undefined : onToggle}
  >
    {objectKey && (
      <span
        className={cn(
          "text-purple-600 dark:text-purple-400 inline-flex items-center group",
          bracket === "{" && "font-medium"
        )}
      >
        {`'${objectKey}'`}
        <span className="text-muted-foreground mx-1">: </span>
      </span>
    )}
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
    >
      <IconChevronRight
        size={14}
        stroke={1.5}
        className={cn("transition-transform shrink-0", isOpen && "rotate-90")}
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
);

const indentClass = (level: number, showColorIndent?: boolean): string =>
  cn(
    "pl-5 border-l",
    showColorIndent
      ? indentColors[level % indentColors.length]
      : "border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
  );

const JsonObject: React.FC<{
  objectKey?: string;
  data: Record<string, unknown>;
  level: number;
  path: string;
  expandedPaths: Set<string>;
  toggleNode: (path: string) => void;
  showComma?: boolean;
  showColorIndent?: boolean;
  collapseOn?: "click" | "doubleClick";
}> = ({
  data,
  level,
  path,
  expandedPaths,
  toggleNode,
  showComma,
  objectKey,
  showColorIndent,
  collapseOn
}) => {
  const entries = Object.entries(data);
  const isOpen = expandedPaths.has(path);

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
              const childPath = `${path}.${key}`;
              const childType = getDataType(value);
              const isChildCollapsible =
                childType === "object" || childType === "array";
              const isChildOpen =
                isChildCollapsible && expandedPaths.has(childPath);

              return (
                <div
                  key={key}
                  className={cn(
                    "group rounded-md",
                    !isChildCollapsible && "flex items-start min-h-6",
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
                      <span className="text-purple-600 dark:text-purple-400 inline-flex items-center">
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
              );
            })}
          </div>
          <div>
            <span className="text-muted-foreground">{"}"}</span>
            {showComma && <span className="text-muted-foreground">,</span>}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

const JsonArray: React.FC<{
  objectKey?: string;
  data: unknown[];
  level: number;
  path: string;
  expandedPaths: Set<string>;
  toggleNode: (path: string) => void;
  showComma?: boolean;
  showColorIndent?: boolean;
  collapseOn?: "click" | "doubleClick";
}> = ({
  data,
  level,
  path,
  expandedPaths,
  toggleNode,
  showComma,
  objectKey,
  showColorIndent,
  collapseOn
}) => {
  const isOpen = expandedPaths.has(path);

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
              const childPath = `${path}[${index}]`;
              const childType = getDataType(item);
              const isChildCollapsible =
                childType === "object" || childType === "array";
              const isChildOpen =
                isChildCollapsible && expandedPaths.has(childPath);

              return (
                <div
                  key={index}
                  className={cn(
                    "group rounded-md",
                    !isChildCollapsible && "flex items-start min-h-6",
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
              );
            })}
          </div>
          <div>
            <span className="text-muted-foreground">]</span>
            {showComma && <span className="text-muted-foreground">,</span>}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export { JsonViewer };
export default JsonViewer;
