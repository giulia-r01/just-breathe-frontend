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
  showStars?: boolean // mostra stelline per toggle preferiti
  onToggleSalvataggio?: (evento: Evento) => void // callback per toggle
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
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEventi = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/eventi/utente?page=0&size=5&sortBy=dataEvento",
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
    <Card className="h-100 mynav text-white">
      <Card.Body>
        {showTitle && (
          <Card.Title>Scopri gli eventi disponibili nella tua città</Card.Title>
        )}
        <Card.Subtitle className="fs-5 pb-4 pt-2">
          Ultimi eventi salvati:
        </Card.Subtitle>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="light" />
          </div>
        ) : (
          <>
            {eventi.length === 0 ? (
              <Card.Text>Non hai ancora salvato eventi.</Card.Text>
            ) : (
              eventi.map((evento) => (
                <div
                  key={evento.id}
                  className="mb-2 d-flex justify-content-between align-items-center"
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
                    >
                      <FaTrashAlt />
                    </Button>
                  )}
                </div>
              ))
            )}
            <hr />
            {showButton && (
              <div className="text-end mt-3">
                <Button variant="success" onClick={() => navigate("/eventi")}>
                  Cerca eventi nella tua città
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default UltimiEventiSalvati
