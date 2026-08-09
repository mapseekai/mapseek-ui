import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/registry/lib/utils"

function Switch({
  className,
  size = "default",
  variant = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
  variant?: "default" | "square"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={variant === "square" ? undefined : size}
      data-variant={variant}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-(length:--focus-ring-width) focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        variant === "default" &&
          "data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80",
        variant === "square" &&
          "data-[variant=square]:h-4 data-[variant=square]:w-6 data-[variant=square]:rounded-none data-[variant=square]:data-checked:border-transparent data-[variant=square]:data-checked:bg-primary data-[variant=square]:data-unchecked:border-border data-[variant=square]:data-unchecked:bg-muted dark:data-[variant=square]:data-unchecked:bg-muted",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-background ring-0 transition-transform",
          variant === "default" &&
            "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] rtl:group-data-[size=default]/switch:data-checked:-translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] rtl:group-data-[size=sm]/switch:data-checked:-translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 rtl:group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 rtl:group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground",
          variant === "square" &&
            "group-data-[variant=square]/switch:size-3 group-data-[variant=square]/switch:rounded-none group-data-[variant=square]/switch:bg-background group-data-[variant=square]/switch:data-checked:translate-x-[calc(100%-2px)] rtl:group-data-[variant=square]/switch:data-checked:-translate-x-[calc(100%-2px)] group-data-[variant=square]/switch:data-unchecked:translate-x-0 rtl:group-data-[variant=square]/switch:data-unchecked:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
