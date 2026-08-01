import BrowserOnly from "@docusaurus/BrowserOnly"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import { type ReactNode, useState } from "react"
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
  const { i18n } = useDocusaurusContext()
  const [revision, setRevision] = useState(0)
  const [sourceVisible, setSourceVisible] = useState(false)
  const [copyStatus, setCopyStatus] = useState<"copied" | "failed" | "idle">("idle")
  const labels =
    i18n.currentLocale === "zh-CN"
      ? {
          copy: "复制源码",
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
          copyFailed: "Source copy failed",
          copied: "Source copied",
          error: "The example could not be rendered.",
          hideSource: "Hide source",
          loading: "Loading example…",
          reset: "Reset example",
          resetCount: (count: number) => `Reset count: ${count}`,
          showSource: "Show source",
        }

  const copySource = async () => {
    try {
      await navigator.clipboard.writeText(source)
      setCopyStatus("copied")
    } catch {
      setCopyStatus("failed")
    }
  }

  return (
    <section className={styles.demo} aria-label={title}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
        <div className={styles.actions}>
          <button
            className={styles.action}
            type="button"
            aria-expanded={sourceVisible}
            data-demo-action="source"
            onClick={() => setSourceVisible((visible) => !visible)}
          >
            {sourceVisible ? labels.hideSource : labels.showSource}
          </button>
          <button
            className={styles.action}
            type="button"
            data-demo-action="copy"
            onClick={copySource}
          >
            {labels.copy}
          </button>
          <button
            className={styles.action}
            type="button"
            data-demo-action="reset"
            onClick={() => setRevision((value) => value + 1)}
          >
            {labels.reset}
          </button>
        </div>
      </header>

      <div className={styles.preview} style={{ minHeight }}>
        <BrowserOnly fallback={<p className={styles.status}>{labels.loading}</p>}>
          {() => (
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
          )}
        </BrowserOnly>
      </div>

      {sourceVisible ? (
        <pre className={styles.source}>
          <code>{source}</code>
        </pre>
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
