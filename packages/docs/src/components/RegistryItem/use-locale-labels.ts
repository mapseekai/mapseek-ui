"use client"

import { useParams } from "next/navigation"

export type LocaleLabels<T> = {
  readonly zh: T
  readonly en: T
}

export function useLocaleLabels<T>(labels: LocaleLabels<T>): T {
  const params = useParams()
  const segs = (params.slug as string[] | undefined) ?? []
  const locale = segs[0] === "en" ? "en" : "zh-CN"
  return locale === "zh-CN" ? labels.zh : labels.en
}
