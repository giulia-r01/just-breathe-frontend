import { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Alert,
} from "react-bootstrap"
import LoadingSkeleton from "./common/LoadingSkeleton"
import JBCard from "./common/JBCard"
import EmptyState from "./common/EmptyState"
import PageHero from "./common/PageHero"
import { apiFetch } from "../utils/api"
import { getSessionToken } from "../utils/session"
import "../assets/cssVari/mood.css"

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
  const token = getSessionToken()

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
        const res = await apiFetch("/moods", { auth: true, token })
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
          "Impossibile caricare i mood 😥. Rilassati e riprova o contatta l'assistenza 🌿",
        )
      } finally {
        setLoading(false)
      }
    }

    const fetchBrani = async (moodId: number): Promise<Brano[]> => {
      try {
        setError("")
        const res = await apiFetch(`/brani/mood/${moodId}`, { auth: true, token })
        if (!res.ok) {
          console.error("Errore fetch brani", res.status)
          return []
        }
        const data = await res.json()
        return data || []
      } catch (e) {
        console.error("Errore fetch brani", e)
        setError(
          "Impossibile caricare i brani 😥. Rilassati e riprova o contatta l'assistenza 🌿",
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
    url: string | undefined | null,
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
      const res = await apiFetch(`/brani/mood/${mood.id}`, { auth: true, token })
      const brani = (await res.json()) || []
      setSelectedMood({ ...mood, brani })
    } catch (e) {
      console.error("Errore fetch brani mood", e)
      setError(
        "Impossibile caricare i brani del mood 😥. Rilassati e riprova o contatta l'assistenza 🌿",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMood = async () => {
    if (!token || !newTipoMood) return
    try {
      setError("")
      const res = await apiFetch(`/moods?tipoMood=${newTipoMood}`, {
        method: "POST",
        auth: true,
        token,
      })
      if (!res.ok)
        throw new Error(
          "Errore creazione mood 😥. Rilassati e riprova o contatta l'assistenza 🌿",
        )
      const createdMood = await res.json()
      setMoods((prev) => [...prev, { ...createdMood, brani: [] }])
      setSelectedMood({ ...createdMood, brani: [] })
      setNewTipoMood("")
    } catch (e) {
      console.error(e)
      setError(
        "Impossibile creare il mood 😥. Rilassati e riprova o contatta l'assistenza 🌿",
      )
    }
  }

  const handleAddBrano = async () => {
    if (!token || !newBrano || !selectedMood) return
    try {
      setError("")
      const res = await apiFetch(`/brani/${selectedMood.id}`, {
        method: "POST",
        auth: true,
        token,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titoloBrano: newBrano }),
      })
      if (!res.ok)
        throw new Error(
          "Errore aggiunta brano 😥. Rilassati e riprova o contatta l'assistenza 🌿",
        )
      const nuovoBrano = await res.json()
      setSelectedMood((prev) =>
        prev ? { ...prev, brani: [...(prev.brani || []), nuovoBrano] } : prev,
      )
      setNewBrano("")
      setSuccess("🎵 Brano aggiunto con successo!")
    } catch (e) {
      console.error(e)
      setError(
        "Impossibile aggiungere il brano 😥. Rilassati e riprova o contatta l'assistenza 🌿",
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
        const res = await apiFetch(`/brani/${editingBrano.id}`, {
          method: "PUT",
          auth: true,
          token,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titoloBrano: editTitolo,
            link: editLink,
          }),
        })

        if (!res.ok)
          throw new Error(
            "Errore durante la modifica del brano 😥. Rilassati e riprova o contatta l'assistenza 🌿",
          )

        updatedBrano = await res.json()
      }

      if (editMoodId !== selectedMood?.id) {
        const res = await apiFetch(
          `/brani/${editingBrano.id}/mood/${editMoodId}`,
          {
            method: "PATCH",
            auth: true,
            token,
          },
        )

        if (!res.ok)
          throw new Error(
            "Errore durante il cambio mood 😥. Rilassati e riprova o contatta l'assistenza 🌿",
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
            : m,
        ),
      )

      setMoods((prev) =>
        prev.map((m) =>
          m.id === editMoodId
            ? { ...m, brani: [...(m.brani || []), updatedBrano] }
            : m,
        ),
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
            : prev,
        )
      } else {
        setSelectedMood((prev) =>
          prev
            ? {
                ...prev,
                brani: (prev.brani ?? []).filter(
                  (b) => b.id !== updatedBrano.id,
                ),
              }
            : prev,
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
      const res = await apiFetch(`/brani/${branoId}`, {
        method: "DELETE",
        auth: true,
        token,
      })
      if (!res.ok)
        throw new Error(
          "Errore eliminazione brano 😥. Rilassati e riprova o contatta l'assistenza 🌿",
        )

      setSelectedMood((prev) =>
        prev
          ? {
              ...prev,
              brani: (prev.brani || []).filter((b) => b.id !== branoId),
            }
          : prev,
      )
    } catch (e) {
      console.error(e)
      setError(
        "Impossibile eliminare il brano 😥. Rilassati e riprova o contatta l'assistenza 🌿",
      )
    }
  }

  const handleDeleteMood = async () => {
    if (!token || !selectedMood) return
    try {
      setError("")
      const res = await apiFetch(`/moods/${selectedMood.id}`, {
        method: "DELETE",
        auth: true,
        token,
      })
      if (!res.ok)
        throw new Error(
          "Errore eliminazione mood 😥. Rilassati e riprova o contatta l'assistenza 🌿",
        )

      setMoods((prev) => prev.filter((m) => m.id !== selectedMood.id))
      setSelectedMood(null)
    } catch (e) {
      console.error(e)
      setError(
        "Impossibile eliminare il mood 😥. Rilassati e riprova o contatta l'assistenza 🌿",
      )
    }
  }

  const getMoodTone = (tipoMood: string) => tipoMood.toLowerCase()

  return (
    <Container className="jb-mood-page py-4 px-3 rounded " role="main">
      <h1 className="visually-hidden">Mood</h1>
      <PageHero
        iconClassName="bi bi-music-note-beamed"
        title="Trasforma il tuo mood in musica"
        subtitle="Crea la playlist perfetta per ogni emozione"
        className="mb-4"
      />

      {loading && <LoadingSkeleton className="my-4" lines={5} />}
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

      <Row className="justify-content-center g-4">
        <Col lg={4}>
          <aside className="jb-mood-shell jb-mood-sidebar">
            <Form className="mb-4 d-flex">
              <Form.Select
                value={newTipoMood}
                onChange={(e) => setNewTipoMood(e.target.value)}
                className="me-2 jb-mood-select"
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
            <h3 className="jb-mood-sidebar-title">I tuoi mood</h3>
            <div className="jb-mood-items-wrap mt-2 pe-1">
              <div className="jb-mood-list d-flex flex-column" role="list">
                {moods.length === 0 && (
                  <EmptyState
                    title="Nessun mood salvato"
                    description="Crea il tuo primo mood per iniziare a costruire la playlist perfetta."
                    iconClassName="bi bi-music-note-list"
                    compact
                  />
                )}
                {moods.map((mood) => (
                  <div
                    key={mood.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectMood(mood)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleSelectMood(mood)
                      }
                    }}
                    className={`jb-mood-item d-flex justify-content-between align-items-center ${
                      selectedMood?.id === mood.id ? "is-active" : ""
                    }`}
                    data-mood-tone={getMoodTone(mood.tipoMood)}
                    aria-pressed={selectedMood?.id === mood.id}
                  >
                    <span>
                      {mood.tipoMood.charAt(0) +
                        mood.tipoMood.slice(1).toLowerCase()}
                    </span>
                    {selectedMood?.id === mood.id && (
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="jb-mood-active-badge"
                          aria-label="Mood attivo"
                        >
                          Attivo
                        </span>
                        <Button
                          variant="light"
                          size="sm"
                          className="jb-mood-delete-icon-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteMood()
                          }}
                          disabled={showEditModal}
                          aria-label="Elimina mood selezionato"
                        >
                          <i className="bi bi-trash3" aria-hidden="true" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </Col>

        <Col lg={8}>
          {selectedMood ? (
            <>
              <section className="jb-mood-shell jb-mood-main">
                <div className="jb-mood-main-header">
                  <h3 className="mb-1">
                    Mood selezionato: <span>{selectedMood.tipoMood}</span>
                  </h3>
                  <p className="jb-mood-main-meta mb-2">
                    Ultima modifica:{" "}
                    {new Date(selectedMood.dataCreazione).toLocaleDateString(
                      "it-IT",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      },
                    )}{" "}
                    {new Date(selectedMood.dataCreazione).toLocaleTimeString(
                      "it-IT",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>

                <p className="jb-mood-main-label">
                  Aggiungi una canzone dal Spotify o YouTube
                </p>

                <Form
                  className="d-flex mb-4"
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
                      placeholder="Incolla il link qui..."
                      value={newBrano}
                      onChange={(e) => setNewBrano(e.target.value)}
                      disabled={showEditModal}
                      aria-required="true"
                      className="jb-mood-input"
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    type="button"
                    onClick={handleAddBrano}
                    disabled={showEditModal}
                    aria-label="Aggiungi - clicca per aggiungere un brano al mood selezionato"
                    className="jb-mood-add-btn"
                  >
                    Aggiungi
                  </Button>
                </Form>

                {(!selectedMood.brani || selectedMood.brani.length === 0) && (
                  <p className="fw-bold pb-2">
                    Nessun brano associato a questo mood.
                  </p>
                )}
                <Row className="g-3">
                  {(selectedMood.brani || []).map((brano) => {
                    const embedUrl = extractYouTubeEmbedUrl(brano.link)
                    return (
                      <Col lg={4} md={6} key={brano.id} className="mb-1">
                        <JBCard
                          variantStyle="elevated"
                          className="jb-track-card text-dark"
                        >
                          <div
                            className="jb-track-media"
                            data-mood-tone={getMoodTone(selectedMood.tipoMood)}
                          >
                            {embedUrl ? (
                              <iframe
                                src={embedUrl}
                                title={`Player di ${brano.titoloBrano}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                role="presentation"
                                aria-label={`Video di YouTube per ${brano.titoloBrano}`}
                              />
                            ) : (
                              <i className="bi bi-play" aria-hidden="true" />
                            )}
                          </div>
                          <Card.Body>
                            <Card.Title className="mytext jb-track-title">
                              {brano.titoloBrano}
                            </Card.Title>
                            <div className="jb-track-actions">
                              <Button
                                variant="outline-success"
                                size="sm"
                                className="jb-track-listen-btn"
                                onClick={() => startEditBrano(brano)}
                                disabled={showEditModal}
                                aria-label="Modifica il brano selezionato"
                              >
                                <i
                                  className="bi bi-pencil-square"
                                  aria-hidden="true"
                                />{" "}
                                Modifica
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="jb-track-delete-btn"
                                onClick={() => handleDeleteBrano(brano.id)}
                                disabled={showEditModal}
                                aria-label="Elimina il brano selezionato"
                              >
                                <i
                                  className="bi bi-trash3"
                                  aria-hidden="true"
                                />
                              </Button>
                            </div>
                          </Card.Body>
                        </JBCard>
                      </Col>
                    )
                  })}
                </Row>
              </section>
            </>
          ) : (
            <EmptyState
              title="Seleziona un mood"
              description="Scegli un mood dalla colonna a sinistra per vedere i dettagli e i brani associati."
              iconClassName="bi bi-vinyl"
            />
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
                className="jb-mood-select"
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
