import { useEffect, useState } from "react"
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Alert,
} from "react-bootstrap"

interface Respiro {
  id?: number
  nome: string
  descrizione?: string
  inspiraSecondi: number
  trattieniSecondi: number
  espiraSecondi: number
  categoria: "RELAX" | "FOCUS" | "ENERGIA"
}

const categorie = ["RELAX", "FOCUS", "ENERGIA"] as const

const RespiriAdminComponent = () => {
  const [respiri, setRespiri] = useState<Respiro[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<Respiro>({
    nome: "",
    descrizione: "",
    inspiraSecondi: 4,
    trattieniSecondi: 4,
    espiraSecondi: 4,
    categoria: "RELAX",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const fetchRespiri = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/respirazioni`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("Errore nel recupero delle respirazioni")
      const data = await res.json()
      setRespiri(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore sconosciuto")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRespiri()
  }, [])

  const openNewModal = () => {
    setEditingId(null)
    setFormData({
      nome: "",
      descrizione: "",
      inspiraSecondi: 4,
      trattieniSecondi: 4,
      espiraSecondi: 4,
      categoria: "RELAX",
    })
    setShowModal(true)
  }

  const openEditModal = (respiro: Respiro) => {
    setEditingId(respiro.id || null)
    setFormData(respiro)
    setShowModal(true)
  }

  const closeModal = () => {
    if (isSaving) return
    setShowModal(false)
    setError("")
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Secondi") ? Math.max(0, Number(value)) : value,
    }))
  }

  const validate = (): string | null => {
    if (!formData.nome.trim()) return "Il nome è obbligatorio"
    if (!categorie.includes(formData.categoria)) return "Categoria non valida"
    if (
      formData.inspiraSecondi <= 0 ||
      formData.trattieniSecondi < 0 ||
      formData.espiraSecondi <= 0
    )
      return "I secondi devono essere numeri positivi (trattieni può essere 0)"
    return null
  }

  const handleSave = async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setIsSaving(true)
    setError("")

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/respirazioni/${editingId}`
        : `${import.meta.env.VITE_API_URL}/respirazioni`

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        const msg =
          errorData?.message ||
          "Errore durante il salvataggio della respirazione"
        throw new Error(msg)
      }

      await fetchRespiri()
      setShowModal(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore sconosciuto")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!window.confirm("Sei sicuro di voler eliminare questa respirazione?"))
      return

    setLoading(true)
    setError("")
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/respirazioni/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      )
      if (!res.ok) throw new Error("Errore durante l'eliminazione")
      await fetchRespiri()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore sconosciuto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-4 pt-5">
      <h3 className="mb-4">
        <span className="mynav rounded text-white p-2">
          Gestione Respirazioni
        </span>
      </h3>
      <Button
        variant="success"
        className="mb-3"
        onClick={openNewModal}
        aria-label="+ Nuova Respirazione - Crea una nuova respirazione"
      >
        + Nuova Respirazione
      </Button>

      {loading && (
        <div className="text-center" role="status" aria-live="polite">
          <Spinner animation="border" variant="primary" />
          <span className="visually-hidden">Caricamento...</span>
        </div>
      )}

      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}

      {respiri.length === 0 && !loading && <p>Nessuna respirazione trovata.</p>}

      <Row xs={1} md={2} lg={3} className="g-3">
        {respiri.map((respiro) => (
          <Col key={respiro.id}>
            <Card>
              <Card.Body>
                <Card.Title className="mytext">{respiro.nome}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Categoria: {respiro.categoria}
                </Card.Subtitle>
                <Card.Text>
                  Inspira: {respiro.inspiraSecondi}s<br />
                  Trattieni: {respiro.trattieniSecondi}s<br />
                  Espira: {respiro.espiraSecondi}s
                </Card.Text>
                <div>
                  <Button
                    variant="success"
                    onClick={() => openEditModal(respiro)}
                    aria-label={`Modifica respirazione ${respiro.nome}`}
                    className="me-3"
                  >
                    Modifica
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(respiro.id)}
                    aria-label={`Elimina respirazione ${respiro.nome}`}
                  >
                    Elimina
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        aria-labelledby="modal-titolo"
        aria-describedby="modal-descrizione"
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal-titolo">
            {editingId ? "Modifica Respirazione" : "Nuova Respirazione"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span id="modal-descrizione" className="visually-hidden">
            {editingId
              ? "Modifica una respirazione esistente."
              : "Crea una nuova respirazione."}
          </span>

          {error && (
            <Alert variant="danger" role="alert">
              {error}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome *</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescrizione">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="descrizione"
                value={formData.descrizione}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formInspira">
              <Form.Label>Inspira (secondi) *</Form.Label>
              <Form.Control
                type="number"
                min={0}
                name="inspiraSecondi"
                value={formData.inspiraSecondi}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTrattieni">
              <Form.Label>Trattieni (secondi)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                name="trattieniSecondi"
                value={formData.trattieniSecondi}
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Può essere 0 se non si vuole trattenere il respiro.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEspira">
              <Form.Label>Espira (secondi) *</Form.Label>
              <Form.Control
                type="number"
                min={0}
                name="espiraSecondi"
                value={formData.espiraSecondi}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCategoria">
              <Form.Label>Categoria *</Form.Label>
              <Form.Select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                {categorie.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeModal}
            disabled={isSaving}
            aria-label="Annulla la modifica"
          >
            Annulla
          </Button>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={isSaving}
            aria-label="Salva la modifica"
          >
            {isSaving ? "Salvando..." : "Salva"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default RespiriAdminComponent
