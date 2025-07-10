import { useEffect, useState } from "react"
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { FaCamera, FaTrashAlt } from "react-icons/fa"

interface Utente {
  id: number
  username: string
  imgProfilo?: string
}

const ProfiloUtente = () => {
  const [utente, setUtente] = useState<Utente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [nuovoUsername, setNuovoUsername] = useState("")
  const [vecchiaPassword, setVecchiaPassword] = useState("")
  const [nuovaPassword, setNuovaPassword] = useState("")

  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfilo = async () => {
      try {
        const res = await fetch("http://localhost:8080/utenti/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setUtente(data)
          setNuovoUsername(data.username)
        }
      } catch (err) {
        console.error("Errore nel recupero profilo:", err)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchProfilo()
  }, [token])

  const handleUpload = async () => {
    setError("")
    setSuccess("")
    if (!file || !utente) return
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`http://localhost:8080/utenti/${utente.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      if (res.ok) {
        const updatedUser = await res.json()
        setSuccess("Immagine aggiornata con successo")
        localStorage.setItem("imgProfilo", updatedUser.imgProfilo || "user.svg")
        setTimeout(() => window.location.reload(), 1000)
      } else {
        const errorText = await res.text()
        setError("Errore durante l'aggiornamento dell'immagine: " + errorText)
      }
    } catch (err) {
      console.error("Errore aggiornamento immagine:", err)
      setError("Errore di rete: " + (err as Error).message)
    }
  }

  const handleUsernameChange = async () => {
    setError("")
    setSuccess("")
    if (!utente || !nuovoUsername.trim()) return
    try {
      const res = await fetch(
        `http://localhost:8080/utenti/${
          utente.id
        }/username?nuovoUsername=${encodeURIComponent(nuovoUsername)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.ok) {
        setSuccess("Username aggiornato con successo")
        localStorage.removeItem("token")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        const errorText = await res.text()

        if (res.status === 400 && errorText.includes("già stato utilizzato")) {
          setError("Questo username è già stato utilizzato.")
        } else if (errorText.includes("diverso")) {
          setError("Il nuovo username deve essere diverso dal precedente.")
        } else {
          setError("Errore durante l'aggiornamento dello username.")
        }
      }
    } catch (err) {
      alert("Errore di rete: " + (err as Error).message)
    }
  }

  const handlePasswordChange = async () => {
    setError("")
    setSuccess("")
    if (!utente || !vecchiaPassword || !nuovaPassword) return
    try {
      const res = await fetch(
        `http://localhost:8080/utenti/${
          utente.id
        }/password?vecchiaPassword=${encodeURIComponent(
          vecchiaPassword
        )}&nuovaPassword=${encodeURIComponent(nuovaPassword)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.ok) {
        setSuccess("Password aggiornata con successo")
        setVecchiaPassword("")
        setNuovaPassword("")
        localStorage.removeItem("token")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        const errorText = await res.text()
        if (res.status === 400 && errorText.includes("vecchia password")) {
          setError("La vecchia password non è corretta.")
        } else if (res.status === 400 && errorText.includes("nuova password")) {
          setError("La nuova password deve essere diversa dalla precedente.")
        } else {
          setError("Errore durante l'aggiornamento della password.")
        }
      }
    } catch (err) {
      console.error("Errore password:", err)
      alert("Errore di rete: " + (err as Error).message)
    }
  }

  const handleDeleteAccount = async () => {
    setError("")
    setSuccess("")
    if (!utente) return
    if (
      !window.confirm(
        "Sei sicuro di voler eliminare il tuo account? L'azione è irreversibile."
      )
    )
      return
    try {
      const res = await fetch(`http://localhost:8080/utenti/${utente.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        setSuccess("Utente eliminato con successo")
        setError("")
        localStorage.removeItem("token")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    } catch (err) {
      setError("Errore nell'eliminazione dell'utente")
      console.error("Errore eliminazione account:", err)
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="success" />
      </div>
    )
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="p-4 mynav text-white">
            <div className="text-center">
              <img
                src={utente?.imgProfilo || "user.svg"}
                alt="Profilo"
                className="rounded-circle mb-3 imgProfilo"
              />

              {error && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError("")}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              {success && (
                <div
                  className="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  {success}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccess("")}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label className="btn btn-outline-light btn-sm">
                  <FaCamera className="me-2" /> Cambia immagine
                  <Form.Control
                    type="file"
                    hidden
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement
                      if (target.files && target.files.length > 0) {
                        setFile(target.files[0])
                      }
                    }}
                  />
                </Form.Label>
              </Form.Group>
              <Button variant="success" size="sm" onClick={handleUpload}>
                Carica
              </Button>
            </div>

            <Form className="mt-4" autoComplete="off">
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  autoComplete="new-username"
                  value={nuovoUsername}
                  onChange={(e) => setNuovoUsername(e.target.value)}
                />
                <Button
                  variant="success"
                  className="mt-2"
                  onClick={handleUsernameChange}
                >
                  Aggiorna Username
                </Button>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Vecchia Password</Form.Label>
                <Form.Control
                  type="password"
                  autoComplete="new-password"
                  value={vecchiaPassword}
                  onChange={(e) => setVecchiaPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nuova Password</Form.Label>
                <Form.Control
                  type="password"
                  autoComplete="new-password"
                  value={nuovaPassword}
                  onChange={(e) => setNuovaPassword(e.target.value)}
                />
                <Button
                  variant="success"
                  className="mt-2"
                  onClick={handlePasswordChange}
                >
                  Aggiorna Password
                </Button>
              </Form.Group>

              <div className="text-center mt-4">
                <Button variant="danger" onClick={handleDeleteAccount}>
                  <FaTrashAlt className="me-2" /> Elimina il mio account
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ProfiloUtente
