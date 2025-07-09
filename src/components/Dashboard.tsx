/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import UltimoRespiro from "./dashboardComponents/UltimoRespiro"
import UltimoDiario from "./dashboardComponents/UltimoDiario"
import UltimiTask from "./dashboardComponents/UltimiTask"
import UltimoMood from "./dashboardComponents/UltimoMood"

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
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  return (
    <Container className="my-4">
      <h2 className="text-center py-4 text-white mynav rounded">
        Ciao <strong>{utente?.nome}</strong> 🌿
      </h2>

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
          <UltimiTask />
        </Col>

        <Col md={6}>
          <Card className="h-100 mynav text-white">
            <Card.Body>
              <Card.Title>Eventi Salvati</Card.Title>
              <Card.Text>Nessun evento salvato al momento.</Card.Text>
              <Button variant="success" onClick={() => navigate("/eventi")}>
                Cerca eventi nella tua città
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
