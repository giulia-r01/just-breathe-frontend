interface RegisterFormData {
  nome: string
  cognome: string
  username: string
  email: string
  password: string
}

import { useState } from "react"
import { Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import AuthFrame from "./common/AuthFrame"
import StatusAlert from "./common/StatusAlert"

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
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      )

      if (!response.ok) {
        const data = await response.json()
        setError(
          data.message ||
            "Errore durante la registrazione 😥. Rilassati e riprova o contatta l'assistenza 🌿",
        )
      } else {
        setSuccess("Registrazione avvenuta con successo 🥳!")
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
    <AuthFrame
      title="Registrati"
      subtitle={
        <p className="mb-0">
          Crea il tuo account e inizia il tuo percorso di benessere digitale.
          <br />
          <Link to="/login" className="jb-footer-link" aria-label="Accedi">
            Hai già un account? Accedi
          </Link>
        </p>
      }
    >
      <h1 className="visually-hidden">Pagina di registrazione</h1>
      {error && <StatusAlert message={error} variant="danger" />}
      {success && <StatusAlert message={success} variant="success" />}

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
            placeholder="Digita il tuo nome"
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
            placeholder="Digita il tuo cognome"
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
            placeholder="Digita il tuo username"
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
            placeholder="Digita la tua mail"
          />
        </div>

        <div className="mb-5">
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
              placeholder="Digita la password: min 6 caratteri"
            />
            <button
              type="button"
              className="btn btn-success jb-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword ? "Nascondi password" : "Mostra password"
              }
              tabIndex={-1}
            >
              <i
                className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="success"
          disabled={loading}
          className="w-100"
        >
          {loading ? (
            <>
              <span className="jb-inline-skeleton me-2" aria-hidden="true" />
              Caricamento...
            </>
          ) : (
            "Registrati"
          )}
        </Button>
      </form>
    </AuthFrame>
  )
}

export default Register
