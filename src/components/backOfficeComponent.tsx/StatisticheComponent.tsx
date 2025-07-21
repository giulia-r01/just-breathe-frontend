import { useEffect, useState } from "react"
import {
  Card,
  Spinner,
  Col,
  Table,
  Row,
  Alert,
  Pagination,
} from "react-bootstrap"
import { ListGroup } from "react-bootstrap"

interface Props {
  token: string
}

interface DettaglioUtente {
  id: number
  username: string
  diari: number
  tasks: number
  eventi: number
  moods: number
}

const StatisticheComponent = ({ token }: Props) => {
  const [media, setMedia] = useState<number | null>(null)
  const [moodStats, setMoodStats] = useState<Record<string, number>>({})
  const [dettagliUtenti, setDettagliUtenti] = useState<DettaglioUtente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resMedia, resMood, resDettagli] = await Promise.all([
          fetch(
            `${
              import.meta.env.VITE_API_URL
            }/backoffice/statistiche/media-attivita-utente`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(`${import.meta.env.VITE_API_URL}/backoffice/mood-statistiche`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `${
              import.meta.env.VITE_API_URL
            }/backoffice/statistiche/attivita-utenti?page=${currentPage}&size=${pageSize}&sort=username`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ])

        if (!resMedia.ok || !resMood.ok || !resDettagli.ok) {
          throw new Error(
            "Qualcosa è andato storto nel recupero delle statistiche 😥"
          )
        }

        const mediaData = await resMedia.json()
        const moodData = await resMood.json()
        const dettagliData = await resDettagli.json()

        setMedia(mediaData)
        setMoodStats(moodData)
        setDettagliUtenti(dettagliData.content)
        setTotalPages(dettagliData.totalPages)
      } catch (err) {
        console.error(err)
        setError("Impossibile caricare le statistiche")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [token, currentPage])

  if (loading)
    return (
      <div className="text-center py-3" role="status" aria-live="polite">
        <Spinner animation="border" variant="success" />
        <span className="visually-hidden">Caricamento...</span>
      </div>
    )
  if (error)
    return (
      <Alert className="text-danger" role="alert">
        {error}
      </Alert>
    )

  return (
    <Col sm={12}>
      <h3 className="mb-4">
        <span className="mynav rounded text-white p-2">
          Statistiche Generali
        </span>
      </h3>

      <Card className="shadow p-4">
        <h4 className="fw-bold mb-3 mytext">Attività dettagliate per utente</h4>
        <Table striped bordered hover responsive className="mb-4">
          <caption className="visually-hidden">
            Tabella dettagli attività per utente
          </caption>
          <thead className="table-secondary">
            <tr>
              <th>Username</th>
              <th>Diari</th>
              <th>Tasks</th>
              <th>Eventi</th>
              <th>Mood</th>
              <th>Totale</th>
            </tr>
          </thead>
          <tbody>
            {dettagliUtenti.map((utente) => {
              const totale =
                utente.diari + utente.tasks + utente.eventi + utente.moods
              return (
                <tr key={utente.id}>
                  <td>{utente.username}</td>
                  <td>{utente.diari}</td>
                  <td>{utente.tasks}</td>
                  <td>{utente.eventi}</td>
                  <td>{utente.moods}</td>
                  <td className="fw-bold">{totale}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-0 my-pagination">
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => setCurrentPage(i)}
                aria-label={`Pagina ${i + 1}`}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}

        <h5 className="fs-5 mb-4 mytext">
          📊 Media attività per utente:{" "}
          <span className="fw-bold">{media?.toFixed(2)}</span>
        </h5>

        <Row className="mt-4">
          <Col sm={12} md={4}>
            <h5 className="fw-bold mb-3 mytext">Mood creati per tipo</h5>
            {Object.keys(moodStats).length === 0 ? (
              <p>Nessun dato disponibile.</p>
            ) : (
              <ListGroup>
                {Object.entries(moodStats).map(([tipo, count]) => (
                  <ListGroup.Item
                    key={tipo}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span className="text-capitalize">{tipo}</span>
                    <span className="badge bg-success rounded-pill">
                      {count}
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
        </Row>
      </Card>
    </Col>
  )
}

export default StatisticheComponent
