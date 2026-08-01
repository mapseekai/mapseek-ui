import BrowserOnly from "@docusaurus/BrowserOnly"
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
  const [revision, setRevision] = useState(0)
  const [sourceVisible, setSourceVisible] = useState(false)
  const [copyStatus, setCopyStatus] = useState<"copied" | "failed" | "idle">("idle")

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
            onClick={() => setSourceVisible((visible) => !visible)}
          >
            {sourceVisible ? "Hide source" : "Show source"}
          </button>
          <button className={styles.action} type="button" onClick={copySource}>
            Copy source
          </button>
          <button
            className={styles.action}
            type="button"
            onClick={() => setRevision((value) => value + 1)}
          >
            Reset example
          </button>
        </div>
      </header>

      <div className={styles.preview} style={{ minHeight }}>
        <BrowserOnly fallback={<p className={styles.status}>Loading example…</p>}>
          {() => (
            <DemoErrorBoundary
              key={revision}
              fallback={
                <p className={styles.error} role="alert">
                  The example could not be rendered.
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

      <p className={styles.liveStatus} aria-live="polite">
        {copyStatus === "copied" ? "Source copied" : null}
        {copyStatus === "failed" ? "Source copy failed" : null}
        {revision > 0 ? ` Reset count: ${revision}` : null}
      </p>
    </section>
  )
}
