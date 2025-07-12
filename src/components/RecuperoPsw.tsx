import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button, Col, Container, Row, Spinner } from "react-bootstrap"

const RecuperoPsw = function () {
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch(
        "http://localhost:8080/auth/password/recupero",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      )

      if (!response.ok) {
        const data = await response.text()
        setError(data || "Errore durante il recupero password")
      } else {
        setSuccess(
          "Abbiamo inviato le istruzioni per il recupero password alla tua mail, se non la trovi, controlla nella cartella spam"
        )
        setEmail("")
      }
    } catch (err) {
      console.log(err)
      setError("Errore di rete o server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="container mt-4">
      <Row className="justify-content-center px-4">
        <Col md={6} lg={4} className="mynav py-3 my-4 rounded text-white">
          <h1 className="visually-hidden">Recupero password</h1>
          <h2>Recupera Password</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="email" className="form-label">
                Inserisci la tua email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={email}
                onChange={handleChange}
                required
                aria-describedby="emailHelp"
                disabled={loading}
              />
              <small id="emailHelp" className="form-text text-light">
                Riceverai un'email con le istruzioni per il recupero
              </small>
            </div>

            <Button
              type="submit"
              className=" w-100 d-flex justify-content-center align-items-center"
              disabled={loading}
              variant="success"
              aria-label="Invia email per recupero password"
            >
              {loading ? (
                <div role="status" aria-live="polite">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Invio in corso...
                </div>
              ) : (
                "Invia"
              )}
            </Button>
          </form>
        </Col>
      </Row>
    </Container>
  )
}

export default RecuperoPsw
