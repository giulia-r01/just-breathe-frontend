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
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap"

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
      const res = await fetch(`http://localhost:8080/diari?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Errore nel recupero dei diari")
      const data = await res.json()
      setDiari(data.content)
      setTotalPages(data.totalPages)
      setCurrentPage(data.number)
    } catch (err) {
      console.log(err)
      setError("Impossibile caricare i diari")
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    const endpoint = editingId
      ? `http://localhost:8080/diari/${editingId}`
      : "http://localhost:8080/diari"

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
      if (!res.ok) throw new Error("Errore durante il salvataggio del diario")
      setSuccess(
        editingId ? "Diario modificato!" : "Diario salvato con successo!"
      )
      setFormData({ titolo: "", contenuto: "" })
      setEditingId(null)
      fetchDiari(currentPage)
    } catch (err) {
      console.log(err)
      setError("Errore durante il salvataggio")
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
      const res = await fetch(`http://localhost:8080/diari/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Errore durante l'eliminazione")
      setSuccess("Diario eliminato")
      fetchDiari(currentPage)
    } catch {
      setError("Errore nell'eliminazione")
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
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center text-white mb-4 mynav rounded mt-3 py-3">
            Scrivi il tuo Diario
          </h2>
          <Card className="mynav text-white p-4 mb-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="titolo" className="mb-3">
                <Form.Label>Titolo</Form.Label>
                <Form.Control
                  type="text"
                  name="titolo"
                  value={formData.titolo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="contenuto" className="mb-4">
                <Form.Label>Contenuto</Form.Label>
                <Form.Control
                  as="textarea"
                  name="contenuto"
                  rows={5}
                  value={formData.contenuto}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="success">
                {editingId ? "Modifica Diario" : "Salva Diario"}
              </Button>
            </Form>
          </Card>

          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>

      <h3 className="text-white mt-5 mb-3 mynav rounded py-3 px-3">
        Diari precedenti
      </h3>

      <Row>
        {loading && <Spinner animation="border" />}
        {!loading &&
          diari.map((d) => (
            <Col sm={12} md={6} lg={4} key={d.id}>
              <Card className="mynav text-white mb-3">
                <Card.Body>
                  <Card.Title>{d.titolo}</Card.Title>
                  <Card.Subtitle className="mb-2 text-white">
                    {d.dataUltimaModifica !== d.dataInserimento
                      ? `Ultima modifica: ${new Date(
                          d.dataUltimaModifica
                        ).toLocaleString()}`
                      : `Creato il: ${new Date(
                          d.dataInserimento
                        ).toLocaleString()}`}
                  </Card.Subtitle>
                  <Card.Text>
                    {d.contenuto.length > 150
                      ? d.contenuto.substring(0, 150) + "..."
                      : d.contenuto}
                  </Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleShowModal(d)}
                    className="me-2"
                  >
                    Visualizza
                  </Button>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => handleEdit(d)}
                    className="me-2"
                  >
                    Modifica
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(d.id)}
                  >
                    Elimina
                  </Button>
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
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* MODALE */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedDiario?.titolo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedDiario?.contenuto}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Diario
