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
          "http://localhost:8080/tasks?page=0&size=5&sort=dataCreazioneTask,desc",
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

  if (loading) return <Spinner animation="border" variant="primary" />
  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <Card className="mb-3 p-3 shadow-sm  mynav text-white">
      <Card.Title>Ultimi Task in calendario</Card.Title>
      {tasks.length === 0 ? (
        <p>Nessun task salvato.</p>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} className="mt-3 mb-2 p-2 fs-5">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{task.titolo}</strong> <br />
                <small className="text-muted">
                  {new Date(task.dataCreazioneTask).toLocaleDateString("it-IT")}{" "}
                  - <strong>{labelTipoTask(task.tipoTask)}</strong>
                </small>
              </div>
            </div>
          </Card>
        ))
      )}
      <div className="text-end mt-2">
        <Button variant="success" onClick={() => navigate("/todolist")}>
          Vai al calendario
        </Button>
      </div>
    </Card>
  )
}

export default UltimiTask
