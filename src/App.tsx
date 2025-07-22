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
import Diario from "./components/Diario"
import ToDoList from "./components/ToDoList"
import Mood from "./components/Mood"
import Eventi from "./components/Eventi"
import ProfiloUtente from "./components/ProfiloUtente"
import BackOffice from "./components/BackOffice"
import ChiSiamo from "./components/ChiSiamo"
import PrivacyPolicy from "./components/PrivacyPolicy"
import NotFound from "./components/NotFound"

function App() {
  return (
    <>
      <BrowserRouter>
        <NavbarJB />
        <main className="flex-grow-1 pt-5 mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/password/recupero" element={<RecuperoPsw />} />
            <Route path="/reset-password" element={<ResetPsw />} />
            <Route path="/index" element={<Dashboard />} />
            <Route path="/respirazioni" element={<Respiri />} />
            <Route path="/diario" element={<Diario />} />
            <Route path="/todolist" element={<ToDoList />} />
            <Route path="/mood" element={<Mood />} />
            <Route path="/eventi" element={<Eventi />} />
            <Route path="/profilo" element={<ProfiloUtente />} />
            <Route path="/backoffice" element={<BackOffice />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <FooterJB />
      </BrowserRouter>
    </>
  )
}

export default App
