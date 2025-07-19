# 🌿 Just Breathe

**Just Breathe** è una web app di benessere digitale pensata per aiutare gli utenti a organizzare la propria mente, rilassarsi e ritrovare l’equilibrio interiore.

---

## 🚀 Funzionalità principali

- 📝 Diario personale
- ✅ To-Do list quotidiana
- 🎵 Playlist musicali da creare in base al proprio mood
- 🌬️ Respiro guidato con animazioni e accessibilità
- 📅 Eventi nelle vicinanze con possibilità di salvare i preferiti
- 🔐 Registrazione/Login sicuri con JWT
- 🔐 Recupero password dimenticata
- 🛠️ Backoffice per gestione contenuti (admin) e statistiche
- ♿ Interfaccia **accessibile** e **responsive**

---

## 🛠️ Tecnologie usate

### Frontend

- **React** con Vite
- **React Router DOM**
- **Bootstrap 5**
- **React Icons**
- **JWT Authentication**
- **Fetch API**

### Backend

- **Spring Boot**
- **PostgreSQL**
- **Spring Security con JWT**
- **JPA e Hibernate**
- **Cloudinary** per upload immagini
- **JavaMailSender** per invio email (es. recupero password)

---

## ⚙️ Setup del progetto

### 🔧 Requisiti

- Node.js e npm
- Java 17+
- PostgreSQL

---

## 🧭 Istruzioni per avviare il progetto

### 📦 Clona i repository

git clone https://github.com/tuo-username/just-breathe-frontend.git

git clone https://github.com/tuo-username/just-breathe-backend.git

### ▶️ Avvio del frontend

Posizionati nella cartella del frontend:

cd just-breathe-frontend

Installa le dipendenze:

npm install

Avvia l’app:

npm run dev

L'applicazione sarà disponibile all’indirizzo http://localhost:5173.

### ⚙️ Avvio del Backend

Spostati nella cartella del backend:

cd ../just-breathe-backend

Assicurati di avere installato:

Java 17 o superiore

Maven

PostgreSQL (in esecuzione)

Configura le credenziali in un file src/main/resources/application.properties. Un esempio di configurazione potrebbe essere:

```
spring.datasource.url=...
spring.datasource.username=...
spring.datasource.password=...

# Configurazioni aggiuntive:
jwt.secret=...
cloudinary.cloud-name=...
cloudinary.api-key=...
cloudinary.api-secret=...
```

Avvia l’app Spring Boot con Maven:

mvn spring-boot:run

Il backend sarà disponibile all’indirizzo http://localhost:8080.

✅ A questo punto l'applicazione sarà completamente funzionante in locale!

🔗 [Vai al repository del backend](https://github.com/giulia-r01/just-breathe-backend)

---

## 👤 Autrice

**Giulia Rizzo**  
🔗 [LinkedIn](https://www.linkedin.com/in/giulia-rizzo-4782bb102/)  
💻 [GitHub](https://github.com/giulia-r01)  
📧 [girzzo@gmail.com](mailto:girzzo@gmail.com?subject=Richiesta%20di%20assistenza)
🔗 [Link online Just-Breathe-app](https://just-breathe.vercel.app/)
