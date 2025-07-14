import { useEffect, useState } from "react"
import { Table, Button, Spinner, Form, Col, Alert } from "react-bootstrap"

interface BackOfficeUser {
  id: number
  username: string
  ruolo: "USER" | "ADMIN"
  dataRegistrazione: string
  lastAccess: string
  attivo: boolean
}

interface Props {
  token: string
  myId: number
}

const UserListComponent = ({ token, myId }: Props) => {
  const [utenti, setUtenti] = useState<BackOfficeUser[]>([])
  const [loading, setLoading] = useState(true)
  const [errore, setErrore] = useState("")

  useEffect(() => {
    fetch("http://localhost:8080/backoffice", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUtenti(data.content))
      .catch(() => setErrore("Errore nel caricamento utenti"))
      .finally(() => setLoading(false))
  }, [token])

  const cambiaRuolo = async (id: number, nuovoRuolo: string) => {
    try {
      await fetch(
        `http://localhost:8080/backoffice/${id}/ruolo?nuovoRuolo=${nuovoRuolo}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setUtenti((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, ruolo: nuovoRuolo as "USER" | "ADMIN" } : u
        )
      )
    } catch {
      alert("Errore durante il cambio ruolo")
    }
  }

  const toggleAttivo = async (id: number, attivo: boolean) => {
    try {
      await fetch(
        `http://localhost:8080/backoffice/${id}/attivo?attivo=${!attivo}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setUtenti((prev) =>
        prev.map((u) => (u.id === id ? { ...u, attivo: !attivo } : u))
      )
    } catch {
      alert("Errore durante la modifica dello stato attivo")
    }
  }

  const formatData = (dataIso: string) =>
    new Date(dataIso).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  if (loading)
    return (
      <div className="text-center py-3" role="status" aria-live="polite">
        <Spinner animation="border" variant="success" />
        <span className="visually-hidden">Caricamento...</span>
      </div>
    )
  if (errore)
    return (
      <Alert className="text-danger" role="alert">
        {errore}
      </Alert>
    )

  return (
    <Col sm={12}>
      <h3 className="mb-4 ">
        <span className="mynav rounded text-white p-2">Gestione Utenti</span>
      </h3>
      <Table striped bordered hover responsive className="rounded">
        <thead className="table-success">
          <tr>
            <th>Username</th>
            <th>Ruolo</th>
            <th>Registrato il</th>
            <th>Ultimo accesso</th>
            <th>Stato</th>
            <th>Cambia stato</th>
          </tr>
        </thead>
        <tbody>
          {utenti.map((utente) => (
            <tr key={utente.id}>
              <td>{utente.username}</td>
              <td>
                <Form.Select
                  className="me-5"
                  value={utente.ruolo}
                  onChange={(e) => cambiaRuolo(utente.id, e.target.value)}
                  disabled={utente.id === myId}
                  aria-label={`Cambia ruolo per ${utente.username}`}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </Form.Select>
              </td>
              <td>{formatData(utente.dataRegistrazione)}</td>
              <td>
                {utente.lastAccess ? formatData(utente.lastAccess) : "Mai"}
              </td>
              <td>
                <span
                  className={`badge fs-6 ${
                    utente.attivo ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {utente.attivo ? "Attivo" : "Inattivo"}
                </span>
              </td>
              <td>
                <Button
                  variant={utente.attivo ? "outline-danger" : "outline-success"}
                  size="sm"
                  onClick={() => toggleAttivo(utente.id, utente.attivo)}
                  aria-label={`${
                    utente.attivo ? "Disattiva" : "Attiva"
                  } utente ${utente.username}`}
                >
                  {utente.attivo ? "Disattiva" : "Attiva"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Col>
  )
}

export default UserListComponent
