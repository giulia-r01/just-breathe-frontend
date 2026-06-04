import React, { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { SESSION_EXPIRED_MESSAGE_KEY } from "../utils/authInterceptor"
import AuthFrame from "./common/AuthFrame"
import StatusAlert from "./common/StatusAlert"

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

  useEffect(() => {
    const expiredMessage = sessionStorage.getItem(SESSION_EXPIRED_MESSAGE_KEY)
    if (!expiredMessage) return

    setError(expiredMessage)
    sessionStorage.removeItem(SESSION_EXPIRED_MESSAGE_KEY)
  }, [])

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
        },
      )

      if (!response.ok) {
        const data = await response.json()
        setError(
          data.message ||
            "Credenziali non valide. Rilassati, riprova o resetta la tua password cliccando sul link 'Hai scordato la tua password?' 🌿",
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
          },
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
    <AuthFrame
      title="Login"
      subtitle={
        <p className="mb-0">
          Accedi al tuo spazio personale e riprendi da dove hai lasciato.
        </p>
      }
    >
      {error && <StatusAlert message={error} variant="danger" />}
      {success && <StatusAlert message={success} variant="success" />}

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
            placeholder="Inserisci il tuo username"
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
              placeholder="Inserisci la tua password"
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
        <p className="text-center">
          <Link
            to="/auth/password/recupero"
            className="jb-footer-link"
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
              <span className="jb-inline-skeleton me-2" aria-hidden="true" />
              Caricamento...
            </>
          ) : (
            "Accedi"
          )}
        </Button>
      </form>
    </AuthFrame>
  )
}

export default Login
