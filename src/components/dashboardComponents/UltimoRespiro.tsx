import { useEffect, useState } from "react"
import { Card, Spinner, Alert, Button, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

interface Respiro {
  id: number
  nome: string
  descrizione: string
  inspiraSecondi: number
  trattieniSecondi: number
  espiraSecondi: number
  categoria: string
}

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

const UltimoRespiro = () => {
  const [respiro, setRespiro] = useState<Respiro | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:8080/respirazioni")
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero delle respirazioni")
        return res.json()
      })
      .then((data: Respiro[]) => {
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length)
          setRespiro(data[randomIndex])
        } else {
          setRespiro(null)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <div className="text-center py-3" role="status" aria-live="polite">
        <Spinner animation="border" variant="success" />
        <span className="visually-hidden">Caricamento...</span>
      </div>
    )

  if (error)
    return (
      <Alert variant="danger" role="alert">
        {error}
      </Alert>
    )

  if (!respiro) {
    return (
      <Card className="mynav text-white">
        <Card.Body>
          <Card.Title as="h4">Respirazioni guidate</Card.Title>
          <Card.Text>
            Non hai ancora salvato esercizi di respirazione.
          </Card.Text>
          <Button
            variant="success"
            onClick={() => navigate("/respirazioni")}
            aria-label="Vai agli esercizi di respirazione - Vai alla sezione Respirazioni"
          >
            Vai agli esercizi di respirazione
          </Button>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="mynav text-white">
      <Card.Body>
        <Card.Title as="h4">Respirazioni guidate</Card.Title>
        <Card.Text>
          <Badge
            aria-label={`Categoria: ${respiro.categoria}`}
            className={`mb-2 text-uppercase fs-6 ${getColorClass(
              respiro.categoria
            )}`}
          >
            {respiro.categoria}
          </Badge>
          <br />
          {respiro.descrizione}
        </Card.Text>
        <Button
          variant="success"
          onClick={() => navigate("/respirazioni")}
          aria-label="Vai agli esercizi di respirazione - Vai alla sezione Respirazioni"
        >
          Vai agli esercizi di respirazione
        </Button>
      </Card.Body>
    </Card>
  )
}

export default UltimoRespiro
