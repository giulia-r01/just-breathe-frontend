import { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Spinner,
  Card,
  Button,
  Form,
  ListGroup,
  Modal,
} from "react-bootstrap"

interface Brano {
  id: number
  titoloBrano: string
  link: string
}

interface Mood {
  id: number
  tipoMood: string
  dataCreazione: string
  brani: Brano[]
}

const tipiMood = [
  "NOSTALGICO",
  "ARRABBIATO",
  "STRESSATO",
  "RILASSATO",
  "ENERGICO",
  "FELICE",
  "ANSIOSO",
  "ANNOIATO",
  "SOPRAFFATTO",
]

const Mood = () => {
  const token = localStorage.getItem("token")

  const [loading, setLoading] = useState(true)
  const [moods, setMoods] = useState<Mood[]>([])
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [newTipoMood, setNewTipoMood] = useState("")
  const [newBrano, setNewBrano] = useState("")

  // Modale edit
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBrano, setEditingBrano] = useState<Brano | null>(null)
  const [editTitolo, setEditTitolo] = useState("")
  const [editLink, setEditLink] = useState("")
  const [editMoodId, setEditMoodId] = useState<number | null>(null)

  // Fetch moods e primi brani
  useEffect(() => {
    if (!token) return

    const fetchMoods = async () => {
      try {
        const res = await fetch("http://localhost:8080/moods", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        const moodsList: Mood[] = data.content || []
        setMoods(moodsList)

        if (moodsList.length > 0) {
          const firstMood = moodsList[0]
          const brani = await fetchBrani(firstMood.id)
          setSelectedMood({ ...firstMood, brani })
        }
      } catch (e) {
        console.error("Errore fetch moods", e)
      } finally {
        setLoading(false)
      }
    }

    const fetchBrani = async (moodId: number): Promise<Brano[]> => {
      try {
        const res = await fetch(`http://localhost:8080/brani/mood/${moodId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          console.error("Errore fetch brani", res.status)
          return []
        }
        const data = await res.json()
        return data || []
      } catch (e) {
        console.error("Errore fetch brani", e)
        return []
      }
    }

    fetchMoods()
  }, [token])

  // Estrae link embed Youtube - supporta vari formati link
  const extractYouTubeEmbedUrl = (
    url: string | undefined | null
  ): string | null => {
    if (!url) return null
    const regexes = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&]+)/,
    ]
    for (const regex of regexes) {
      const match = url.match(regex)
      if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`
    }
    return null
  }

  // Seleziona un mood e carica i brani
  const handleSelectMood = async (mood: Mood) => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8080/brani/mood/${mood.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const brani = (await res.json()) || []
      setSelectedMood({ ...mood, brani })
    } catch (e) {
      console.error("Errore fetch brani mood", e)
    } finally {
      setLoading(false)
    }
  }

  // Crea nuovo mood
  const handleCreateMood = async () => {
    if (!token || !newTipoMood) return
    try {
      const res = await fetch(
        `http://localhost:8080/moods?tipoMood=${newTipoMood}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok) throw new Error("Errore creazione mood")
      const createdMood = await res.json()
      setMoods((prev) => [...prev, { ...createdMood, brani: [] }])
      setSelectedMood({ ...createdMood, brani: [] })
      setNewTipoMood("")
    } catch (e) {
      console.error(e)
    }
  }

  // Aggiungi brano a mood selezionato
  const handleAddBrano = async () => {
    if (!token || !newBrano || !selectedMood) return
    try {
      const res = await fetch(
        `http://localhost:8080/brani/${selectedMood.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ titoloBrano: newBrano }),
        }
      )
      if (!res.ok) throw new Error("Errore aggiunta brano")
      const nuovoBrano = await res.json()
      setSelectedMood((prev) =>
        prev ? { ...prev, brani: [...(prev.brani || []), nuovoBrano] } : prev
      )
      setNewBrano("")
    } catch (e) {
      console.error(e)
    }
  }

  // Apri modale modifica brano
  const startEditBrano = (brano: Brano) => {
    setEditingBrano(brano)
    setEditTitolo(brano.titoloBrano)
    setEditLink(brano.link || "")
    setEditMoodId(selectedMood?.id ?? null)
    setShowEditModal(true)
  }

  // Salva modifica brano
  const handleSaveEditBrano = async () => {
    if (!token || !editingBrano || editMoodId === null) return

    try {
      let updatedBrano = editingBrano

      // 1. Modifica titolo o link (PUT)
      if (
        editingBrano.titoloBrano !== editTitolo ||
        (editingBrano.link || "") !== editLink
      ) {
        const res = await fetch(
          `http://localhost:8080/brani/${editingBrano.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              titoloBrano: editTitolo,
              link: editLink,
            }),
          }
        )

        if (!res.ok) throw new Error("Errore durante la modifica del brano")

        updatedBrano = await res.json()
      }

      // 2. Cambia mood (PATCH)
      if (editMoodId !== selectedMood?.id) {
        const res = await fetch(
          `http://localhost:8080/brani/${editingBrano.id}/mood/${editMoodId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) throw new Error("Errore durante il cambio mood")

        updatedBrano = await res.json()
      }

      // 3. Aggiorna stato frontend

      // Rimuovi il brano dal mood precedente
      setMoods((prev) =>
        prev.map((m) =>
          m.id === selectedMood?.id
            ? {
                ...m,
                brani: (m.brani ?? []).filter((b) => b.id !== updatedBrano.id),
              }
            : m
        )
      )

      // Aggiungi il brano al nuovo mood
      setMoods((prev) =>
        prev.map((m) =>
          m.id === editMoodId ? { ...m, brani: [...m.brani, updatedBrano] } : m
        )
      )

      // Se il mood selezionato è quello nuovo, aggiorna anche selectedMood
      if (selectedMood?.id === editMoodId) {
        setSelectedMood((prev) =>
          prev
            ? {
                ...prev,
                brani: [
                  ...(prev.brani ?? []).filter((b) => b.id !== updatedBrano.id),
                  updatedBrano,
                ],
              }
            : prev
        )
      } else {
        setSelectedMood((prev) =>
          prev
            ? {
                ...prev,
                brani: (prev.brani ?? []).filter(
                  (b) => b.id !== updatedBrano.id
                ),
              }
            : prev
        )
      }

      // Chiudi modale
      setShowEditModal(false)
      setEditingBrano(null)
    } catch (e) {
      console.error(e)
    }
  }

  // Elimina brano
  const handleDeleteBrano = async (branoId: number) => {
    if (!token || !selectedMood) return
    try {
      const res = await fetch(`http://localhost:8080/brani/${branoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Errore eliminazione brano")

      setSelectedMood((prev) =>
        prev
          ? {
              ...prev,
              brani: (prev.brani || []).filter((b) => b.id !== branoId),
            }
          : prev
      )
    } catch (e) {
      console.error(e)
    }
  }

  // Elimina mood
  const handleDeleteMood = async () => {
    if (!token || !selectedMood) return
    try {
      const res = await fetch(
        `http://localhost:8080/moods/${selectedMood.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok) throw new Error("Errore eliminazione mood")

      setMoods((prev) => prev.filter((m) => m.id !== selectedMood.id))
      setSelectedMood(null)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Container className="text-white py-4 px-3 rounded my-5">
      <h2 className="text-center mb-4 mynav p-3 rounded">
        Come ti senti oggi? Crea la tua playlist
      </h2>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
        </div>
      )}

      <Row className="justify-content-center g-3">
        <Col lg={6}>
          <h4 className="mynav rounded p-3">I tuoi mood</h4>
          <ListGroup>
            {moods.length === 0 && <p>Nessun mood salvato.</p>}
            {moods.map((mood) => (
              <ListGroup.Item
                key={mood.id}
                action
                active={selectedMood?.id === mood.id}
                onClick={() => handleSelectMood(mood)}
                className={
                  selectedMood?.id === mood.id
                    ? "d-flex justify-content-between align-items-center text-white bg-success border border-success"
                    : "d-flex justify-content-between align-items-center text-dark"
                }
              >
                <span>
                  {mood.tipoMood.charAt(0) +
                    mood.tipoMood.slice(1).toLowerCase()}
                </span>
                {selectedMood?.id === mood.id && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteMood()
                    }}
                    disabled={showEditModal}
                  >
                    Elimina
                  </Button>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Form className="mt-4 d-flex">
            <Form.Select
              value={newTipoMood}
              onChange={(e) => setNewTipoMood(e.target.value)}
              className="me-2"
              disabled={showEditModal}
            >
              <option value="">Seleziona un mood</option>
              {tipiMood.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                </option>
              ))}
            </Form.Select>
            <Button
              variant="success"
              onClick={handleCreateMood}
              disabled={showEditModal}
            >
              Crea
            </Button>
          </Form>
        </Col>

        <Col lg={6}>
          {selectedMood ? (
            <>
              <h4 className="mynav rounded p-3">
                Mood selezionato: {selectedMood.tipoMood}
              </h4>
              <p className="text-white mynav rounded p-2">
                Salvato il:{" "}
                {new Date(selectedMood.dataCreazione).toLocaleDateString(
                  "it-IT",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>

              <Form className="d-flex mb-3">
                <Form.Control
                  type="text"
                  placeholder="Aggiungi una canzone (es. Imagine Dragons)"
                  value={newBrano}
                  onChange={(e) => setNewBrano(e.target.value)}
                  className="me-2"
                  disabled={showEditModal}
                />
                <Button
                  variant="success"
                  onClick={handleAddBrano}
                  disabled={showEditModal}
                >
                  Aggiungi
                </Button>
              </Form>

              <Row>
                {(!selectedMood.brani || selectedMood.brani.length === 0) && (
                  <p>Nessun brano associato a questo mood.</p>
                )}
                {(selectedMood.brani || []).map((brano) => {
                  const embedUrl = extractYouTubeEmbedUrl(brano.link)
                  return (
                    <Col md={6} key={brano.id} className="mb-4">
                      <Card className="text-dark">
                        <Card.Body>
                          <Card.Title className="mytext">
                            {brano.titoloBrano}
                          </Card.Title>

                          {embedUrl ? (
                            <div className="ratio ratio-16x9">
                              <iframe
                                src={embedUrl}
                                title={brano.titoloBrano}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <p>Nessun player disponibile</p>
                          )}

                          <Button
                            variant="success"
                            size="sm"
                            className="me-2 mt-2"
                            onClick={() => startEditBrano(brano)}
                            disabled={showEditModal}
                          >
                            Modifica
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleDeleteBrano(brano.id)}
                            disabled={showEditModal}
                          >
                            Elimina
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            </>
          ) : (
            <p>Seleziona un mood per vedere i dettagli.</p>
          )}
        </Col>
      </Row>

      {/* Modale modifica brano */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifica Brano</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="editTitolo">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                value={editTitolo}
                onChange={(e) => setEditTitolo(e.target.value)}
                disabled={!showEditModal}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editLink">
              <Form.Label>Link YouTube</Form.Label>
              <Form.Control
                type="text"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={!showEditModal}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editMoodId">
              <Form.Label>Mood</Form.Label>
              <Form.Select
                value={editMoodId || ""}
                onChange={(e) => setEditMoodId(Number(e.target.value))}
                disabled={!showEditModal}
              >
                {moods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.tipoMood.charAt(0) + m.tipoMood.slice(1).toLowerCase()}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditModal(false)}
            disabled={!showEditModal}
          >
            Annulla
          </Button>
          <Button
            variant="success"
            onClick={handleSaveEditBrano}
            disabled={!showEditModal}
          >
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Mood
