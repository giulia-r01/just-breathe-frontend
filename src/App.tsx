import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"
import "./index.css"
import NavbarJB from "./components/NavbarJB"
import FooterJB from "./components/FooterJB"
import { clearSessionAndRedirectToLoginIfNeeded, isTokenExpired } from "./utils/authInterceptor"
import { getSessionToken } from "./utils/session"

const Register = lazy(() => import("./components/Register"))
const Login = lazy(() => import("./components/Login"))
const RecuperoPsw = lazy(() => import("./components/RecuperoPsw"))
const ResetPsw = lazy(() => import("./components/ResetPsw"))
const Home = lazy(() => import("./components/Home"))
const Dashboard = lazy(() => import("./components/Dashboard"))
const Respiri = lazy(() => import("./components/Respiri"))
const Diario = lazy(() => import("./components/Diario"))
const ToDoList = lazy(() => import("./components/ToDoList"))
const Mood = lazy(() => import("./components/Mood"))
const Eventi = lazy(() => import("./components/Eventi"))
const ProfiloUtente = lazy(() => import("./components/ProfiloUtente"))
const BackOffice = lazy(() => import("./components/BackOffice"))
const ChiSiamo = lazy(() => import("./components/ChiSiamo"))
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"))
const NotFound = lazy(() => import("./components/NotFound"))

const SessionGuard = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const token = getSessionToken()

    if (!token) return

    if (isTokenExpired(token)) {
      clearSessionAndRedirectToLoginIfNeeded(navigate, location.pathname)
      return
    }

    if (location.pathname === "/" || location.pathname === "/login") {
      navigate("/index", { replace: true })
    }
  }, [location.pathname, navigate])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="container py-5" role="status" aria-live="polite">
            <div className="jb-loading-skeleton">
              <span className="visually-hidden">Caricamento pagina</span>
              <span className="placeholder col-12" />
              <span className="placeholder col-10" />
              <span className="placeholder col-8" />
            </div>
          </div>
        }
      >
        <SessionGuard />
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
      </Suspense>
    </BrowserRouter>
  )
}

export default App
