import { useEffect, useState, useRef } from "react"
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Modal,
} from "react-bootstrap"
import CircleAnimation from "../animations/CircleAnimation"
import "../animations/CircleAnimation.css"

interface Respiri {
  id: number
  nome: string
  descrizione: string
  inspiraSecondi: number
  trattieniSecondi: number
  espiraSecondi: number
  dataCreazione: string
  categoria: "RELAX" | "FOCUS" | "ENERGIA"
}

const Respiri = () => {
  const [respiri, setRespiri] = useState<Respiri[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [respiroSelezionato, setRespiroSelezionato] = useState<Respiri | null>(
    null
  )
  const [fase, setFase] = useState<
    "fermo" | "inspira" | "trattieni" | "espira"
  >("fermo")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch("http://localhost:8080/respirazioni")
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero delle respirazioni")
        return res.json()
      })
      .then((data) => setRespiri(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const apriModale = (respiro: Respiri) => {
    setRespiroSelezionato(respiro)
    setShowModal(true)
    setFase("fermo")
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const chiudiModale = () => {
    setShowModal(false)
    setRespiroSelezionato(null)
    setFase("fermo")
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const startRespirazione = () => {
    if (!respiroSelezionato) return
    setFase("inspira")
  }

  const stopRespirazione = () => {
    setFase("fermo")
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  // Cambio automatico fase in base alla durata senza mostrare secondi
  useEffect(() => {
    if (!respiroSelezionato || fase === "fermo") {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    let durata = 0
    if (fase === "inspira") durata = respiroSelezionato.inspiraSecondi
    else if (fase === "trattieni") durata = respiroSelezionato.trattieniSecondi
    else if (fase === "espira") durata = respiroSelezionato.espiraSecondi

    timerRef.current = setTimeout(() => {
      if (fase === "inspira") setFase("trattieni")
      else if (fase === "trattieni") setFase("espira")
      else if (fase === "espira") setFase("inspira")
    }, durata * 1000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [fase, respiroSelezionato])

  // Colori per categoria
  const getColorClass = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case "relax":
        return "bg-relax"
      case "focus":
        return "bg-focus"
      case "energia":
        return "bg-energia"
      default:
        return ""
    }
  }

  // Testo accessibile in base a categoria (sr-only)
  const getSrText = () => {
    if (!respiroSelezionato) return ""
    switch (respiroSelezionato.categoria.toLowerCase()) {
      case "relax":
        return "Respirazione rilassante: inspira per 4 secondi, trattieni per 7 secondi, espira per 8 secondi."
      case "focus":
        return "Respirazione per concentrazione: inspira per 4 secondi, trattieni per 4 secondi, espira per 4 secondi."
      case "energia":
        return "Respirazione energizzante: inspira per 6 secondi, trattieni per 2 secondi, espira per 4 secondi."
      default:
        return `Inspira per ${respiroSelezionato.inspiraSecondi} secondi, trattieni per ${respiroSelezionato.trattieniSecondi} secondi, espira per ${respiroSelezionato.espiraSecondi} secondi.`
    }
  }

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4 text-white mynav rounded py-3">
        Esercizi di Respirazione Guidata
      </h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {respiri.map((respiro) => (
          <Col md={6} lg={4} key={respiro.id}>
            <Card className="mynav text-white h-100">
              <Card.Body>
                <Card.Title className="fs-2">{respiro.nome}</Card.Title>
                <Badge
                  className={`mb-2 fs-6 text-uppercase ${getColorClass(
                    respiro.categoria
                  )}`}
                >
                  {respiro.categoria}
                </Badge>
                <Card.Text className="fs-5">{respiro.descrizione}</Card.Text>
                <Button
                  className="fs-5"
                  variant="success"
                  onClick={() => apriModale(respiro)}
                >
                  Avvia respirazione
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={chiudiModale} size="lg" centered>
        <Modal.Header
          closeButton
          className={
            respiroSelezionato
              ? getColorClass(respiroSelezionato.categoria)
              : ""
          }
        >
          <Modal.Title>
            {respiroSelezionato?.nome} –{" "}
            <span className="text-capitalize">
              {fase !== "fermo" ? fase : "Pronto"}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-5 mt-4 text-center">
          {respiroSelezionato && (
            <>
              <span className="visually-hidden">{getSrText()}</span>
              <div className="mb-4" aria-hidden="true">
                <CircleAnimation
                  fase={fase}
                  className={getColorClass(respiroSelezionato.categoria)}
                  durataInspira={respiroSelezionato.inspiraSecondi}
                  durataTrattieni={respiroSelezionato.trattieniSecondi}
                  durataEspira={respiroSelezionato.espiraSecondi}
                />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {fase === "fermo" ? (
            <Button
              variant="primary"
              onClick={startRespirazione}
              className={
                respiroSelezionato
                  ? getColorClass(respiroSelezionato.categoria)
                  : ""
              }
            >
              Inizia
            </Button>
          ) : (
            <Button
              variant="danger"
              onClick={stopRespirazione}
              className={
                respiroSelezionato
                  ? getColorClass(respiroSelezionato.categoria)
                  : ""
              }
            >
              Ferma
            </Button>
          )}
          <Button variant="secondary" onClick={chiudiModale}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Respiri
