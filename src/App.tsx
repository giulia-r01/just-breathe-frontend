import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"
import "./index.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import NavbarJB from "./components/NavbarJB"
import FooterJB from "./components/FooterJB"
import Register from "./components/Register"
import Login from "./components/Login"
import RecuperoPsw from "./components/RecuperoPsw"
import ResetPsw from "./components/ResetPsw"
import Home from "./components/Home"
import Dashboard from "./components/Dashboard"
import Respiri from "./components/Respiri"

function App() {
  return (
    <>
      <BrowserRouter>
        <NavbarJB />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/password/recupero" element={<RecuperoPsw />} />
            <Route path="/reset-password" element={<ResetPsw />} />
            <Route path="/index" element={<Dashboard />} />
            <Route path="/respirazioni" element={<Respiri />} />
          </Routes>
        </main>
        <FooterJB />
      </BrowserRouter>
    </>
  )
}

export default App
