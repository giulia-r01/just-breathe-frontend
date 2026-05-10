import { Col, Container, Row } from "react-bootstrap"

const ChiSiamo = function () {
  return (
    <Container className="py-4" role="main">
      <h1 className="visually-hidden">Chi siamo</h1>

      <div className="jb-page-hero mt-3 mb-4">
        <div className="jb-page-hero-icon" aria-hidden="true">
          <i className="bi bi-people" />
        </div>
        <div>
          <h2 className="jb-page-hero-title mb-1">Chi siamo</h2>
          <p className="jb-page-hero-subtitle mb-0">Qualcosa in piu su Just Breathe</p>
        </div>
      </div>

      <Row className="justify-content-center mx-1">
        <Col md={10} className="jb-content-box rounded py-4 px-4 my-2">
          <h3 className="jb-content-box-title pb-2">Qualcosa in piu su Just Breathe</h3>
          <p>
            Just Breathe nasce dalla voglia di potersi rilassare in ogni momento. Quante volte siamo stressati
            ma il tappetino da yoga e troppo lontano, mentre il telefono e cosi vicino?
          </p>
          <p>
            Spesso e proprio la tecnologia la maggiore fonte di stress mentale, percio come possiamo rilassarci
            davanti a uno schermo?
          </p>
          <p>
            E proprio questo l'obiettivo di Just Breathe: sappiamo che non potete stare un minuto senza il vostro
            telefono, ma che continuate a lamentarvi di quanto siete stressati.
          </p>
          <p>
            Allora perche non trasformare lo schermo in uno spazio di benessere? Just Breathe e pensata per
            aiutarti a riconnetterti con te stesso, ovunque tu sia: in metro, durante una pausa studio,
            o prima di andare a dormire.
          </p>
          <p>
            Con il nostro diario digitale puoi alleggerire la mente, con la musica personalizzata puoi trovare il
            ritmo giusto per il tuo umore, con la respirazione guidata impari a fare una pausa, e con gli eventi
            intorno a te puoi ritrovare la voglia di uscire e respirare aria nuova.
          </p>
          <p>
            Ed eccoci arrivati alla nostra mission: rendere la tecnologia un alleato del benessere. Perche,
            a volte, basta davvero solo un respiro.
          </p>
          <p className="mt-4">
            Per saperne di piu su come proteggiamo i tuoi dati, leggi la nostra{" "}
            <a
              aria-label="Informativa sulla Privacy - Vai alla sezione dedicata"
              href="/privacy-policy"
              className="text-decoration-underline"
            >
              Informativa sulla Privacy
            </a>
            .
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default ChiSiamo
