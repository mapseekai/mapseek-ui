import { ConfirmProvider } from "@registry/ui/confirm-dialog"
import { Toaster } from "@registry/ui/sonner"
import { type ReactNode, useEffect, useState } from "react"

type DocusaurusRootProps = {
  children: ReactNode
}

export default function Root({ children }: DocusaurusRootProps) {
  const [toasterTheme, setToasterTheme] = useState<"dark" | "light">("light")

  useEffect(() => {
    const html = document.documentElement

    const syncTheme = () => {
      const isDark = html.dataset.theme === "dark"
      html.classList.toggle("dark", isDark)
      setToasterTheme(isDark ? "dark" : "light")
    }

    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] })

    return () => observer.disconnect()
  }, [])

  return (
    <ConfirmProvider>
      {children}
      <Toaster theme={toasterTheme} />
    </ConfirmProvider>
  )
}
