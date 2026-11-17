"use client"

import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import {
  IconAlertOctagonFilled,
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconInfoCircleFilled,
  IconLoader,
  IconX,
} from "@tabler/icons-react"
import type * as React from "react"

import { cn } from "@/registry/lib/utils"

const toast = ToastPrimitive.createToastManager()

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider data-slot="toast-provider" {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full",
        className,
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-none border border-border bg-popover text-popover-foreground shadow-none outline-none select-none will-change-transform focus-visible:border-ring focus-visible:ring-(length:--focus-ring-width) focus-visible:ring-ring/20 data-[type=success]:border-primary data-[type=success]:bg-[color-mix(in_oklch_shorter_hue,var(--primary)_5%,var(--popover))] data-[type=error]:border-destructive data-[type=error]:bg-[color-mix(in_oklch_shorter_hue,var(--destructive)_10%,var(--popover))] data-[type=warning]:border-warning data-[type=warning]:bg-[color-mix(in_oklch_shorter_hue,var(--warning)_10%,var(--popover))] data-[type=info]:border-info data-[type=info]:bg-[color-mix(in_oklch_shorter_hue,var(--info)_10%,var(--popover))]",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))] data-limited:opacity-0 data-starting-style:[transform:translateY(150%)] [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)] data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        className,
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-3 overflow-hidden px-3 py-2.5 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className,
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(
        "text-body-md-medium leading-tight group-data-[type=success]/toast:text-primary group-data-[type=error]/toast:text-destructive group-data-[type=warning]/toast:text-warning group-data-[type=info]/toast:text-info",
        className,
      )}
      {...props}
    />
  )
}

function ToastDescription({ className, ...props }: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn(
        "text-body-sm leading-snug text-muted-foreground group-data-[type=success]/toast:text-primary group-data-[type=error]/toast:text-destructive group-data-[type=warning]/toast:text-warning group-data-[type=info]/toast:text-info",
        className,
      )}
      {...props}
    />
  )
}

function ToastAction({ className, ...props }: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "h-7 shrink-0 border border-border bg-background px-2 text-body-sm-medium text-foreground hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-(length:--focus-ring-width) focus-visible:ring-ring/20",
        "group-data-[type=success]/toast:border-primary/50 group-data-[type=success]/toast:text-primary group-data-[type=success]/toast:hover:bg-primary/10",
        "group-data-[type=error]/toast:border-destructive/50 group-data-[type=error]/toast:text-destructive group-data-[type=error]/toast:hover:bg-destructive/10",
        "group-data-[type=warning]/toast:border-warning/50 group-data-[type=warning]/toast:text-warning group-data-[type=warning]/toast:hover:bg-warning/10",
        "group-data-[type=info]/toast:border-info/50 group-data-[type=info]/toast:text-info group-data-[type=info]/toast:hover:bg-info/10",
        className,
      )}
      {...props}
    />
  )
}

function ToastClose({ className, children, ...props }: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      className={cn(
        "relative flex size-5 shrink-0 items-center justify-center self-start text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-(length:--focus-ring-width) focus-visible:ring-ring/50 after:absolute after:-inset-2 after:content-['']",
        className,
      )}
      {...props}
    >
      {children ?? <IconX className="size-3.5" aria-hidden="true" />}
    </ToastPrimitive.Close>
  )
}

function ToastIcon({ type }: { type: string | undefined }) {
  const icons: Record<string, React.ReactNode> = {
    success: <IconCircleCheckFilled className="size-4 text-primary" aria-hidden="true" />,
    info: <IconInfoCircleFilled className="size-4 text-info" aria-hidden="true" />,
    warning: <IconAlertTriangleFilled className="size-4 text-warning" aria-hidden="true" />,
    error: <IconAlertOctagonFilled className="size-4 text-destructive" aria-hidden="true" />,
    loading: (
      <IconLoader
        className="size-3.5 animate-spin text-muted-foreground"
        stroke={1.75}
        aria-hidden="true"
      />
    ),
  }
  const icon = type ? icons[type] : null

  if (!icon) return null

  return (
    <span
      data-slot="toast-icon"
      className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
    >
      {icon}
    </span>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        {toastItem.actionProps?.children ? <ToastAction /> : null}
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}

function Toaster({
  children,
  toastManager = toast,
  timeout = 2500,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} timeout={timeout} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export {
  createToastManager,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToastIcon,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  useToastManager,
}
