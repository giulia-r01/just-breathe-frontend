import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { setupAuthInterceptor } from "./utils/authInterceptor"

setupAuthInterceptor()

createRoot(document.getElementById("root")!).render(<App />)
