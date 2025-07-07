import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const Home = function () {
  const navigate = useNavigate()

  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-center pt-5">
        <Col md={6} className="mynav rounded text-white py-3">
          <h1 className="mb-4">🌿 Benvenut* su Just Breathe</h1>
          <p className="mb-4">
            Organizza la mente, libera il respiro.
            <br /> Inizia il tuo viaggio verso il benessere digitale.
          </p>
          <Row className="justify-content-center">
            <Col xs={6} md={3}>
              <Button
                variant="success"
                className="w-100 mb-2"
                onClick={() => navigate("/login")}
              >
                Accedi
              </Button>
            </Col>
            <Col xs={6} md={3}>
              <Button
                variant="outline-success"
                className="w-100"
                onClick={() => navigate("/register")}
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
