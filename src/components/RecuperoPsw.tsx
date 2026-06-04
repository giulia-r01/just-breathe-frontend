import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button } from "react-bootstrap"
import AuthFrame from "./common/AuthFrame"
import StatusAlert from "./common/StatusAlert"

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
        `${import.meta.env.VITE_API_URL}/auth/password/recupero`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      )

      if (!response.ok) {
        const data = await response.text()
        setError(
          data ||
            "Errore durante il recupero password 😥. Rilassati e riprova o contatta l'assistenza 🌿",
        )
      } else {
        setSuccess(
          "Abbiamo inviato le istruzioni per il recupero password alla tua mail, se non la trovi, controlla nella cartella spam",
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
    <AuthFrame
      title="Recupera password"
      subtitle={
        <p className="mb-0">
          Inserisci la tua email: ti inviamo le istruzioni per reimpostare
          l’accesso.
        </p>
      }
    >
      <h1 className="visually-hidden">Recupero password</h1>
      {error && <StatusAlert message={error} variant="danger" />}
      {success && <StatusAlert message={success} variant="success" />}

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
          <small id="emailHelp" className="form-text profile-subtitle">
            Riceverai un'email con le istruzioni per il recupero
          </small>
        </div>

        <Button
          type="submit"
          className="w-100 d-flex justify-content-center align-items-center"
          disabled={loading}
          variant="success"
          aria-label="Invia email per recupero password"
        >
          {loading ? (
            <div role="status" aria-live="polite">
              <span className="jb-inline-skeleton me-2" aria-hidden="true" />
              Invio in corso...
            </div>
          ) : (
            "Invia"
          )}
        </Button>
      </form>
    </AuthFrame>
  )
}

export default RecuperoPsw
