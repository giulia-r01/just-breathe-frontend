import { useEffect, useState } from "react"
import { Alert, Button, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import DashboardCard from "./DashboardCard"
import DashboardSkeleton from "./DashboardSkeleton"

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
    const controller = new AbortController()

    fetch(`${import.meta.env.VITE_API_URL}/respirazioni`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero delle respirazioni.")
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
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <DashboardSkeleton
        title="Respirazioni guidate"
        iconClassName="bi bi-wind"
        lines={4}
      />
    )
  }

  if (error) {
    return (
      <Alert variant="danger" role="alert">
        {error}
      </Alert>
    )
  }

  return (
    <DashboardCard
      title="Respirazioni guidate"
      iconClassName="bi bi-wind"
      footer={
        <Button
          className="dashboard-cta"
          onClick={() => navigate("/respirazioni")}
          aria-label="Vai agli esercizi di respirazione"
        >
          Inizia una sessione
        </Button>
      }
    >
      {respiro ? (
        <>
          <Badge
            aria-label={`Categoria: ${respiro.categoria}`}
            className={`mb-2 text-uppercase ${getColorClass(respiro.categoria)}`}
          >
            {respiro.categoria}
          </Badge>
          <p className="mb-0">{respiro.descrizione}</p>
        </>
      ) : (
        <p className="mb-0">Non hai ancora salvato esercizi di respirazione.</p>
      )}
    </DashboardCard>
  )
}

export default UltimoRespiro
