import { useEffect, useState } from "react"
import { Card, Spinner, Alert, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

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
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok)
          throw new Error(
            "Errore nel caricamento della dashboard 😥. Rilassati, riprova o contatta l'assistenza 🌿"
          )
        const data: DashboardResponse = await res.json()
        setDashboardData(data)
      } catch (err) {
        console.error(err)
        setError("Impossibile caricare l'ultimo diario 😥")
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchDashboard()
  }, [token])

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
  if (!dashboardData) return null

  return (
    <Card className="mynav text-white p-3">
      <Card.Title as="h4">Diario</Card.Title>

      {dashboardData.diario ? (
        <>
          <Card.Subtitle className="mb-2 text-white">
            {dashboardData.diario.dataUltimaModifica !==
            dashboardData.diario.dataInserimento
              ? `Ultima modifica: ${new Date(
                  dashboardData.diario.dataUltimaModifica
                ).toLocaleString()}`
              : `Creato il: ${new Date(
                  dashboardData.diario.dataInserimento
                ).toLocaleString()}`}
          </Card.Subtitle>

          <h5>{dashboardData.diario.titolo}</h5>

          <Card.Text>
            {dashboardData.diario.contenuto.length > 150
              ? dashboardData.diario.contenuto.substring(0, 150) + "..."
              : dashboardData.diario.contenuto}
          </Card.Text>
        </>
      ) : (
        <Card.Text>{dashboardData.messaggioDiario}</Card.Text>
      )}

      <div className="d-flex justify-content-start mt-3">
        <Button
          variant="success"
          onClick={() => navigate("/diario")}
          aria-label="Scrivi qualcosa - Vai alla sezione Diario"
        >
          Scrivi qualcosa
        </Button>
      </div>
    </Card>
  )
}

export default UltimoDiario
