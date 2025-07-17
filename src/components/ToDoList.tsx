import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap"
import "../assets/cssVari/toDoList.css"

interface ToDo {
  id: number
  titolo: string
  descrizione?: string
  tipoTask: string
  dataCreazioneTask: string
  dataUltimaModificaTask: string
}

type TaskDraft = Partial<Omit<ToDo, "dataCreazioneTask">> & {
  dataCreazioneTask: string
}

const tipiTask = [
  { value: "DA_FARE", label: "Da fare" },
  { value: "IN_CORSO", label: "In corso" },
  { value: "FATTO", label: "Fatto" },
]

const ToDoList = () => {
  const [tasks, setTasks] = useState<ToDo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showModal, setShowModal] = useState(false)
  const [currentTask, setCurrentTask] = useState<TaskDraft | null>(null)

  const token = localStorage.getItem("token")

  const labelTipoTask = (tipo: string) => {
    switch (tipo) {
      case "DA_FARE":
        return "Da fare"
      case "IN_CORSO":
        return "In corso"
      case "FATTO":
        return "Fatto"
      default:
        return tipo
    }
  }

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok)
          throw new Error(
            "Errore nel caricamento dei task 😥. Rilassati e riprova o contatta l'assistenza 🌿"
          )
        const data = await res.json()
        setTasks(data.content || data)
      } catch (err) {
        console.error(err)
        setError("Impossibile caricare i task 😥.")
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchTasks()
  }, [token])

  const tasksOfDay = tasks.filter((task) => {
    const taskDate = new Date(task.dataCreazioneTask)

    return (
      taskDate.getFullYear() === selectedDate.getFullYear() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getDate() === selectedDate.getDate()
    )
  })

  const upcomingTasksOfMonth = tasks
    .filter((task) => {
      const taskDate = new Date(task.dataCreazioneTask)

      const sameDay =
        taskDate.getFullYear() === selectedDate.getFullYear() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getDate() === selectedDate.getDate()

      return (
        taskDate >= selectedDate &&
        taskDate.getFullYear() === selectedDate.getFullYear() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        !sameDay
      )
    })
    .sort(
      (a, b) =>
        new Date(a.dataCreazioneTask).getTime() -
        new Date(b.dataCreazioneTask).getTime()
    )

  const handleAddTaskClick = () => {
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
    const day = String(selectedDate.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`

    setCurrentTask({
      dataCreazioneTask: formattedDate,
      titolo: "",
      descrizione: "",
      tipoTask: "DA_FARE",
    })
    setShowModal(true)
  }

  const handleEditTaskClick = (task: ToDo) => {
    setCurrentTask(task)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCurrentTask(null)
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!currentTask) return
    setCurrentTask({ ...currentTask, [e.target.name]: e.target.value })
  }

  const handleSaveTask = async () => {
    if (!currentTask?.titolo || !currentTask?.dataCreazioneTask) {
      alert("Titolo e data sono obbligatori")
      return
    }

    try {
      const method = currentTask.id ? "PUT" : "POST"
      const url = currentTask.id
        ? `${import.meta.env.VITE_API_URL}/tasks/${currentTask.id}`
        : `${import.meta.env.VITE_API_URL}/tasks`

      const formattedTask = {
        ...currentTask,
        dataCreazioneTask: new Date(currentTask.dataCreazioneTask)
          .toISOString()
          .slice(0, 10),
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedTask),
      })

      if (!res.ok)
        throw new Error(
          "Errore nel salvataggio del task 😥. Rilassati e riprova o contatta l'assistenza 🌿"
        )
      const savedTask = await res.json()

      setTasks((prev) =>
        method === "POST"
          ? [...prev, savedTask]
          : prev.map((t) => (t.id === savedTask.id ? savedTask : t))
      )
      handleCloseModal()
    } catch (error) {
      alert("Errore durante il salvataggio 😥.")
      console.error(error)
    }
  }

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo task?")) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok)
        throw new Error(
          "Errore durante eliminazione task 😥. Rilassati e riprova o contatta l'assistenza 🌿"
        )
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      alert("Errore durante l'eliminazione 😥.")
      console.error(error)
    }
  }

  return (
    <Container role="main">
      <h1 className="text-center mynav text-white py-3 mt-5 rounded">
        To Do List - Calendario
      </h1>
      <Row className="justify-content-center my-5 g-3">
        <Col sm={12} lg={6} className="d-flex flex-column align-items-center">
          <Calendar
            onChange={(date) => {
              if (!date) return
              const d = Array.isArray(date) ? date[0] : date
              if (d instanceof Date) setSelectedDate(d)
            }}
            value={selectedDate}
            locale="it-IT"
            calendarType="iso8601"
          />
          <Button
            variant="success"
            className="my-3"
            onClick={handleAddTaskClick}
            aria-label={`Aggiungi un nuovo task per il ${selectedDate.toLocaleDateString(
              "it-IT"
            )}`}
          >
            + Aggiungi task per il {selectedDate.toLocaleDateString("it-IT")}
          </Button>
        </Col>

        <Col sm={12} lg={6} className="text-white mynav rounded px-3">
          {loading && (
            <div className="text-center py-3" role="status" aria-live="polite">
              <Spinner animation="border" variant="success" />
              <span className="visually-hidden">Caricamento...</span>
            </div>
          )}
          {error && (
            <Alert variant="danger" role="alert">
              {error}
            </Alert>
          )}

          <h2 className="pt-3">
            Task del {selectedDate.toLocaleDateString("it-IT")}
          </h2>
          {tasksOfDay.length > 0 ? (
            tasksOfDay.map((task) => (
              <Card key={task.id} className="mb-2 text-dark">
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between">
                    {task.titolo}
                    <div>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleEditTaskClick(task)}
                        className="me-2"
                        aria-label={`Modifica il task ${task.titolo}`}
                      >
                        ✏️
                      </Button>
                      <Button
                        aria-label={`Elimina il task ${task.titolo}`}
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </Card.Title>
                  <Card.Text>{task.descrizione}</Card.Text>
                  <Card.Text className="text-muted">
                    Stato: <strong>{labelTipoTask(task.tipoTask)}</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p aria-live="polite">Nessun task per questa data.</p>
          )}

          {upcomingTasksOfMonth.length > 0 && (
            <>
              <h3 className="mt-4 fs-4">Prossimi task del mese</h3>
              {upcomingTasksOfMonth.map((task) => (
                <Card key={task.id} className="mb-2 text-dark">
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between">
                      {task.titolo}{" "}
                      <div>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleEditTaskClick(task)}
                          className="me-2"
                          aria-label={`Modifica il task ${task.titolo}`}
                        >
                          ✏️
                        </Button>
                        <Button
                          aria-label={`Elimina il task ${task.titolo}`}
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          🗑️
                        </Button>
                      </div>
                    </Card.Title>
                    <Card.Text>{task.descrizione}</Card.Text>
                    <Card.Text className="text-muted fs-5">
                      {new Date(task.dataCreazioneTask).toLocaleDateString(
                        "it-IT"
                      )}{" "}
                      – <strong>{labelTipoTask(task.tipoTask)}</strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </>
          )}
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        aria-labelledby="modal-titolo"
        aria-describedby="modal-descrizione"
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal-titolo">
            {currentTask?.id ? "Modifica task" : "Aggiungi nuovo task"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span id="modal-descrizione" className="visually-hidden">
            Compila il modulo per creare o modificare un task.
          </span>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                name="titolo"
                value={currentTask?.titolo || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                name="descrizione"
                rows={3}
                value={currentTask?.descrizione || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo Task</Form.Label>
              <Form.Select
                name="tipoTask"
                aria-label="Seleziona lo stato del task"
                value={currentTask?.tipoTask || "DA_FARE"}
                onChange={handleChange}
              >
                {tipiTask.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                name="dataCreazioneTask"
                value={
                  currentTask
                    ? new Date(currentTask.dataCreazioneTask)
                        .toISOString()
                        .slice(0, 10)
                    : ""
                }
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            aria-label="Annulla la modifica al task"
          >
            Annulla
          </Button>
          <Button
            variant="success"
            onClick={handleSaveTask}
            aria-label="Salva la modifica al task"
          >
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ToDoList
