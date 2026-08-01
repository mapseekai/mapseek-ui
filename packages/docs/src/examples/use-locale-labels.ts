import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

export type LocaleLabels<T> = {
  readonly zh: T
  readonly en: T
}

export function useLocaleLabels<T>(labels: LocaleLabels<T>): T {
  const { i18n } = useDocusaurusContext()

  return i18n.currentLocale === "zh-CN" ? labels.zh : labels.en
}
