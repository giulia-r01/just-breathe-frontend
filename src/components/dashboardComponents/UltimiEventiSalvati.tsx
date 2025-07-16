import { useEffect, useState } from "react"
import { Card, Spinner, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { FaTrashAlt } from "react-icons/fa"

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
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken && storedToken !== "null") {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    const fetchEventi = async () => {
      try {
        console.log("TOKEN:", token)
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/eventi/utente?page=0&size=5&sortBy=dataEvento`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (res.ok) {
          const data = await res.json()
          setEventi(data.content || [])
        }
      } catch (err) {
        console.error("Errore nel recupero eventi salvati:", err)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchEventi()
  }, [token, reloadFlag])

  return (
    <Card className="mynav text-white">
      <Card.Body>
        {showTitle && (
          <Card.Title as="h4">
            Scopri gli eventi disponibili nella tua città
          </Card.Title>
        )}
        <Card.Subtitle className="fs-5 pb-4 pt-2">
          Ultimi eventi salvati:
        </Card.Subtitle>

        {loading || token === null ? (
          <div className="text-center py-4" role="status" aria-live="polite">
            <Spinner animation="border" variant="light" />
            <span className="visually-hidden">Caricamento...</span>
          </div>
        ) : (
          <div aria-live="polite" role="list">
            {eventi.length === 0 ? (
              <Card.Text>Non hai ancora salvato eventi.</Card.Text>
            ) : (
              eventi.map((evento, index) => (
                <div key={evento.id}>
                  <div
                    role="listitem"
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <div>
                      <strong>{evento.nome}</strong>
                      {evento.luogo && (
                        <div className="text-white fst-italic">
                          Luogo: {evento.luogo}
                        </div>
                      )}
                      {evento.dataEvento && (
                        <div className="text-white">
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

                    {showStars && onToggleSalvataggio && (
                      <Button
                        variant="link"
                        className="p-0 border-0 text-danger fs-5"
                        title="Rimuovi dai preferiti"
                        onClick={() => onToggleSalvataggio(evento)}
                        aria-label="Rimuovi l'evento dai preferiti"
                      >
                        <FaTrashAlt />
                      </Button>
                    )}
                  </div>

                  {index < eventi.length - 1 && (
                    <hr className="text-white my-2" />
                  )}
                </div>
              ))
            )}

            {showButton && (
              <div className="text-end mt-3">
                <Button
                  variant="success"
                  onClick={() => navigate("/eventi")}
                  aria-label="Cerca eventi nella tua città - Vai alla sezione eventi"
                >
                  Cerca eventi nella tua città
                </Button>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default UltimiEventiSalvati
