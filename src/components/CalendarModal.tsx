import { Modal, Button } from "react-bootstrap"

interface CalendarModalProps {
  show: boolean
  handleClose: () => void
}

const CalendarModal = ({ show, handleClose }: CalendarModalProps) => {
  const downloadICS = async () => {
    const token = localStorage.getItem("token")
    if (!token)
      return alert("Devi essere loggato per aggiungere i task al calendario.")

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/calendar/ics`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok)
        throw new Error("Impossibile accedere al calendario. Riprova.")

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "JustBreatheTasks.ics"
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert("Errore durante il download del calendario 😥.")
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          📆 Scarica e aggiungi al calendario
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3">
          Scarica il tuo <code>.ics</code> personale con i task e mantieni la
          tua settimana sotto controllo.{" "}
          <strong className="mytext">Tutto gratis e senza stress</strong> 🌿
        </p>
        <ul className="list-unstyled">
          <li className="mb-3">
            <span>
              🪟 <strong className="text-primary">Outlook:</strong> apri il file
              scaricato e scegli "Sottoscrivi calendario". Quando vorrai
              caricare un calendario nuovo potrai riscaricarlo dal bottone
              sottostante → Outlook → Calendario → Aggiungi calendario → Carica
              da un file → Sfoglia e seleziona → Importa.
            </span>
          </li>
          <li className="mb-3">
            <span>
              📅 <strong className="mytext">Google Calendar:</strong> vai su
              Google Calendar → "Altri calendari" → "Importa" e seleziona il
              file scaricato.
            </span>
          </li>
          <li className="mb-3">
            <span>
              🍏 <strong className="text-secondary">iPhone/iPad:</strong> Se stai usando Safari, ti
              basterà cliccare sul pulsante qui sotto e seguire le istruzioni
              mostrate dopo aver accettato il download.
            </span>
          </li>
        </ul>
        <p>
          ⚠️ Questo calendario mostra i task fino a oggi. Per avere gli ultimi
          aggiornamenti, scarica di nuovo il file ogni volta che aggiungi nuovi
          task e non temere, verranno aggiunti solo i nuovi appuntamenti.
        </p>
        <p>Rimani sempre aggiornato senza stress 🌸</p>
        <Button variant="success" onClick={downloadICS}>
          📥 Scarica e aggiungi al calendario
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CalendarModal
