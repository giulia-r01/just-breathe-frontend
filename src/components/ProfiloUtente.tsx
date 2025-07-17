import { useEffect, useState } from "react"
import {
  Alert,
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
import { FaEye, FaEyeSlash } from "react-icons/fa"

interface Utente {
  id: number
  nome?: string
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
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)

  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfilo = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/utenti/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setUtente(data)
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/utenti/${utente.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )
      if (res.ok) {
        const updatedUser = await res.json()
        setSuccess("Immagine aggiornata con successo 🥳")
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
        `${import.meta.env.VITE_API_URL}/utenti/${
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
        setSuccess("Username aggiornato con successo 🥳")
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
          setError(
            "Errore durante l'aggiornamento dello username 😥. Rilassati e riprova o contatta l'assistenza 🌿"
          )
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
        `${import.meta.env.VITE_API_URL}/utenti/${
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
        setSuccess("Password aggiornata con successo 🥳")
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
          setError(
            "Errore durante l'aggiornamento della password 😥. Rilassati e riprova o contatta l'assistenza 🌿"
          )
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/utenti/${utente.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.ok) {
        setSuccess("Utente eliminato con successo 🥳")
        setError("")
        localStorage.removeItem("token")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    } catch (err) {
      setError(
        "Errore nell'eliminazione dell'utente 😥. Rilassati e riprova o contatta l'assistenza 🌿"
      )
      console.error("Errore eliminazione account:", err)
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-5" role="status" aria-live="polite">
        <Spinner animation="border" variant="success" />
        <span className="visually-hidden">Caricamento...</span>
      </div>
    )
  }

  return (
    <Container className="py-5" role="main">
      <h1 className="visually-hidden">Profilo utente</h1>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="p-4 mynav text-white">
            <div className="text-center">
              <h2 className="text-white text-start">{utente?.nome}</h2>
              <h3 className="fs-5 text-white text-start">
                Modifica il tuo profilo
              </h3>
              <img
                src={utente?.imgProfilo || "/user.svg"}
                alt={`Immagine del profilo di ${utente?.nome ?? "utente"}`}
                className="rounded-circle mb-3 imgProfilo"
              />

              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError("")}
                  role="alert"
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setSuccess("")}
                  role="alert"
                >
                  {success}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label
                  htmlFor="fileInputControl"
                  className="btn btn-outline-light btn-sm"
                >
                  <FaCamera className="me-2" /> Cambia immagine
                </Form.Label>
                <Form.Control
                  type="file"
                  id="fileInputControl"
                  className="d-none"
                  onChange={(e) => {
                    const input = e.target as HTMLInputElement
                    if (input.files && input.files.length > 0) {
                      setFile(input.files[0])
                    }
                  }}
                />
              </Form.Group>

              <Button
                variant="success"
                size="sm"
                onClick={handleUpload}
                aria-label="Salva la nuova immagine del profilo"
              >
                Salva la nuova immagine del profilo
              </Button>
            </div>

            <Form className="mt-4" autoComplete="off">
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  autoComplete="new-username"
                  value={nuovoUsername}
                  placeholder="Digita il nuovo username"
                  onChange={(e) => setNuovoUsername(e.target.value)}
                />
                <Button
                  variant="success"
                  className="mt-2"
                  onClick={handleUsernameChange}
                  aria-label="Aggiorna Username"
                >
                  Aggiorna Username
                </Button>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Vecchia Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showOldPassword ? "text" : "password"}
                    autoComplete="off"
                    value={vecchiaPassword}
                    placeholder="Digita la tua vecchia password"
                    onChange={(e) => setVecchiaPassword(e.target.value)}
                  />
                  <Button
                    variant="success"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    tabIndex={-1}
                    aria-label={
                      showOldPassword ? "Nascondi password" : "Mostra password"
                    }
                  >
                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nuova Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={nuovaPassword}
                    placeholder="Digita la tua nuova password"
                    onChange={(e) => setNuovaPassword(e.target.value)}
                  />
                  <Button
                    variant="success"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                    aria-label={
                      showNewPassword ? "Nascondi password" : "Mostra password"
                    }
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
                <Button
                  variant="success"
                  className="mt-2"
                  onClick={handlePasswordChange}
                  aria-label="Aggiorna Password"
                >
                  Aggiorna Password
                </Button>
              </Form.Group>

              <div className="text-center mt-4">
                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                  aria-label="Elimina il mio account"
                >
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
