/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Pagination,
  Row,
  Alert,
  Modal,
} from "react-bootstrap"
import LoadingSkeleton from "./common/LoadingSkeleton"

interface Diario {
  id: number
  titolo: string
  contenuto: string
  dataInserimento: string
  dataUltimaModifica: string
}

const Diario = () => {
  const [formData, setFormData] = useState({ titolo: "", contenuto: "" })
  const [diari, setDiari] = useState<Diario[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [selectedDiario, setSelectedDiario] = useState<Diario | null>(null)

  const token = localStorage.getItem("token")

  const fetchDiari = async (page = 0) => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/diari?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok)
        throw new Error(
          "Qualcosa è andato storto nel recupero dei tuoi diari 😥. Rilassati, riprova o contatta l'assistenza 🌿",
        )
      const data = await res.json()
      setDiari(data.content)
      setTotalPages(data.totalPages)
      setCurrentPage(data.number)
    } catch (err) {
      console.log(err)
      setError("Impossibile caricare i diari 😥")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiari()
  }, [])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 4000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    const endpoint = editingId
      ? `${import.meta.env.VITE_API_URL}/diari/${editingId}`
      : `${import.meta.env.VITE_API_URL}/diari`

    const method = editingId ? "PUT" : "POST"

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (!res.ok)
        throw new Error(
          "Errore durante il salvataggio del diario 😥. Rilassati, riprova o contatta l'assistenza 🌿",
        )
      setSuccess(
        editingId ? "Diario modificato! 🥳" : "Diario salvato con successo! 🥳",
      )
      setFormData({ titolo: "", contenuto: "" })
      setEditingId(null)
      fetchDiari(currentPage)
    } catch (err) {
      console.log(err)
      setError("Errore durante il salvataggio 😥")
    }
  }

  const handleEdit = (diario: Diario) => {
    setFormData({ titolo: diario.titolo, contenuto: diario.contenuto })
    setEditingId(diario.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo diario?")) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/diari/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Errore durante l'eliminazione 😥")
      setSuccess("Diario eliminato ✨")
      fetchDiari(currentPage)
    } catch {
      setError("Errore nell'eliminazione 😥")
    }
  }

  const handlePageChange = (page: number) => {
    fetchDiari(page)
  }

  const handleShowModal = (diario: Diario) => {
    setSelectedDiario(diario)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedDiario(null)
  }

  return (
    <Container className="jb-diary-page my-4" role="main">
      <div className="jb-page-hero mt-3 mb-4">
        <div className="jb-page-hero-icon" aria-hidden="true">
          <i className="bi bi-journal-bookmark" />
        </div>
        <div>
          <h2 className="jb-page-hero-title mb-1">Il tuo Diario</h2>
          <p className="jb-page-hero-subtitle mb-0">
            Scrivi i tuoi pensieri e riflessioni
          </p>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col lg={12}>
          <h1 className="visually-hidden">Diario</h1>
          <Card className="jb-surface jb-diary-form-card p-4 mb-4">
            <Form onSubmit={handleSubmit}>
              <h3 className="jb-diary-form-title mb-2">Scrivi il tuo Diario</h3>
              <p className="jb-diary-form-date mb-3">
                Oggi è{" "}
                {new Date().toLocaleDateString("it-IT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <Form.Group controlId="titolo" className="mb-3">
                <Form.Label>Titolo</Form.Label>
                <Form.Control
                  type="text"
                  name="titolo"
                  placeholder="Dai un titolo al tuo diario"
                  value={formData.titolo}
                  onChange={handleChange}
                  required
                  className="jb-diary-input"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Come ti senti oggi?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Racconta..."
                  className="jb-diary-input"
                  aria-label="Come ti senti oggi?"
                />
              </Form.Group>
              <Form.Group controlId="contenuto" className="mb-4">
                <Form.Label>Che ti passa per la mente? Scrivilo!</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Scrivi i tuoi pensieri..."
                  name="contenuto"
                  rows={5}
                  value={formData.contenuto}
                  onChange={handleChange}
                  required
                  className="jb-diary-input"
                />
              </Form.Group>
              <Button
                type="submit"
                variant="success"
                aria-label={editingId ? "Modifica Diario" : "Salva Diario"}
                className="jb-diary-save-btn"
              >
                {editingId ? "Modifica Diario" : "Salva Diario"}
              </Button>
            </Form>
          </Card>

          {success && (
            <div role="alert">
              <Alert variant="success">{success}</Alert>
            </div>
          )}
          {error && (
            <div role="alert">
              <Alert variant="danger">{error}</Alert>
            </div>
          )}
        </Col>
      </Row>

      <h3 className="mt-4 mb-3 jb-diary-list-title">Diari precedenti</h3>

      <Row className="g-3">
        {loading && <LoadingSkeleton className="mb-3" lines={4} />}
        {!loading &&
          diari.map((d) => (
            <Col sm={12} md={6} lg={4} key={d.id}>
              <Card className="jb-surface jb-diary-item-card mb-1">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <Card.Title as="h3" className="h4 mb-0">
                      {d.titolo}
                    </Card.Title>
                  </div>
                  <Card.Subtitle
                    as="h4"
                    className="h6 mb-3 jb-diary-item-subtitle"
                  >
                    {d.dataUltimaModifica !== d.dataInserimento
                      ? `Ultima modifica: ${new Date(
                          d.dataUltimaModifica,
                        ).toLocaleString("it-IT", {
                          timeZone: "Europe/Rome",
                        })}`
                      : `Creato il: ${new Date(
                          d.dataInserimento,
                        ).toLocaleString("it-IT", {
                          timeZone: "Europe/Rome",
                        })}`}
                  </Card.Subtitle>
                  <Card.Text className="jb-diary-item-text">
                    {d.contenuto.length > 150
                      ? d.contenuto.substring(0, 150) + "..."
                      : d.contenuto}
                  </Card.Text>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      aria-label="Visualizza il tuo diario"
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleShowModal(d)}
                      className="jb-diary-read-btn"
                    >
                      <i className="bi bi-eye" aria-hidden="true" /> Leggi
                    </Button>
                    <Button
                      aria-label="Modifica il tuo diario"
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleEdit(d)}
                      className="jb-diary-icon-btn"
                    >
                      <i className="bi bi-pencil-square" aria-hidden="true" />
                    </Button>
                    <Button
                      aria-label="Elimina il tuo diario"
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(d.id)}
                      className="jb-diary-icon-btn"
                    >
                      <i className="bi bi-trash3" aria-hidden="true" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4 my-pagination">
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

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        aria-labelledby="modalTitoloDiario"
        aria-describedby="modalContenutoDiario"
      >
        <Modal.Header closeButton>
          <Modal.Title id="modalTitoloDiario">
            {selectedDiario?.titolo}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="modalContenutoDiario">
          <p>{selectedDiario?.contenuto}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            aria-label="Chiudi"
          >
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Diario
