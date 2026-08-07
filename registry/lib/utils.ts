import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Mapseek type scale utilities (`text-body-md`, `text-headline-lg`, …) set font
// properties, never color. tailwind-merge's default config does not know them
// and classifies any unknown `text-*` class as a text color, so merging
// e.g. "text-body-md-medium text-primary-foreground text-body-md" silently
// dropped `text-primary-foreground` (xs Button rendered dark text). Register
// the scale under `font-size` so color classes survive the merge.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-headline-lg",
        "text-headline-md",
        "text-headline-sm",
        "text-body-base",
        "text-body-lg",
        "text-body-lg-medium",
        "text-body-md",
        "text-body-md-medium",
        "text-body-md-strong",
        "text-body-sm",
        "text-body-sm-medium",
        "text-label-sm",
        "text-label-md",
        "text-data-display",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
