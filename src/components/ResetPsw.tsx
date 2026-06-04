import { useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import AuthFrame from "./common/AuthFrame"
import StatusAlert from "./common/StatusAlert"

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
        "Token mancante. Ricarica la pagina dal link ricevuto via email.",
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
              "Errore durante il reset password 😥. Rilassati e riprova o contatta l'assistenza 🌿",
          )
        }
        setSuccess(
          "Password resettata con successo 🥳! Ora verrai reindirizzato al login...",
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
    <AuthFrame
      title="Imposta una nuova password"
      subtitle={
        <p className="mb-0">
          Scegli una password nuova e confermala per completare il reset.
        </p>
      }
    >
      <h1 className="visually-hidden">Reset della password</h1>
      {error && <StatusAlert message={error} variant="danger" />}
      {success && <StatusAlert message={success} variant="success" />}

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
              className="jb-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Nascondi password" : "Mostra password"
              }
            >
              <i
                className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}
                aria-hidden="true"
              />
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
              className="jb-password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Nascondi password" : "Mostra password"
              }
            >
              <i
                className={
                  showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"
                }
                aria-hidden="true"
              />
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
              <span className="jb-inline-skeleton me-2" aria-hidden="true" />
              Caricamento...
            </div>
          ) : (
            "Reset Password"
          )}
        </Button>
      </Form>
    </AuthFrame>
  )
}

export default ResetPsw
