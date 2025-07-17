import { useEffect, useState } from "react"
import {
  Alert,
  Button,
  Col,
  Container,
  Row,
  Spinner,
  Form,
} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const ResetPsw = function () {
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get("token") || ""
    console.log("Token ricevuto:", t)
    setToken(t)
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!password || !confirmPassword) {
      setError("Entrambi i campi password sono obbligatori")
      return
    }

    if (password !== confirmPassword) {
      setError("Le password non coincidono")
      return
    }

    if (!token) {
      setError(
        "Token mancante. Ricarica la pagina dal link ricevuto via email."
      )
      return
    }

    setLoading(true)

    fetch(`${import.meta.env.VITE_API_URL}/auth/password/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, nuovaPassword: password }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(
            text ||
              "Errore durante il reset password 😥. Rilassati e riprova o contatta l'assistenza 🌿"
          )
        }
        setSuccess(
          "Password resettata con successo 🥳! Ora verrai reindirizzato al login..."
        )
        setPassword("")
        setConfirmPassword("")

        setTimeout(() => {
          navigate("/login")
        }, 3000)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} lg={4} className="mynav py-3 my-4 rounded text-white">
          <h1 className="visually-hidden">Reset della password</h1>
          <h2 className="pb-2">Imposta una nuova password</h2>

          {error && (
            <div role="alert">
              <Alert variant="danger">{error}</Alert>
            </div>
          )}
          {success && (
            <div role="alert">
              <Alert variant="success">{success}</Alert>
            </div>
          )}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Nuova password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
                <Button
                  variant="success"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Nascondi password" : "Mostra password"
                  }
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Conferma nuova password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
                <Button
                  variant="success"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Nascondi password"
                      : "Mostra password"
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </Form.Group>

            <Button
              type="submit"
              variant="success"
              className="w-100 d-flex justify-content-center align-items-center"
              disabled={loading}
              aria-label="Reset Password"
            >
              {loading ? (
                <div role="status" aria-live="polite">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Caricamento...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default ResetPsw
