import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

export type ProductLogoProps = {
  src: string
  alt?: string
  size?: number
  height?: CSSProperties["height"]
  width?: CSSProperties["width"]
  showText?: boolean
  label?: string
  className?: string
  imageClassName?: string
  textClassName?: string
  style?: CSSProperties
  imageStyle?: CSSProperties
}

export function ProductLogo({
  src,
  alt,
  size = 22,
  height,
  width,
  showText = true,
  label,
  className,
  imageClassName,
  textClassName,
  style,
  imageStyle,
}: ProductLogoProps) {
  const displayLabel = label ?? alt

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} style={style}>
      <img
        src={src}
        alt={alt ?? ""}
        style={{
          width: width ?? "auto",
          height: height ?? size,
          objectFit: "contain",
          ...imageStyle,
        }}
        className={cn("shrink-0", imageClassName)}
      />
      {showText && displayLabel && (
        <span
          className={cn(
            "text-sm font-semibold tracking-[-0.02em] whitespace-nowrap",
            textClassName,
          )}
        >
          {displayLabel}
        </span>
      )}
    </span>
  )
}
