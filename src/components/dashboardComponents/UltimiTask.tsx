import { useEffect, useState } from "react"
import { Alert, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import DashboardCard from "./DashboardCard"
import DashboardSkeleton from "./DashboardSkeleton"
import { apiFetch } from "../../utils/api"
import { getSessionToken } from "../../utils/session"

interface ToDo {
  id: number
  titolo: string
  tipoTask: string
  dataCreazioneTask: string
}

interface UltimiTaskProps {
  escludiFatti?: boolean
}

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

const UltimiTask = ({ escludiFatti = false }: UltimiTaskProps) => {
  const [tasks, setTasks] = useState<ToDo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const token = getSessionToken()
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()

    const fetchUltimiTasks = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await apiFetch("/tasks", {
          auth: true,
          token,
          signal: controller.signal,
        })
        if (!res.ok) throw new Error("Errore nel caricamento degli ultimi task")
        const data = await res.json()
        const source = data.content || data
        const filteredTasks = escludiFatti
          ? source.filter((task: ToDo) => task.tipoTask !== "FATTO")
          : source

        setTasks(filteredTasks.slice(0, 3))
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Impossibile caricare gli ultimi task")
        }
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchUltimiTasks()

    return () => controller.abort()
  }, [token, escludiFatti])

  if (loading) {
    return (
      <DashboardSkeleton
        title="Ultime Task in calendario"
        iconClassName="bi bi-calendar3"
        lines={4}
      />
    )
  }

  if (error) {
    return (
      <Alert variant="danger" role="alert">
        {error}
      </Alert>
    )
  }

  return (
    <DashboardCard
      title="Ultime Task in calendario"
      iconClassName="bi bi-calendar3"
      footer={
        <Button
          className="dashboard-cta"
          onClick={() => navigate("/todolist")}
          aria-label="Aggiungi task - Vai al calendario"
        >
          <i className="bi bi-plus-lg" aria-hidden="true" /> Aggiungi task
        </Button>
      }
    >
      {tasks.length === 0 ? (
        <p className="mb-0" role="status">
          Nessun task da fare o in corso.
        </p>
      ) : (
        <ul
          className="dashboard-task-list"
          aria-label="Lista degli ultimi task in calendario"
        >
          {tasks.map((task) => (
            <li key={task.id} className="dashboard-task-item">
              <i
                className="bi bi-list-task dashboard-task-icon"
                aria-hidden="true"
              />
              <span>
                {task.titolo}
                <small className="d-block text-muted">
                  {new Date(task.dataCreazioneTask).toLocaleDateString("it-IT")}{" "}
                  - <strong>{labelTipoTask(task.tipoTask)}</strong>
                </small>
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  )
}

export default UltimiTask
