declare module "*?raw" {
  const source: string
  export default source
}

declare module "@registry/ui/confirm-dialog" {
  export const ConfirmProvider: import("react").ComponentType<{
    children: import("react").ReactNode
  }>
}

declare module "@registry/ui/sonner" {
  export const Toaster: import("react").ComponentType<{
    theme?: "dark" | "light" | "system"
  }>
}
