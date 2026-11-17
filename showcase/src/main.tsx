import { ConfirmProvider } from "@registry/ui/confirm-dialog"
import { Toaster } from "@registry/ui/sonner"
import { Toaster as ToastToaster } from "@registry/ui/toast"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./app.css"

const rootElement = document.getElementById("root")
if (!(rootElement instanceof HTMLElement)) {
  throw new TypeError("Showcase root element is missing")
}

createRoot(rootElement).render(
  <StrictMode>
    <ConfirmProvider>
      <App />
      <Toaster />
      <ToastToaster />
    </ConfirmProvider>
  </StrictMode>,
)
