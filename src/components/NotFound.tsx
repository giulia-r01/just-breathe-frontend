import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const NotFound = function () {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const handleRedirect = () => {
    navigate(isLoggedIn ? "/index" : "/")
  }

  return (
    <Container role="main">
      <Row className="justify-content-center  mx-1">
        <Col md={8} className="mynav text-white text-center rounded my-5 py-4">
          <h1>404</h1>
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
