/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

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
      <h2 className="text-center py-5 text-white mynav rounded">
        Ciao <strong>{utente?.nome}</strong> 🌿
      </h2>

      <Row className="g-4 pt-5">
        <Col md={6}>
          <Card className="h-100 mynav text-white">
            <Card.Body>
              <Card.Title>Respiro Guidato</Card.Title>
              <Card.Text>
                Non hai ancora salvato esercizi di respirazione.
              </Card.Text>
              <Button variant="success" onClick={() => navigate("/respiro")}>
                Vai agli esercizi
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 mynav text-white">
            <Card.Body>
              <Card.Title>Diario</Card.Title>
              <Card.Text>Non hai ancora scritto nulla nel diario.</Card.Text>
              <Button variant="success" onClick={() => navigate("/diario")}>
                Scrivi qualcosa
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 mynav text-white">
            <Card.Body>
              <Card.Title>Mood</Card.Title>
              <Card.Text>Non hai ancora registrato stati d’animo.</Card.Text>
              <Button variant="success" onClick={() => navigate("/mood")}>
                Crea il tuo mood
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 mynav text-white">
            <Card.Body>
              <Card.Title>To-Do List</Card.Title>
              <Card.Text>Non hai ancora creato attività.</Card.Text>
              <Button variant="success" onClick={() => navigate("/calendario")}>
                Vai al calendario
              </Button>
            </Card.Body>
          </Card>
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
