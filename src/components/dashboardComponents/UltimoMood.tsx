import { useEffect, useState } from "react"
import { Spinner, Button, ListGroup, Card } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

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

const UltimoMood = () => {
  const [loading, setLoading] = useState(true)
  const [mood, setMood] = useState<Mood | null>(null)
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

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

  return (
    <Card className="mynav text-white">
      <Card.Body>
        <Card.Title as="h4">Mood</Card.Title>

        {loading ? (
          <div className="text-center py-3" role="status" aria-live="polite">
            <Spinner animation="border" variant="success" />
            <span className="visually-hidden">Caricamento...</span>
          </div>
        ) : mood ? (
          <>
            <Card.Text className="mb-2">
              Ultimo mood:{" "}
              <strong>
                {mood.tipoMood.charAt(0) + mood.tipoMood.slice(1).toLowerCase()}
              </strong>
              <br />
              Salvato il:{" "}
              {new Date(mood.dataCreazione).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Card.Text>

            {mood.brani.length > 0 ? (
              <ListGroup
                variant="flush"
                className="mb-3 rounded"
                aria-label="Lista dei brani associati all'ultimo mood"
              >
                {mood.brani.map((brano) => (
                  <ListGroup.Item key={brano.id} className="text-dark py-1">
                    🎵 {brano.titoloBrano}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <Card.Text className="fst-italic">
                Nessun brano associato.
              </Card.Text>
            )}

            <Button
              variant="success"
              onClick={() => navigate("/mood")}
              aria-label="Vai ai mood - Crea le tue playlist in base al mood"
            >
              Vai ai mood
            </Button>
          </>
        ) : (
          <>
            <Card.Text>
              Ascolta la musica che preferisci in base al tuo mood e crea la tua
              playlist!
            </Card.Text>
            <Button
              variant="success"
              onClick={() => navigate("/mood")}
              aria-label="Crea il tuo mood - Vai alla sezione mood"
            >
              Crea il tuo mood
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default UltimoMood
