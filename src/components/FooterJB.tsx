import { Link } from "react-router-dom"

const FooterJB = function () {
  return (
    <footer className="jb-footer text-center py-3 mt-4">
      <p className="mb-1">
        <Link
          className="jb-footer-link"
          to="/"
          aria-label="Just Breathe - Vai alla homepage di Just Breathe"
        >
          Just Breathe
        </Link>{" "}
        - &copy; <span>{new Date().getFullYear()}</span> | Seguici:
        <a
          title="Apri su Instagram"
          className="jb-footer-icon mx-2"
          href="https://www.instagram.com/giuliarizzo00/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Profilo Instagram di Just Breathe"
        >
          <i className="bi bi-instagram" aria-hidden="true" />
        </a>
        <a
          title="Apri su LinkedIn"
          className="jb-footer-icon mx-2"
          href="https://www.linkedin.com/in/giulia-rizzo-4782bb102/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Profilo LinkedIn di Just Breathe"
        >
          <i className="bi bi-linkedin" aria-hidden="true" />
        </a>
        <a
          title="Apri su GitHub"
          className="jb-footer-icon mx-2"
          href="https://github.com/giulia-r01"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Profilo GitHub di Just Breathe"
        >
          <i className="bi bi-github" aria-hidden="true" />
        </a>
      </p>
      <p className="mb-1">
        <Link
          className="jb-footer-link"
          to="/chi-siamo"
          aria-label="Chi siamo - Scopri di piu su Just Breathe"
        >
          Chi siamo
        </Link>{" "}
        |{" "}
        <Link
          className="jb-footer-link"
          to="/privacy-policy"
          aria-label="Privacy Policy - Leggi la nostra policy"
        >
          Privacy Policy
        </Link>
      </p>
      <p className="mb-1"></p>
      <p className="mb-0">
        Assistenza: Hai bisogno di aiuto? Scrivici una
        <a
          href="mailto:just.breathe.tam@gmail.com?subject=Richiesta%20di%20assistenza"
          className="jb-footer-link ms-1"
          aria-label="Invia una mail di assistenza"
        >
          mail
        </a>
      </p>
    </footer>
  )
}

export default FooterJB
