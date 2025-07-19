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
  Alert,
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
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [moods, setMoods] = useState<Mood[]>([])
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [newTipoMood, setNewTipoMood] = useState("")
  const [newBrano, setNewBrano] = useState("")

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBrano, setEditingBrano] = useState<Brano | null>(null)
  const [editTitolo, setEditTitolo] = useState("")
  const [editLink, setEditLink] = useState("")
  const [editMoodId, setEditMoodId] = useState<number | null>(null)

  useEffect(() => {
    if (!token) return

    const fetchMoods = async () => {
      setError("")
      setLoading(true)
      try {
        setError("")
        const res = await fetch(`${import.meta.env.VITE_API_URL}/moods`, {
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
        setError(
          "Impossibile caricare i mood 😥. Rilassati e riprova o contatta l'assistenza 🌿"
        )
      } finally {
        setLoading(false)
      }
    }

    const fetchBrani = async (moodId: number): Promise<Brano[]> => {
      try {
        setError("")
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/brani/mood/${moodId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (!res.ok) {
          console.error("Errore fetch brani", res.status)
          return []
        }
        const data = await res.json()
        return data || []
      } catch (e) {
        console.error("Errore fetch brani", e)
        setError(
          "Impossibile caricare i brani 😥. Rilassati e riprova o contatta l'assistenza 🌿"
        )
        return []
      }
    }

    fetchMoods()
  }, [token])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

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

  const handleSelectMood = async (mood: Mood) => {
    if (!token) return
    setLoading(true)
    try {
      setError("")
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/brani/mood/${mood.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const brani = (await res.json()) || []
      setSelectedMood({ ...mood, brani })
    } catch (e) {
      console.error("Errore fetch brani mood", e)
      setError(
        "Impossibile caricare i brani del mood 😥. Rilassati e riprova o contatta l'assistenza 🌿"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMood = async () => {
    if (!token || !newTipoMood) return
    try {
      setError("")
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/moods?tipoMood=${newTipoMood}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok)
        throw new Error(
          "Errore creazione mood 😥. Rilassati e riprova o contatta l'assistenza 🌿"
        )
      const createdMood = await res.json()
      setMoods((prev) => [...prev, { ...createdMood, brani: [] }])
      setSelectedMood({ ...createdMood, brani: [] })
      setNewTipoMood("")
    } catch (e) {
      console.error(e)
      setError(
        "Impossibile creare il mood 😥. Rilassati e riprova o contatta l'assistenza 🌿"
      )
    }
  }

  const handleAddBrano = async () => {
    if (!token || !newBrano || !selectedMood) return
    try {
      setError("")
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/brani/${selectedMood.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ titoloBrano: newBrano }),
        }
      )
      if (!res.ok)
        throw new Error(
          "Errore aggiunta brano 😥. Rilassati e riprova o contatta l'assistenza 🌿"
        )
      const nuovoBrano = await res.json()
      setSelectedMood((prev) =>
        prev ? { ...prev, brani: [...(prev.brani || []), nuovoBrano] } : prev
      )
      setNewBrano("")
      setSuccess("🎵 Brano aggiunto con successo!")
    } catch (e) {
      console.error(e)
      setError(
        "Impossibile aggiungere il brano 😥. Rilassati e riprova o contatta l'assistenza 🌿"
      )
    }
  }

  const startEditBrano = (brano: Brano) => {
    setEditingBrano(brano)
    setEditTitolo(brano.titoloBrano)
    setEditLink(brano.link || "")
    setEditMoodId(selectedMood?.id ?? null)
    setShowEditModal(true)
  }

  const handleSaveEditBrano = async () => {
    if (!token || !editingBrano || editMoodId === null) return

    try {
      setError("")
      let updatedBrano = editingBrano

      if (
        editingBrano.titoloBrano !== editTitolo ||
        (editingBrano.link || "") !== editLink
      ) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/brani/${editingBrano.id}`,
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

        if (!res.ok)
          throw new Error(
            "Errore durante la modifica del brano 😥. Rilassati e riprova o contatta l'assistenza 🌿"
          )

        updatedBrano = await res.json()
      }

      if (editMoodId !== selectedMood?.id) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/brani/${
            editingBrano.id
          }/mood/${editMoodId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok)
          throw new Error(
            "Errore durante il cambio mood 😥. Rilassati e riprova o contatta l'assistenza 🌿"
          )

        updatedBrano = await res.json()
      }

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

      setMoods((prev) =>
        prev.map((m) =>
          m.id === editMoodId
            ? { ...m, brani: [...(m.brani || []), updatedBrano] }
            : m
        )
      )

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

      setShowEditModal(false)
      setEditingBrano(null)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteBrano = async (branoId: number) => {
    if (!token || !selectedMood) return
    try {
      setError("")
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/brani/${branoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok)
        throw new Error(
          "Errore eliminazione brano 😥. Rilassati e riprova o contatta l'assistenza 🌿"
        )

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
      setError(
        "Impossibile eliminare il brano 😥. Rilassati e riprova o contatta l'assistenza 🌿"
      )
    }
  }

  const handleDeleteMood = async () => {
    if (!token || !selectedMood) return
    try {
      setError("")
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/moods/${selectedMood.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok)
        throw new Error(
          "Errore eliminazione mood 😥. Rilassati e riprova o contatta l'assistenza 🌿"
        )

      setMoods((prev) => prev.filter((m) => m.id !== selectedMood.id))
      setSelectedMood(null)
    } catch (e) {
      console.error(e)
      setError(
        "Impossibile eliminare il mood 😥. Rilassati e riprova o contatta l'assistenza 🌿"
      )
    }
  }

  return (
    <Container className="py-4 px-3 rounded my-5" role="main">
      <h1 className="visually-hidden">Mood</h1>
      <h2 className="text-center mb-4 mynav p-3 rounded text-white ">
        Come ti senti oggi? Crea la tua playlist
      </h2>

      {loading && (
        <div className="text-center py-5" role="status" aria-live="polite">
          <Spinner animation="border" variant="success" />
          <span className="visually-hidden">Caricamento...</span>
        </div>
      )}
      {success && (
        <div role="alert">
          <Alert variant="success" className="text-center">
            {success}
          </Alert>
        </div>
      )}
      {error && (
        <div role="alert">
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        </div>
      )}

      <Row className="justify-content-center g-3">
        <Col md={4} lg={6}>
          <h3 className="mynav rounded p-3 text-white">I tuoi mood</h3>
          <ListGroup>
            {moods.length === 0 && (
              <p className="bg-white rounded p-2 mytext fw-semibold">
                Nessun mood salvato.
              </p>
            )}
            {moods.map((mood) => (
              <ListGroup.Item
                key={mood.id}
                action
                active={selectedMood?.id === mood.id}
                onClick={() => handleSelectMood(mood)}
                as="div"
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
              aria-label="Seleziona un mood da creare"
            >
              <option value="">Crea un mood</option>
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
              aria-label="Crea - clicca per creare il tuo mood"
            >
              Crea
            </Button>
          </Form>
        </Col>

        <Col md={8} lg={6}>
          {selectedMood ? (
            <>
              <div className="mynav rounded">
                <h3 className="p-3 text-white ">
                  Mood selezionato: {selectedMood.tipoMood}
                </h3>
                <p className="text-white ps-3 pb-2">
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
                {(!selectedMood.brani || selectedMood.brani.length === 0) && (
                  <p className="text-white fw-bold ps-3 pb-2">
                    Nessun brano associato a questo mood.
                  </p>
                )}
              </div>
              <Form
                className="d-flex mb-3"
                role="form"
                aria-label="Aggiungi un nuovo brano al mood selezionato"
              >
                <Form.Group
                  controlId="nuovoBranoInput"
                  className="flex-grow-1 me-2"
                >
                  <Form.Label className="visually-hidden">
                    Inserisci il titolo di un nuovo brano
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Aggiungi una canzone (es. Toxicity )"
                    value={newBrano}
                    onChange={(e) => setNewBrano(e.target.value)}
                    disabled={showEditModal}
                    aria-required="true"
                  />
                </Form.Group>
                <Button
                  variant="success"
                  type="button"
                  onClick={handleAddBrano}
                  disabled={showEditModal}
                  aria-label="Aggiungi - clicca per aggiungere un brano al mood selezionato"
                >
                  Aggiungi
                </Button>
              </Form>

              <Row className="g-1">
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
                                title={`Player di ${brano.titoloBrano}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                role="presentation"
                                aria-label={`Video di YouTube per ${brano.titoloBrano}`}
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
                            aria-label="Modifica il brano selezionato"
                          >
                            Modifica
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleDeleteBrano(brano.id)}
                            disabled={showEditModal}
                            aria-label="Elimina il brano selezionato"
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
            <p className="bg-white rounded p-2 mytext fw-semibold">
              Seleziona un mood per vedere i dettagli.
            </p>
          )}
        </Col>
      </Row>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        aria-labelledby="modalModificaBranoTitolo"
        aria-describedby="modalModificaBranoDescrizione"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="modalModificaBranoTitolo">
            Modifica brano selezionato
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="modalModificaBranoDescrizione">
          <Form>
            <Form.Group className="mb-3" controlId="editTitolo">
              <Form.Label>Titolo del brano</Form.Label>
              <Form.Control
                type="text"
                value={editTitolo}
                onChange={(e) => setEditTitolo(e.target.value)}
                autoFocus
                aria-required="true"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editLink">
              <Form.Label>Link YouTube (facoltativo)</Form.Label>
              <Form.Control
                type="url"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                inputMode="url"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editMoodId">
              <Form.Label>Assegna a un altro mood</Form.Label>
              <Form.Select
                value={editMoodId || ""}
                onChange={(e) => setEditMoodId(Number(e.target.value))}
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
            aria-label="Annulla la modifica del brano"
          >
            Annulla
          </Button>
          <Button
            variant="success"
            onClick={handleSaveEditBrano}
            aria-label="Salva le modifiche del brano"
          >
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Mood
