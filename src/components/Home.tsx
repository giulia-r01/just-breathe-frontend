import { useEffect } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const Home = function () {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate("/index")
    }
  }, [token, navigate])

  return (
    <Container className="text-center mt-5" role="main">
      <Row className="justify-content-center py-5 px-5">
        <Col md={6} className="jb-surface jb-welcome-box rounded py-3">
          <h1 className="mb-4 jb-welcome-title">Benvenut* su Just Breathe</h1>
          <p className="mb-4">
            Rilassati e libera i tuoi pensieri con respirazioni guidate, diario
            personale, gestione del tempo, playlist in base al mood ed eventi
            nelle principali citta italiane.
          </p>
          <p>
            Organizza la mente, libera il respiro.
            <br /> Inizia il tuo viaggio verso il benessere digitale.
          </p>
          <Row className="justify-content-center">
            <Col xs={6} md={6}>
              <Button
                variant="success"
                className="w-100 mb-2"
                onClick={() => navigate("/login")}
                aria-label="Accedi - clicca per accedere al login"
              >
                Accedi
              </Button>
            </Col>
            <Col xs={6} md={6}>
              <Button
                variant="success"
                className="w-100"
                onClick={() => navigate("/register")}
                aria-label="Registrati - clicca per accedere alla registrazione"
              >
                Registrati
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
