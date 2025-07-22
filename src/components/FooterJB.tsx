import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa"
import { Link } from "react-router-dom"

const FooterJB = function () {
  return (
    <footer className="text-center mynav py-2">
      <p className="mb-0 text-white">
        🌿 Just Breathe - &copy; <span>{new Date().getFullYear()} 🌿</span>
      </p>
      <p className="mb-0">
        <Link
          className="text-white"
          to="/chi-siamo"
          aria-label="Chi siamo - Scopri di più su Just Breathe - Vai alla pagina dedicata"
        >
          Chi siamo
        </Link>
      </p>
      <p className="mb-0">
        <Link
          className="text-white"
          to="/privacy-policy"
          aria-label="Privacy Policy - Leggi la nostra policy - Vai alla pagina dedicata"
        >
          Privacy Policy
        </Link>
      </p>
      <p className="mb-0 text-white">
        Seguici:{" "}
        <a
          title="Apri su Instagram"
          className="mx-2"
          href="https://www.instagram.com/giuliarizzo00/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Profilo instagram di Just Breathe - Collegamento a sito esterno - Apertura in nuova scheda"
        >
          <FaInstagram aria-hidden="true" />
        </a>{" "}
        <a
          title="Apri su LinkedIn"
          className="mx-2"
          href="https://www.linkedin.com/in/giulia-rizzo-4782bb102/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Profilo LinkedIn di Just Breathe - Collegamento a sito esterno - Apertura in nuova scheda"
        >
          <FaLinkedin aria-hidden="true" />
        </a>{" "}
        <a
          title="Apri su GitHub"
          className="mx-2"
          href="https://github.com/giulia-r01"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Profilo GitHub di Just Breathe - Collegamento a sito esterno - Apertura in nuova scheda"
        >
          <FaGithub aria-hidden="true" />
        </a>
      </p>
      <p className="mb-0 text-white">
        Assistenza: Hai bisogno di aiuto? Scrivici una{" "}
        <a
          href="mailto:just.breathe.tam@gmail.com?subject=Richiesta%20di%20assistenza"
          className="text-white"
          aria-label="mail - Invia una mail, oggetto: Richiesta di assistenza"
        >
          mail
        </a>
      </p>
    </footer>
  )
}
export default FooterJB
