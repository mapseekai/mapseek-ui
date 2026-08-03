"use client"

import { Button } from "@registry/ui/button"
import { CopyButton } from "@registry/ui/copy-button"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { useParams } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"
import { DemoErrorBoundary } from "./DemoErrorBoundary"
import styles from "./styles.module.css"

export type ComponentDemoProps = {
  readonly title: string
  readonly description?: string
  readonly source: string
  readonly children: ReactNode
  readonly minHeight?: number
}

export function ComponentDemo({
  title,
  description,
  source,
  children,
  minHeight = 160,
}: ComponentDemoProps) {
  const params = useParams()
  const segs = (params.slug as string[] | undefined) ?? []
  const locale = segs[0] === "en" ? "en" : "zh-CN"
  const [mounted, setMounted] = useState(false)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])
  const [sourceVisible, setSourceVisible] = useState(false)
  const [copyStatus, setCopyStatus] = useState<"copied" | "failed" | "idle">("idle")
  const labels =
    locale === "zh-CN"
      ? {
          copy: "复制源码",
          copyDone: "已复制",
          copyFailed: "源码复制失败",
          copied: "源码已复制",
          error: "示例无法渲染。",
          hideSource: "隐藏源码",
          loading: "正在加载示例…",
          reset: "重置示例",
          resetCount: (count: number) => `重置次数：${count}`,
          showSource: "查看源码",
        }
      : {
          copy: "Copy source",
          copyDone: "Copied",
          copyFailed: "Source copy failed",
          copied: "Source copied",
          error: "The example could not be rendered.",
          hideSource: "Hide source",
          loading: "Loading example…",
          reset: "Reset example",
          resetCount: (count: number) => `Reset count: ${count}`,
          showSource: "Show source",
        }

  return (
    <section className={styles.demo} aria-label={title}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
        <div className={styles.actions}>
          <Button
            className={styles.action}
            size="default"
            variant="outline"
            type="button"
            aria-expanded={sourceVisible}
            data-demo-action="source"
            onClick={() => setSourceVisible((visible) => !visible)}
          >
            {sourceVisible ? labels.hideSource : labels.showSource}
          </Button>
          <CopyButton
            className={styles.action}
            content={source}
            copiedLabel={labels.copyDone}
            data-demo-action="copy"
            label={labels.copy}
            onCopiedChange={(copied) => setCopyStatus(copied ? "copied" : "idle")}
            onCopyError={() => setCopyStatus("failed")}
            textSize="default"
            variant="text"
          />
          <Button
            className={styles.action}
            size="default"
            variant="outline"
            type="button"
            data-demo-action="reset"
            onClick={() => setRevision((value) => value + 1)}
          >
            {labels.reset}
          </Button>
        </div>
      </header>

      <div className={styles.preview} data-showcase-root style={{ minHeight }}>
        {mounted ? (
          <DemoErrorBoundary
            key={revision}
            fallback={
              <p className={styles.error} role="alert">
                {labels.error}
              </p>
            }
          >
            <div key={revision}>{children}</div>
          </DemoErrorBoundary>
        ) : (
          <p className={styles.status}>{labels.loading}</p>
        )}
      </div>

      {sourceVisible ? (
        <DynamicCodeBlock
          code={source}
          lang="tsx"
          codeblock={{
            allowCopy: false,
            className: styles.source,
            viewportProps: { className: styles.sourceViewport },
          }}
        />
      ) : null}

      <p
        className={styles.liveStatus}
        data-copy-status={copyStatus}
        data-reset-revision={revision}
        aria-live="polite"
      >
        {copyStatus === "copied" ? labels.copied : null}
        {copyStatus === "failed" ? labels.copyFailed : null}
        {revision > 0 ? ` ${labels.resetCount(revision)}` : null}
      </p>
    </section>
  )
}
