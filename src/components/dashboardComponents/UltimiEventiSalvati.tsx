/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Card, Spinner, Button, Pagination } from "react-bootstrap"
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
  const [isError, setIsError] = useState("")
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken && storedToken !== "null") {
      setToken(storedToken)
    }
  }, [])

  const fetchEventi = async (page: number) => {
    setLoading(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/eventi/utente?page=${page}&size=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        setEventi(data.content || [])
        setTotalPages(data.totalPages ?? 1)
        setCurrentPage(page)
      }
    } catch (err) {
      console.error(
        "Qualcosa è andato storto nel recupero eventi salvati: ",
        err
      )
      setIsError(
        "Qualcosa è andato storto nel recupero degli eventi salvati 😥. Rilassati, riprova o contatta l'assistenza 🌿"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchEventi(0)
  }, [token, reloadFlag])

  const handlePageChange = (page: number) => {
    fetchEventi(page)
  }

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

        {isError && (
          <div
            role="alert"
            className="alert alert-danger"
            aria-live="assertive"
          >
            {isError}
          </div>
        )}

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
            {totalPages > 1 && (
              <Pagination className="justify-content-center mt-4 my-pagination2">
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                    aria-label={`Pagina ${i + 1}`}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            )}

            {showButton && (
              <div className="text-start mt-3">
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
