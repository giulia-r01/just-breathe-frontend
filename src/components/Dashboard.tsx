import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import UltimoRespiro from "./dashboardComponents/UltimoRespiro"
import UltimoDiario from "./dashboardComponents/UltimoDiario"
import UltimiTask from "./dashboardComponents/UltimiTask"
import UltimoMood from "./dashboardComponents/UltimoMood"
import UltimiEventiSalvati from "./dashboardComponents/UltimiEventiSalvati"
import DashboardSkeleton from "./dashboardComponents/DashboardSkeleton"
import "../assets/cssVari/dashboard.css"

interface Utente {
  id: number
  nome: string
  email: string
}

const Dashboard = function () {
  const [utente, setUtente] = useState<Utente | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const controller = new AbortController()

    fetch(`${import.meta.env.VITE_API_URL}/utenti/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero dei tuoi dati.")
        return res.json()
      })
      .then((data) => {
        setUtente(data)
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [navigate])

  if (loading) {
    return (
      <Container className="dashboard-shell my-4" role="main" aria-busy="true">
        <Row className="g-4">
          <Col lg={4} md={6}>
            <DashboardSkeleton
              title="Respirazioni guidate"
              iconClassName="bi bi-wind"
              lines={4}
            />
          </Col>
          <Col lg={4} md={6}>
            <DashboardSkeleton title="Diario" iconClassName="bi bi-book" />
          </Col>
          <Col lg={4} md={6}>
            <DashboardSkeleton
              title="Ultime task in calendario"
              iconClassName="bi bi-calendar3"
              lines={4}
            />
          </Col>
          <Col lg={4} md={6}>
            <DashboardSkeleton
              title="Mood"
              iconClassName="bi bi-music-note-beamed"
            />
          </Col>
          <Col lg={8} md={12}>
            <DashboardSkeleton
              title="Scopri gli eventi disponibili nella tua citta"
              iconClassName="bi bi-geo-alt"
              lines={5}
            />
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container className="dashboard-shell my-4">
      <h1 className="dashboard-branding">
        <span className="dashboard-branding-title">
          Ciao <em>{utente?.nome}</em>
        </span>
        <span className="dashboard-branding-subtitle pt-2">
          <em>Chiudi fuori il caos. Inizia da un respiro.</em>
        </span>
      </h1>

      <Row className="g-4 mt-3">
        <Col lg={4} md={6}>
          <UltimoRespiro />
        </Col>
        <Col lg={4} md={6}>
          <UltimoDiario />
        </Col>
        <Col lg={4} md={6}>
          <UltimiTask escludiFatti={true} />
        </Col>
        <Col lg={4} md={6}>
          <UltimoMood />
        </Col>
        <Col lg={8} md={12}>
          <UltimiEventiSalvati />
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
