import { useEffect, useState } from "react"
import { Alert, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import DashboardCard from "./DashboardCard"
import DashboardSkeleton from "./DashboardSkeleton"
import { apiFetch } from "../../utils/api"
import { getSessionToken } from "../../utils/session"

interface Diario {
  id: number
  titolo: string
  contenuto: string
  dataInserimento: string
  dataUltimaModifica: string
}

interface DashboardResponse {
  diario: Diario | null
  messaggioDiario: string
}

const UltimoDiario = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const token = getSessionToken()
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()

    const fetchDashboard = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await apiFetch("/dashboard", {
          auth: true,
          token,
          signal: controller.signal,
        })
        if (!res.ok) throw new Error("Errore nel caricamento della dashboard")
        const data: DashboardResponse = await res.json()
        setDashboardData(data)
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Impossibile caricare l'ultimo diario")
        }
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchDashboard()

    return () => controller.abort()
  }, [token])

  if (loading) return <DashboardSkeleton title="Diario" iconClassName="bi bi-book" lines={4} />

  if (error) {
    return (
      <Alert variant="danger" role="alert">
        {error}
      </Alert>
    )
  }

  if (!dashboardData) return null

  return (
    <DashboardCard
      title="Diario"
      iconClassName="bi bi-book"
      subtitle={
        dashboardData.diario
          ? dashboardData.diario.dataUltimaModifica !== dashboardData.diario.dataInserimento
            ? `Ultima modifica: ${new Date(dashboardData.diario.dataUltimaModifica).toLocaleString("it-IT")}`
            : `Creato il: ${new Date(dashboardData.diario.dataInserimento).toLocaleString("it-IT")}`
          : undefined
      }
      footer={
        <Button
          className="dashboard-cta dashboard-cta-soft"
          onClick={() => navigate("/diario")}
          aria-label="Scrivi qualcosa"
        >
          Scrivi qualcosa
        </Button>
      }
    >
      {dashboardData.diario ? (
        <>
          <p className="fw-semibold mb-2">{dashboardData.diario.titolo}</p>
          <p className="mb-0">
            {dashboardData.diario.contenuto.length > 150
              ? `${dashboardData.diario.contenuto.substring(0, 150)}...`
              : dashboardData.diario.contenuto}
          </p>
        </>
      ) : (
        <p className="mb-0">{dashboardData.messaggioDiario}</p>
      )}
    </DashboardCard>
  )
}

export default UltimoDiario
