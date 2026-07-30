import { cn } from "@/lib/utils"

export interface PlaceholderGlyphProps {
  /** Rendered width/height in px. */
  size?: number
  /** Stable hash seed — same seed always yields the same shape. */
  seed?: string
  /** Render in muted tone instead of foreground. */
  mono?: boolean
  className?: string
}

/**
 * Deterministic monochrome placeholder glyph. Hashes `seed` into one of 12
 * stroked SVG shapes, so a resource keeps a stable icon across renders without
 * any real asset. Stands in for not-yet-uploaded SVG icons in the resource
 * library grids, detail drawer, and sprite previews.
 */
export function PlaceholderGlyph({
  size = 24,
  seed = "x",
  mono = false,
  className,
}: PlaceholderGlyphProps) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const v = h % 12
  const sw = Math.max(1, Math.round(size / 18))

  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: cn("block", mono ? "text-muted-foreground" : "text-foreground", className),
  }

  switch (v) {
    case 0:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="7" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      )
    case 1:
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      )
    case 2:
      return (
        <svg {...props}>
          <polygon points="12 3 21 8 21 16 12 21 3 16 3 8" />
          <line x1="12" y1="12" x2="12" y2="21" />
        </svg>
      )
    case 3:
      return (
        <svg {...props}>
          <path d="M3 12 L12 3 L21 12 L12 21 Z" />
        </svg>
      )
    case 4:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 5:
      return (
        <svg {...props}>
          <polyline points="3 17 9 11 13 14 21 6" />
          <circle cx="9" cy="11" r="1.5" fill="currentColor" />
        </svg>
      )
    case 6:
      return (
        <svg {...props}>
          <path d="M12 2 L4 7 V17 L12 22 L20 17 V7 Z" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
      )
    case 7:
      return (
        <svg {...props}>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="14" y2="18" />
        </svg>
      )
    case 8:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="7" x2="12" y2="13" />
          <line x1="12" y1="13" x2="16" y2="15" />
        </svg>
      )
    case 9:
      return (
        <svg {...props}>
          <path d="M5 19 L9 12 L14 16 L19 6" />
          <circle cx="19" cy="6" r="1.5" fill="currentColor" />
        </svg>
      )
    case 10:
      return (
        <svg {...props}>
          <rect x="5" y="5" width="6" height="6" />
          <rect x="13" y="5" width="6" height="6" />
          <rect x="5" y="13" width="6" height="6" />
          <rect x="13" y="13" width="6" height="6" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <polygon points="12 4 14 10 20 10 15 14 17 20 12 16 7 20 9 14 4 10 10 10" />
        </svg>
      )
  }
}
