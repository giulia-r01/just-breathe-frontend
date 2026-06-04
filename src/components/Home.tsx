import { useEffect } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { getSessionToken } from "../utils/session"
import PageHero from "./common/PageHero"

const Home = function () {
  const token = getSessionToken()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate("/index")
    }
  }, [token, navigate])

  return (
    <Container className="jb-home-shell mt-4" role="main">
      <div className="jb-home-hero-wrap">
        <PageHero
          iconClassName="bi bi-flower1"
          title="Benvenut* su Just Breathe"
          subtitle="Uno spazio digitale per rallentare, organizzarti e ritrovare il tuo ritmo."
        />
      </div>
      <Row className="justify-content-center py-3 mt-5 px-3 px-lg-5">
        <Col
          md={8}
          lg={7}
          className="jb-surface jb-welcome-box jb-home-panel rounded py-4 px-4 text-center"
        >
          <p className="mb-4">
            Rilassati e libera i tuoi pensieri con respirazioni guidate, diario
            personale, gestione del tempo, playlist in base al mood ed eventi
            nelle principali citta italiane.
          </p>
          <p>
            Organizza la mente, libera il respiro.
            <br /> Inizia il tuo viaggio verso il benessere digitale.
          </p>
          <Row className="justify-content-center jb-home-actions">
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
