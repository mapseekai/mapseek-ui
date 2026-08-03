"use client"

import { ConfirmProvider } from "@registry/ui/confirm-dialog"
import { Toaster } from "@registry/ui/sonner"
import { useTheme } from "next-themes"
import type { ReactNode } from "react"

export function DocsProviders({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()
  return (
    <ConfirmProvider>
      {children}
      <Toaster theme={resolvedTheme === "dark" ? "dark" : "light"} />
    </ConfirmProvider>
  )
}
