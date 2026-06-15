import type { CustomColormap } from "./types"

const SPACE_KEYWORD: Record<CustomColormap["colorSpace"], string> = {
  oklch: "in oklch",
  srgb: "in srgb",
  hsl: "in hsl",
}

/**
 * Build a CSS `linear-gradient` for a custom colormap.
 *
 * - `step` renders hard, equal-width bands (no blending).
 * - `linear` / `smooth` render a continuous gradient interpolated in the
 *   chosen color space (`in oklch|srgb|hsl`). CSS has no cubic easing, so
 *   `smooth` renders the same as `linear` here — the distinction only
 *   affects the actual server-side colormap, not this preview.
 */
export function buildColormapGradient(value: CustomColormap): string {
  const { stops, interpolation, colorSpace } = value
  if (stops.length === 0) return "transparent"
  if (stops.length === 1) return stops[0]

  if (interpolation === "step") {
    const n = stops.length
    const parts = stops.flatMap((c, i) => [
      `${c} ${((i * 100) / n).toFixed(2)}%`,
      `${c} ${(((i + 1) * 100) / n).toFixed(2)}%`,
    ])
    return `linear-gradient(to right, ${parts.join(", ")})`
  }

  const parts = stops.map((c, i) => `${c} ${((i / (stops.length - 1)) * 100).toFixed(2)}%`)
  return `linear-gradient(${SPACE_KEYWORD[colorSpace]} to right, ${parts.join(", ")})`
}
