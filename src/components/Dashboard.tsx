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
          <UltimiEventiSalvati />
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
