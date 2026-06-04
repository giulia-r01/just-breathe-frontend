/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Form, Button, ListGroup, Container, Row, Col } from "react-bootstrap"
import { FaRegStar, FaStar } from "react-icons/fa"
import UltimiEventiSalvati from "./dashboardComponents/UltimiEventiSalvati"
import LoadingSkeleton from "./common/LoadingSkeleton"
import { apiFetch } from "../utils/api"
import { getSessionToken } from "../utils/session"

interface EventoDto {
  id?: number
  nome: string
  luogo?: string
  dataEvento?: string
  immagine?: string
  linkEsterno?: string
}

const Eventi = () => {
  const [citta, setCitta] = useState("")
  const [eventi, setEventi] = useState<EventoDto[]>([])
  const [salvati, setSalvati] = useState<EventoDto[]>([])
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const [reloadFlag, setReloadFlag] = useState(0)

  const token = getSessionToken()

  useEffect(() => {
    if (token) fetchSalvati()
  }, [token])

  const fetchSalvati = async () => {
    try {
      const res = await apiFetch("/eventi/utente", { auth: true, token })
      if (res.ok) {
        const data = await res.json()
        setSalvati(data.content || [])
      }
    } catch (err) {
      console.error("Errore nel recupero eventi salvati:", err)
      setIsError(
        "Qualcosa è andato storto nel recupero degli eventi salvati 😥. Rilassati, riprova o contatta l'assistenza 🌿",
      )
    }
  }

  const handleSearch = async () => {
    if (!citta.trim()) return
    setLoading(true)
    try {
      const res = await apiFetch(
        `/eventi/esterni?citta=${encodeURIComponent(citta)}`,
        {
          auth: true,
          token,
        },
      )
      const data = await res.json()
      setEventi(data)
    } catch (err) {
      console.error("Errore nella ricerca eventi:", err)
      setIsError(
        "Qualcosa è andato storto nella ricerca degli eventi 😥. Rilassati, riprova o contatta l'assistenza 🌿",
      )
    } finally {
      setLoading(false)
    }
  }

  const trovaEventoSalvato = (evento: EventoDto) => {
    return salvati.find(
      (e) =>
        e.nome === evento.nome &&
        e.luogo === evento.luogo &&
        e.dataEvento === evento.dataEvento,
    )
  }

  const handleToggleSalvataggio = async (evento: EventoDto) => {
    const eventoSalvato = trovaEventoSalvato(evento)

    if (eventoSalvato && eventoSalvato.id) {
      try {
        const res = await apiFetch(`/eventi/${eventoSalvato.id}`, {
          method: "DELETE",
          auth: true,
          token,
        })
        if (res.ok) {
          setSalvati((prev) => prev.filter((e) => e.id !== eventoSalvato.id))
          setReloadFlag((f) => f + 1)
        }
      } catch (err) {
        console.error("Errore nella rimozione evento:", err)
        setIsError(
          "Qualcosa è andato storto nella rimozione dell'evento salvato 😥. Rilassati, riprova o contatta l'assistenza 🌿",
        )
      }
    } else {
      try {
        const res = await apiFetch("/eventi", {
          method: "POST",
          auth: true,
          token,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(evento),
        })
        if (res.ok) {
          fetchSalvati()
          setReloadFlag((f) => f + 1)
        }
      } catch (err) {
        console.error("Errore nel salvataggio evento:", err)
        setIsError(
          "Qualcosa è andato storto nel salvataggio dell'evento 😥. Rilassati, riprova o contatta l'assistenza 🌿",
        )
      }
    }
  }

  return (
    <Container role="main">
      <Row className="align-items-start py-4 g-2">
        <h1 className="visually-hidden">Eventi</h1>
        <div className="jb-page-hero mt-3 mb-4">
          <div className="jb-page-hero-icon" aria-hidden="true">
            <i className="bi bi-calendar-event" />
          </div>
          <div>
            <h2 className="jb-page-hero-title mb-1">Eventi in città</h2>
            <p className="jb-page-hero-subtitle mb-0">
              Scopri gli eventi disponibili vicino a te
            </p>
          </div>
        </div>
        <Col md={5} lg={6}>
          <Form.Group controlId="inputCitta" className="d-flex mb-3">
            <Form.Label className="visually-hidden">
              Cerca eventi nella tua città, digita il nome della città
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Digita il nome della città"
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
              className="me-2"
            />
            <Button
              variant="success"
              onClick={handleSearch}
              aria-label="Cerca - clicca per trovare gli eventi nella città che preferisci"
            >
              Cerca
            </Button>
          </Form.Group>

          {isError && (
            <div
              role="alert"
              className="alert alert-danger"
              aria-live="assertive"
            >
              {isError}
            </div>
          )}

          {loading ? (
            <LoadingSkeleton className="my-4" lines={4} />
          ) : eventi.length === 1 && !eventi[0].id ? (
            <label className="jb-surface rounded p-2 fw-bold d-block">
              {eventi[0].nome}
            </label>
          ) : (
            <ListGroup className="gap-2">
              {eventi.map((evento, i) => {
                const isSalvato = !!trovaEventoSalvato(evento)
                return (
                  <ListGroup.Item
                    key={i}
                    className="jb-surface d-flex justify-content-between align-items-start border-0 rounded"
                  >
                    <div>
                      <div className="fw-bold">{evento.nome}</div>
                      {evento.luogo && <div>{evento.luogo}</div>}
                      {evento.dataEvento && (
                        <div>
                          {new Date(evento.dataEvento).toLocaleString("it-IT", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      aria-pressed={isSalvato}
                      aria-label={
                        isSalvato
                          ? "Rimuovi evento dai preferiti"
                          : "Aggiungi evento ai preferiti"
                      }
                      variant="link"
                      className={`fs-4 ${
                        isSalvato ? "text-success" : "text-secondary"
                      }`}
                      onClick={() => handleToggleSalvataggio(evento)}
                    >
                      {isSalvato ? <FaStar /> : <FaRegStar />}
                    </Button>
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          )}
        </Col>
        <Col md={7} lg={6}>
          <UltimiEventiSalvati
            showButton={false}
            showTitle={false}
            reloadFlag={reloadFlag}
            showStars={true}
            onToggleSalvataggio={handleToggleSalvataggio}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Eventi
