import type { ColormapName } from "./types"

/**
 * CSS `linear-gradient` strings for each named colormap, tuned to closely
 * match TiTiler's matplotlib defaults. These are scientific data palettes
 * (the actual colormap preview), so raw hex stops are correct here — they
 * are data, not chrome, and must not be remapped to design tokens.
 */
export const COLORMAP_GRADIENTS: Record<ColormapName, string> = {
  viridis:
    "linear-gradient(to right, #440154, #482878, #3e4989, #31688e, #26828e, #1f9e89, #35b779, #6ece58, #b5de2b, #fde725)",
  plasma:
    "linear-gradient(to right, #0d0887, #5302a3, #8b0aa5, #b83289, #db5c68, #f48849, #febd2a, #f0f921)",
  inferno:
    "linear-gradient(to right, #000004, #1b0c42, #4a0c6b, #781c6d, #a52c60, #cf4446, #ed6925, #fb9b06, #f7d13d, #fcffa4)",
  magma:
    "linear-gradient(to right, #000004, #180f3e, #451077, #721f81, #9f2f7f, #cd4071, #f1605d, #fd9668, #feca8d, #fcfdbf)",
  terrain: "linear-gradient(to right, #333399, #00a6d6, #33a65c, #b5cc66, #c2a875, #ffffff)",
  turbo:
    "linear-gradient(to right, #30123b, #4145ab, #4675ed, #39a2fc, #1bcfd4, #24eca6, #61fc6c, #a4fc3c, #d1e834, #f3c63a, #fe9b2d, #f36315, #d93806, #ad1006)",
  greys: "linear-gradient(to right, #ffffff, #000000)",
  custom: "linear-gradient(to right, #2a6fdb 0%, #f6f4ef 50%, #d97757 100%)",
}

export const NAMED_COLORMAPS: ColormapName[] = [
  "viridis",
  "magma",
  "inferno",
  "plasma",
  "turbo",
  "terrain",
  "greys",
]
