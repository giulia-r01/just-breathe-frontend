import { useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"
import "./index.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import NavbarJB from "./components/NavbarJB"
import FooterJB from "./components/FooterJB"
import Register from "./components/Register"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <NavbarJB />
        <main className="flex-grow-1"></main>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
        <FooterJB />
      </BrowserRouter>
    </>
  )
}

export default App
