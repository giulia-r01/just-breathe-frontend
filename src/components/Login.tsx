import React, { useState } from "react"
import { Spinner, Container, Row, Col, Button } from "react-bootstrap"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"

interface LoginFormData {
  username: string
  password: string
}

const Login = function () {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        setError(
          data.message ||
            "Credenziali non valide. Rilassati, riprova o resetta la tua password cliccando sul link 'Hai scordato la tua password?' 🌿"
        )
      } else {
        const data = await response.json()
        localStorage.setItem("token", data.token)
        localStorage.setItem("ruolo", data.ruolo)

        const profiloRes = await fetch(
          `${import.meta.env.VITE_API_URL}/utenti/me`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        )

        if (profiloRes.ok) {
          const utente = await profiloRes.json()
          localStorage.setItem("imgProfilo", utente.imgProfilo || "user.svg")
          localStorage.setItem("userId", utente.id.toString())
        } else {
          localStorage.setItem("imgProfilo", "user.svg")
        }

        setSuccess("Login effettuato con successo! 🥳")
        setTimeout(() => navigate("/index"), 1500)
      }
    } catch (err: unknown) {
      console.error(err)
      setError("Errore di rete o server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="container mt-4" role="main">
      <Row className="justify-content-center px-4">
        <Col md={6} lg={4} className="mynav py-3 my-4 rounded text-white">
          <h1>Login</h1>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                autoComplete="new-username"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Nascondi password" : "Mostra password"
                  }
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <p className="text-center text-white">
              <Link
                to="/auth/password/recupero"
                className="text-white"
                aria-label="Hai scordato la tua password? - Recupera la password dimenticata"
              >
                Hai scordato la tua password?
              </Link>
            </p>
            <Button
              type="submit"
              className="w-100 d-flex justify-content-center align-items-center"
              disabled={loading}
              variant="success"
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
                "Accedi"
              )}
            </Button>
          </form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
