"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

function normalize(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1)
  return pathname
}

export function LocaleSwitcher() {
  const pathname = normalize(usePathname() ?? "/")
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/")
  const zhPath = isEnglish ? pathname.replace(/^\/en/, "") || "/" : pathname
  const enPath = isEnglish ? pathname : `/en${pathname === "/" ? "" : pathname}`
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        className="inline-flex items-center gap-1 px-2 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {isEnglish ? "English" : "简体中文"}
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-50 mt-1 min-w-28 border border-fd-border bg-fd-popover p-1 shadow-md">
          {isEnglish ? (
            <a
              className="block px-2 py-1.5 text-sm text-fd-popover-foreground hover:bg-fd-accent"
              href={`${basePath}${zhPath}`}
            >
              简体中文
            </a>
          ) : (
            <a
              className="block px-2 py-1.5 text-sm text-fd-popover-foreground hover:bg-fd-accent"
              href={`${basePath}${enPath}`}
            >
              English
            </a>
          )}
        </div>
      ) : null}
    </div>
  )
}
