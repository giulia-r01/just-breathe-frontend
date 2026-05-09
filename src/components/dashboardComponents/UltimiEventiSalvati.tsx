import { useEffect, useState } from "react"
import { Alert, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { FaTrashAlt } from "react-icons/fa"
import DashboardCard from "./DashboardCard"
import DashboardSkeleton from "./DashboardSkeleton"

interface Evento {
  id: number
  nome: string
  luogo?: string
  dataEvento?: string
}

interface UltimiEventiSalvatiProps {
  showButton?: boolean
  showTitle?: boolean
  reloadFlag?: number
  showStars?: boolean
  onToggleSalvataggio?: (evento: Evento) => void
}

const UltimiEventiSalvati = ({
  showButton = true,
  showTitle = true,
  reloadFlag,
  showStars = false,
  onToggleSalvataggio,
}: UltimiEventiSalvatiProps) => {
  const [eventi, setEventi] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token || token === "null") {
      setLoading(false)
      return
    }

    const controller = new AbortController()

    const fetchEventi = async () => {
      setLoading(true)
      setIsError("")
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/eventi/utente?page=0&size=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        )
        if (!res.ok) throw new Error("Errore nel recupero degli eventi")
        const data = await res.json()
        setEventi(data.content || [])
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setIsError(
            "Qualcosa e andato storto nel recupero degli eventi salvati.",
          )
        }
      } finally {
        setLoading(false)
      }
    }

    fetchEventi()

    return () => controller.abort()
  }, [reloadFlag])

  if (loading) {
    return (
      <DashboardSkeleton
        title="Scopri gli eventi disponibili nella tua citta"
        iconClassName="bi bi-geo-alt"
        lines={5}
      />
    )
  }

  return (
    <DashboardCard
      title={
        showTitle ? "Scopri gli eventi disponibili nella tua citta" : "Eventi"
      }
      iconClassName="bi bi-geo-alt"
      subtitle="Ultimi eventi salvati"
      footer={
        showButton ? (
          <Button
            className="dashboard-cta dashboard-cta-outline"
            onClick={() => navigate("/eventi")}
            aria-label="Esplora altri eventi"
          >
            Esplora altri eventi
          </Button>
        ) : null
      }
    >
      {isError ? (
        <Alert variant="danger" role="alert" className="mb-0">
          {isError}
        </Alert>
      ) : eventi.length === 0 ? (
        <p className="mb-0">Non hai ancora salvato eventi.</p>
      ) : (
        eventi.map((evento) => (
          <article key={evento.id} className="dashboard-event-item mb-2">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div className="flex-grow-1">
                <p className="dashboard-event-title mb-2">{evento.nome}</p>
                {evento.luogo ? <p className="mb-2">{evento.luogo}</p> : null}
                {evento.dataEvento ? (
                  <p className="dashboard-event-date mb-0">
                    {new Date(evento.dataEvento).toLocaleString("it-IT", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                ) : null}
              </div>

              {showStars && onToggleSalvataggio ? (
                <Button
                  variant="link"
                  className="p-0 border-0 text-danger fs-5 mt-1"
                  title="Rimuovi dai preferiti"
                  onClick={() => onToggleSalvataggio(evento)}
                  aria-label="Rimuovi l'evento dai preferiti"
                >
                  <FaTrashAlt />
                </Button>
              ) : null}
            </div>
          </article>
        ))
      )}
    </DashboardCard>
  )
}

export default UltimiEventiSalvati
