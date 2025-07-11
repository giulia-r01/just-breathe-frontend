/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Col, Container, Row, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import UltimoRespiro from "./dashboardComponents/UltimoRespiro"
import UltimoDiario from "./dashboardComponents/UltimoDiario"
import UltimiTask from "./dashboardComponents/UltimiTask"
import UltimoMood from "./dashboardComponents/UltimoMood"
import UltimiEventiSalvati from "./dashboardComponents/UltimiEventiSalvati"

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

    fetch("http://localhost:8080/utenti/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero utente")
        return res.json()
      })
      .then((data) => {
        setUtente(data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Container className="mt-5 text-center" role="main">
        <div role="status" aria-live="polite">
          <Spinner animation="border" />
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </Container>
    )
  }

  return (
    <Container className="my-4">
      <h1 className="visually-hidden">Dashboard</h1>
      <h2
        className="text-center py-4 text-white mynav rounded"
        aria-describedby="dashboard-subtitle"
      >
        Ciao <strong>{utente?.nome}</strong> 🌿
      </h2>
      <p id="dashboard-subtitle" className="visually-hidden">
        Benvenuto nella tua area personale dove potrai accedere a diario,
        eventi, mood e altro.
      </p>
      <Row className="g-4 pt-5">
        <Col md={6}>
          <UltimoRespiro />
        </Col>

        <Col md={6}>
          <UltimoDiario />
        </Col>

        <Col md={6}>
          <UltimoMood />
        </Col>

        <Col md={6}>
          <UltimiTask escludiFatti={true} />
        </Col>

        <Col md={6}>
          <UltimiEventiSalvati />
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
