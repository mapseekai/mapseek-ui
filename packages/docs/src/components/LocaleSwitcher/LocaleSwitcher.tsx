"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@registry/ui/dropdown-menu"
import { usePathname } from "next/navigation"

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 px-2 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80">
        {isEnglish ? "English" : "简体中文"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-28">
        {isEnglish ? (
          <DropdownMenuItem render={<a href={`${basePath}${zhPath}`} />}>简体中文</DropdownMenuItem>
        ) : (
          <DropdownMenuItem render={<a href={`${basePath}${enPath}`} />}>English</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
