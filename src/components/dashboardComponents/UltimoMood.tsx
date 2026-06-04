import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import DashboardCard from "./DashboardCard"
import DashboardSkeleton from "./DashboardSkeleton"
import { apiFetch } from "../../utils/api"
import { getSessionToken } from "../../utils/session"

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
  const [isError, setIsError] = useState("")
  const [mood, setMood] = useState<Mood | null>(null)
  const token = getSessionToken()
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()

    const fetchMood = async () => {
      try {
        const res = await apiFetch("/moods?page=0&size=1&sortBy=dataCreazione", {
          auth: true,
          token,
          signal: controller.signal,
        })
        const data = await res.json()

        if (data.content && data.content.length > 0) {
          const ultimoMood = data.content[0]
          const resBrani = await apiFetch(`/brani/mood/${ultimoMood.id}`, {
            auth: true,
            token,
            signal: controller.signal,
          })
          const braniData = await resBrani.json()
          setMood({ ...ultimoMood, brani: braniData })
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setIsError("Qualcosa e andato storto nel caricamento dei mood.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchMood()

    return () => controller.abort()
  }, [token])

  if (loading) {
    return (
      <DashboardSkeleton
        title="Mood"
        iconClassName="bi bi-music-note-beamed"
        lines={4}
      />
    )
  }

  return (
    <DashboardCard
      title="Mood"
      iconClassName="bi bi-music-note-beamed"
      footer={
        <Button
          className="dashboard-cta dashboard-cta-soft"
          onClick={() => navigate("/mood")}
          aria-label="Esplora i tuoi mood"
        >
          Esplora i tuoi mood
        </Button>
      }
    >
      {isError ? (
        <div
          role="alert"
          className="alert alert-danger mb-0"
          aria-live="assertive"
        >
          {isError}
        </div>
      ) : mood ? (
        <>
          <p className="mb-2">
            Ultimo mood:{" "}
            <strong>
              {mood.tipoMood.charAt(0) + mood.tipoMood.slice(1).toLowerCase()}
            </strong>
          </p>
          <p className="mb-2">
            Salvato il:{" "}
            {new Date(mood.dataCreazione).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          {mood.brani.length > 0 ? (
            <ul className="dashboard-mood-list mb-0" aria-label="Lista dei brani associati all'ultimo mood">
              {mood.brani.slice(0, 6).map((brano) => (
                <li key={brano.id} className="dashboard-mood-item text-truncate">
                  <i className="bi bi-music-note-beamed" aria-hidden="true" />{" "}
                  {brano.titoloBrano}
                </li>
              ))}
              {mood.brani.length > 6 ? <li className="dashboard-mood-more">...</li> : null}
            </ul>
          ) : (
            <p className="mb-0">Nessun brano associato.</p>
          )}
        </>
      ) : (
        <p className="mb-0">
          Ascolta la musica che preferisci in base al tuo mood.
        </p>
      )}
    </DashboardCard>
  )
}

export default UltimoMood
