import { Container, Row, Col } from "react-bootstrap"

const PrivacyPolicy = function () {
  return (
    <Container role="main">
      <h1 className="visually-hidden">Privacy Policy</h1>
      <Row className="justify-content-center mx-1">
        <Col md={8} className="text-white mynav rounded py-4 my-4">
          <h2 className="text-center pb-3">La tua privacy conta</h2>

          <p>
            Just Breathe tiene alla tua privacy e si impegna a proteggere i tuoi
            dati personali in modo trasparente e responsabile.
          </p>

          <p>
            I contenuti che salvi all’interno dell’app — come pensieri nel
            diario, mood giornalieri, to-do list o preferenze musicali —{" "}
            <strong>rimangono strettamente privati</strong>. Non vengono letti,
            analizzati né condivisi con terze parti.
          </p>

          <p>
            L’app raccoglie alcune informazioni di utilizzo (come accessi,
            frequenza di attività o inattività, data di registrazione, ultima
            connessione) esclusivamente per motivi statistici e di funzionamento
            tecnico. Questi dati possono essere visualizzati dagli
            amministratori dell’app per garantire un uso corretto della
            piattaforma.
          </p>

          <p>
            In casi specifici e documentati, l’amministrazione può intervenire
            per sospendere o disattivare un account, ad esempio in caso di
            violazioni dei termini d’uso o per garantire la sicurezza del
            servizio.
          </p>

          <p>
            I tuoi dati di accesso (es. email, nome utente) vengono trattati nel
            rispetto della normativa vigente, unicamente per consentirti di
            utilizzare l’app e mantenere aggiornato il tuo profilo.
          </p>

          <p>
            Hai sempre il controllo dei tuoi contenuti: puoi modificarli o
            cancellarli in qualsiasi momento, direttamente dal tuo account.
          </p>

          <p>
            Per maggiori informazioni o per esercitare i tuoi diritti relativi
            alla privacy, puoi contattarci via email a:{" "}
            <a
              href="mailto:just.breathe.tam@gmail.com"
              className="text-decoration-underline text-light"
            >
              just.breathe.tam@gmail.com
            </a>
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default PrivacyPolicy
