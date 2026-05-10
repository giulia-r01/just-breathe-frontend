import { useEffect, useRef, useState } from "react"
import { Alert, Badge, Card, Col, Container, Modal, Row } from "react-bootstrap"
import CircleAnimation from "../animations/CircleAnimation"
import "../animations/CircleAnimation.css"
import JBButton from "./common/JBButton"
import JBCard from "./common/JBCard"
import LoadingSkeleton from "./common/LoadingSkeleton"

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
  const [respiroSelezionato, setRespiroSelezionato] = useState<Respiri | null>(null)
  const [fase, setFase] = useState<"fermo" | "inspira" | "trattieni" | "espira">("fermo")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/respirazioni`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel recupero delle respirazioni 😥. Rilassati e riprova o contatta l'assistenza 🌿")
        }
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

  const getSrText = (respiro: Respiri) => {
    const { categoria, inspiraSecondi, trattieniSecondi, espiraSecondi, nome } = respiro
    return `Respirazione "${nome}", categoria ${categoria.toLowerCase()}. Inspira per ${inspiraSecondi} secondi, trattieni per ${trattieniSecondi} secondi, espira per ${espiraSecondi} secondi.`
  }

  return (
    <Container className="jb-breath-page my-4" role="region" aria-labelledby="respiri-heading">
      <h1 id="respiri-heading" className="visually-hidden">Respirazioni guidate</h1>

      <div className="jb-page-hero mt-3 mb-4">
        <div className="jb-page-hero-icon" aria-hidden="true">
          <i className="bi bi-wind" />
        </div>
        <div>
          <h2 className="jb-page-hero-title mb-1">Esercizi di Respirazione Guidata</h2>
          <p className="jb-page-hero-subtitle mb-0">Scegli la pratica che fa per te</p>
        </div>
      </div>

      <section className="jb-breath-info-box mb-4" aria-label="Perche praticare la respirazione guidata">
        <div className="d-flex align-items-start gap-3">
          <div className="jb-breath-info-icon" aria-hidden="true">
            <i className="bi bi-wind" />
          </div>
          <div>
            <h3 className="jb-breath-info-title mb-2">Perche praticare la respirazione guidata?</h3>
            <p className="jb-breath-info-text mb-0">
              La respirazione consapevole riduce lo stress, migliora la concentrazione e aumenta il benessere generale.
              Anche solo 5 minuti al giorno possono fare la differenza nel tuo equilibrio emotivo e mentale.
            </p>
          </div>
        </div>
      </section>

      {loading && <LoadingSkeleton className="my-4" lines={4} />}
      {error && <Alert variant="danger" role="alert">{error}</Alert>}

      <Row className="g-4 py-4">
        {respiri.map((respiro) => (
          <Col md={6} lg={4} key={respiro.id}>
            <JBCard variantStyle="surface" className={`${getColorClass(respiro.categoria)} jb-breath-card h-100`}>
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <div className={`jb-breath-card-icon ${getColorClass(respiro.categoria)}`} aria-hidden="true">
                    <i className={respiro.categoria === "ENERGIA" ? "bi bi-lightning-charge" : respiro.categoria === "FOCUS" ? "bi bi-bullseye" : "bi bi-heart"} />
                  </div>
                  <Badge className={`jb-breath-badge text-uppercase ${getColorClass(respiro.categoria)}`}>{respiro.categoria}</Badge>
                </div>
                <Card.Title className="jb-breath-card-title">{respiro.nome}</Card.Title>
                <Badge className={`jb-breath-time-badge mb-3 ${getColorClass(respiro.categoria)}`}>
                  {respiro.inspiraSecondi}s / {respiro.trattieniSecondi}s / {respiro.espiraSecondi}s
                </Badge>
                <Card.Text className="jb-breath-card-text flex-grow-1">{respiro.descrizione}</Card.Text>
                <JBButton
                  variantStyle="pill"
                  className={`jb-breath-start-btn ${getColorClass(respiro.categoria)}`}
                  onClick={() => apriModale(respiro)}
                  aria-label={`Avvia respirazione guidata: ${getSrText(respiro)}`}
                >
                  Inizia Respirazione
                </JBButton>
              </Card.Body>
            </JBCard>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={chiudiModale} size="lg" centered aria-labelledby="titolo-respiro" aria-describedby="istruzioni-respiro">
        <Modal.Header closeButton className={`jb-breath-modal-header ${respiroSelezionato ? getColorClass(respiroSelezionato.categoria) : ""}`}>
          <Modal.Title id="titolo-respiro">
            {respiroSelezionato?.nome} - <span className="text-capitalize">{fase !== "fermo" ? fase : "Pronto"}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="jb-breath-modal-body py-5 text-center">
          {respiroSelezionato && (
            <>
              <span id="istruzioni-respiro" className="visually-hidden">{getSrText(respiroSelezionato)}</span>
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
            <JBButton variantStyle="pill" onClick={startRespirazione} className={`jb-breath-modal-action ${respiroSelezionato ? getColorClass(respiroSelezionato.categoria) : ""}`}>
              Inizia
            </JBButton>
          ) : (
            <JBButton variantStyle="pill" onClick={stopRespirazione} className={`jb-breath-modal-action ${respiroSelezionato ? getColorClass(respiroSelezionato.categoria) : ""}`}>
              Ferma
            </JBButton>
          )}
          <JBButton variantStyle="ghost" onClick={chiudiModale}>Chiudi</JBButton>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Respiri
