import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import PageHero from "./common/PageHero"
import { getSessionToken } from "../utils/session"

const NotFound = function () {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const token = getSessionToken()
    setIsLoggedIn(!!token)
  }, [])

  const handleRedirect = () => {
    navigate(isLoggedIn ? "/index" : "/")
  }

  return (
    <Container className="my-4" role="main">
      <PageHero
        iconClassName="bi bi-compass"
        title="Pagina non trovata"
        subtitle="Sembra che questo percorso si sia perso strada facendo."
        className="mt-3 mb-4"
      />
      <Row className="justify-content-center mx-1">
        <Col
          md={8}
          className="jb-empty-state text-center rounded my-4 py-4 px-4"
        >
          <h1 className="jb-empty-state-code">404</h1>
          <p>
            🙈 Ops... questa pagina sembra essersi persa tra un respiro e
            l’altro.
          </p>
          <p>
            Niente panico, torna a rilassarti{" "}
            {isLoggedIn ? "nella tua Dashboard" : "in home"}. 🌿
          </p>
          <Button
            onClick={handleRedirect}
            variant="success"
            className="mt-3"
            aria-label={isLoggedIn ? "Vai alla Dashboard" : "Torna alla Home"}
          >
            {isLoggedIn ? "Vai alla Dashboard" : "Torna alla Home"}
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound
