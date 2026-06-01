import type {
  StyleSourcePickerDraft,
  StyleSourcePickerFilter,
  StyleSourcePickerOption,
  StyleSourcePickerTypeFilter,
} from "./types"

export function getDefaultStyleSourcePickerDraft(): StyleSourcePickerDraft {
  return {
    keyword: "",
    selectedKeys: [],
    sourceFilter: "ALL",
    typeFilter: "ALL",
    viewMode: "card",
  }
}

export function filterStyleSourcePickerOptions(
  options: StyleSourcePickerOption[],
  keyword: string,
  sourceFilter: StyleSourcePickerFilter,
  typeFilter: StyleSourcePickerTypeFilter = "ALL"
): StyleSourcePickerOption[] {
  const normalizedKeyword = keyword.trim().toLowerCase()
  return options.filter((item) => {
    if (sourceFilter !== "ALL" && item.sourceKind !== sourceFilter) {
      return false
    }
    if (typeFilter !== "ALL" && item.sourceType !== typeFilter) {
      return false
    }
    if (!normalizedKeyword) {
      return true
    }

    const text =
      `${item.sourceName} ${item.sourcePath || ""} ${item.subtitle || ""} ${item.sourceUID}`.toLowerCase()
    return text.includes(normalizedKeyword)
  })
}

export function toggleStyleSourcePickerSelection(
  selectedKeys: string[],
  targetKey: string,
  disabledKeys: Set<string> = new Set()
): string[] {
  if (disabledKeys.has(targetKey)) {
    return selectedKeys
  }

  if (selectedKeys.includes(targetKey)) {
    return selectedKeys.filter((key) => key !== targetKey)
  }

  return [...selectedKeys, targetKey]
}
