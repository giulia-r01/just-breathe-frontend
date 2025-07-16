/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react"
import { Card, Spinner, Alert, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

interface ToDo {
  id: number
  titolo: string
  tipoTask: string
  dataCreazioneTask: string
}

interface UltimiTaskProps {
  escludiFatti?: boolean
}

const UltimiTask = ({ escludiFatti = false }: UltimiTaskProps) => {
  const [tasks, setTasks] = useState<ToDo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

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
    const fetchUltimiTasks = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/tasks?page=0&size=5&sort=dataCreazioneTask,desc`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (!res.ok) throw new Error("Errore nel caricamento degli ultimi task")
        const data = await res.json()
        const filteredTasks = escludiFatti
          ? (data.content || data).filter(
              (task: ToDo) => task.tipoTask !== "FATTO"
            )
          : data.content || data
        setTasks(filteredTasks)
      } catch (err) {
        console.log(err)
        setError("Impossibile caricare gli ultimi task")
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchUltimiTasks()
  }, [token])

  if (loading)
    return (
      <div className="text-center py-3" role="status" aria-live="polite">
        <Spinner animation="border" variant="success" />
        <span className="visually-hidden">Caricamento...</span>
      </div>
    )
  if (error)
    return (
      <Alert variant="danger" role="alert">
        {error}
      </Alert>
    )

  return (
    <Card className="mb-3 p-3 shadow-sm mynav text-white">
      <Card.Title as="h4">Ultimi Task in calendario</Card.Title>

      {tasks.length === 0 ? (
        <p role="alert">Nessun task salvato.</p>
      ) : (
        <div
          role="list"
          aria-live="polite"
          aria-label="Lista degli ultimi task in calendario"
        >
          {tasks.map((task) => (
            <Card.Body
              key={task.id}
              className="mt-3 mb-2 p-2 fs-5 bg-white text-dark rounded"
              role="listitem"
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{task.titolo}</strong> <br />
                  <small className="text-muted">
                    {new Date(task.dataCreazioneTask).toLocaleDateString(
                      "it-IT"
                    )}{" "}
                    - <strong>{labelTipoTask(task.tipoTask)}</strong>
                  </small>
                </div>
              </div>
            </Card.Body>
          ))}
        </div>
      )}

      <div className="text-end mt-2">
        <Button
          variant="success"
          onClick={() => navigate("/todolist")}
          aria-label="Vai al calendario - vai alla sezione ToDoList Calendario"
        >
          Vai al calendario
        </Button>
      </div>
    </Card>
  )
}

export default UltimiTask
