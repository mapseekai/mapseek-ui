import { createRoot } from "react-dom/client"
import "./app.css"

const rootElement = document.getElementById("root")
if (rootElement === null) {
  throw new Error("Missing root element")
}

createRoot(rootElement).render(<main>Mapseek aggregate smoke test</main>)
