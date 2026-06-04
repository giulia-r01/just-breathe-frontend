import { Col, Container, Row } from "react-bootstrap"
import "../assets/cssVari/contentPages.css"
import PageHero from "./common/PageHero"

const PrivacyPolicy = function () {
  return (
    <Container className="py-4" role="main">
      <h1 className="visually-hidden">Privacy Policy</h1>

      <PageHero
        iconClassName="bi bi-shield-lock"
        title="Privacy Policy"
        subtitle="La tua privacy conta"
        className="mt-3 mb-4"
      />

      <Row className="justify-content-center mx-1">
        <Col md={10} className="jb-content-box rounded py-4 px-4 my-2">
          <h3 className="jb-content-box-title pb-2">La tua privacy conta</h3>

          <p>
            Just Breathe tiene alla tua privacy e si impegna a proteggere i tuoi dati personali in modo trasparente
            e responsabile.
          </p>

          <p>
            I contenuti che salvi all'interno dell'app, come pensieri nel diario, mood giornalieri, to-do list
            o preferenze musicali, <strong>rimangono strettamente privati</strong>. Non vengono letti, analizzati
            ne condivisi con terze parti.
          </p>

          <p>
            L'app raccoglie alcune informazioni di utilizzo (come accessi, frequenza di attivita o inattivita,
            data di registrazione, ultima connessione) esclusivamente per motivi statistici e di funzionamento
            tecnico. Questi dati possono essere visualizzati dagli amministratori dell'app per garantire un uso
            corretto della piattaforma.
          </p>

          <p>
            In casi specifici e documentati, l'amministrazione puo intervenire per sospendere o disattivare un
            account, ad esempio in caso di violazioni dei termini d'uso o per garantire la sicurezza del servizio.
          </p>

          <p>
            I tuoi dati di accesso (es. email, nome utente) vengono trattati nel rispetto della normativa vigente,
            unicamente per consentirti di utilizzare l'app e mantenere aggiornato il tuo profilo.
          </p>

          <p>
            Hai sempre il controllo dei tuoi contenuti: puoi modificarli o cancellarli in qualsiasi momento,
            direttamente dal tuo account.
          </p>

          <p>
            Per maggiori informazioni o per esercitare i tuoi diritti relativi alla privacy, puoi contattarci via
            email a:{" "}
            <a
              href="mailto:just.breathe.tam@gmail.com"
              className="text-decoration-underline"
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
