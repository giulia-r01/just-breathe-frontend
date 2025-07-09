import { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Spinner,
  Card,
  Button,
  Form,
} from "react-bootstrap"

interface Mood {
  id: number
  tipoMood: string
  dataCreazione: string
  brani: Brano[]
}

interface Brano {
  id: number
  titoloBrano: string
  link: string
}

const UltimoMood = function () {
  const [loading, setLoading] = useState(true)
  const [mood, setMood] = useState<Mood | null>(null)
  const [newBrano, setNewBrano] = useState("")
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchMood = async () => {
      try {
        const res = await fetch("http://localhost:8080/moods", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.content && data.content.length > 0) {
          const ultimoMood = data.content[0]
          const resBrani = await fetch(
            `http://localhost:8080/brani/mood/${ultimoMood.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          const braniData = await resBrani.json()
          setMood({ ...ultimoMood, brani: braniData })
        }
      } catch (error) {
        console.error("Errore nel caricamento del mood:", error)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchMood()
  }, [token])

  const handleAddBrano = async () => {
    if (!newBrano || !mood) return

    try {
      const res = await fetch(`http://localhost:8080/brani/${mood.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titoloBrano: newBrano }),
      })

      if (res.ok) {
        const branoAggiunto = await res.json()
        setMood((prev) =>
          prev ? { ...prev, brani: [...prev.brani, branoAggiunto] } : prev
        )
        setNewBrano("")
      }
    } catch (err) {
      console.error("Errore nell'aggiunta del brano:", err)
    }
  }

  const extractYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/v=([^&]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  return (
    <Container className="mynav text-white py-4 px-3 rounded my-5">
      <h2 className="text-center mb-4">Il tuo ultimo mood musicale</h2>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
        </div>
      ) : mood ? (
        <>
          <Row className="mb-4 text-center">
            <Col>
              <h4 className="text-uppercase">Mood: {mood.tipoMood}</h4>
              <p className="text-muted">
                Salvato il:{" "}
                {new Date(mood.dataCreazione).toLocaleDateString("it-IT", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={8} className="mx-auto">
              <Form className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Cerca una canzone (es. Imagine Dragons)"
                  value={newBrano}
                  onChange={(e) => setNewBrano(e.target.value)}
                  className="me-2"
                />
                <Button variant="success" onClick={handleAddBrano}>
                  Aggiungi
                </Button>
              </Form>
            </Col>
          </Row>

          <Row>
            {mood.brani.map((brano) => (
              <Col md={6} key={brano.id} className="mb-4">
                <Card className="text-dark">
                  <Card.Body>
                    <Card.Title>{brano.titoloBrano}</Card.Title>
                    {brano.link && extractYouTubeEmbedUrl(brano.link) ? (
                      <div className="ratio ratio-16x9">
                        <iframe
                          src={extractYouTubeEmbedUrl(brano.link) || undefined}
                          title={brano.titoloBrano}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <p>Nessun player disponibile</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <p>Non hai ancora salvato nessun mood.</p>
      )}
    </Container>
  )
}

export default UltimoMood
