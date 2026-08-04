import { defineI18n } from "fumadocs-core/i18n"

export const i18n = defineI18n({
  defaultLanguage: "zh-CN",
  languages: ["zh-CN", "en"],
  hideLocale: "default-locale",
})

export type Locale = "zh-CN" | "en"

/** Resolve locale + page slug from the [[...slug]] route segments. */
export function resolveRoute(segments: readonly string[] | undefined): {
  lang: Locale
  slug: string[] | undefined
} {
  if (segments && segments[0] === "en") {
    const rest = segments.slice(1)
    return { lang: "en", slug: rest.length > 0 ? rest : undefined }
  }
  const slug = segments && segments.length > 0 ? [...segments] : undefined
  return { lang: "zh-CN", slug }
}
