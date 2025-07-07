interface RegisterFormData {
  nome: string
  cognome: string
  username: string
  email: string
  password: string
}

import { useState } from "react"
import { Col, Container, Row, Spinner } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

const Register = function () {
  const [formData, setFormData] = useState<RegisterFormData>({
    nome: "",
    cognome: "",
    username: "",
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || "Errore durante la registrazione")
      } else {
        setSuccess("Registrazione avvenuta con successo!")
        setFormData({
          nome: "",
          cognome: "",
          username: "",
          email: "",
          password: "",
        })
        setTimeout(() => {
          navigate("/login")
        }, 1000)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message)
      } else {
        console.error(err)
      }
      setError("Errore di rete o server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="container mt-4">
      <Row className="justify-content-center px-4">
        <Col md={6} lg={4} className="mynav py-3 my-4 rounded text-white">
          <h2>Registrati</h2>
          <p className="text-white pt-2">
            Hai già un account?
            <br />
            <Link to="/login" className="text-white" aria-label="Accedi">
              Accedi
            </Link>
          </p>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                className="form-control"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cognome" className="form-label">
                Cognome
              </label>
              <input
                type="text"
                id="cognome"
                name="cognome"
                className="form-control"
                value={formData.cognome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="new-username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-outline-success w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                    aria-hidden="true"
                  />
                  Caricamento...
                </>
              ) : (
                "Registrati"
              )}
            </button>
          </form>
        </Col>
      </Row>
    </Container>
  )
}

export default Register
