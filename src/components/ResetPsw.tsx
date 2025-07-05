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

const ResetPsw = function () {
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
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

    fetch("http://localhost:8080/auth/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, nuovaPassword: password }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || "Errore durante il reset password")
        }
        setSuccess(
          "Password resettata con successo! Ora verrai reindirizzato al login..."
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
          <h2>Reset Password</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Nuova password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Conferma nuova password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="outline-success"
              className="w-100 d-flex justify-content-center align-items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Caricamento...
                </>
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
