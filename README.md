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

⚙️ Configura il file .env.local

Per eseguire correttamente il frontend in locale, crea un file `.env.local` nella root del progetto e inserisci la seguente variabile:

VITE_BACKEND_URL=http://localhost:8080

Assicurati che il backend sia in esecuzione su quella porta, altrimenti modifica l’URL di conseguenza.

Avvia l’app con Vite:

npm run dev

L'applicazione sarà disponibile all’indirizzo http://localhost:5173.

📁 Nella cartella del progetto è presente anche il file `.env.production` già configurato per la versione online deployata su Vercel.

### ⚙️ Avvio del Backend

Spostati nella cartella del backend:

cd ../just-breathe-backend

Assicurati di avere installato:

Java 17 o superiore

Maven

PostgreSQL (in esecuzione)

Configura le credenziali in un file src/main/resources/application.properties come nell'esempio:

```
spring.config.import=optional:file:env.properties
spring.application.name=just-breathe-backend
spring.datasource.url=${POSTGRESQL_URL}
spring.datasource.username=${POSTGRESQL_USERNAME}
spring.datasource.password=${POSTGRESQL_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.default_schema=public


spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

cloudinary.cloud_name=${CLOUD_NAME}
cloudinary.api_key=${API_KEY}
cloudinary.api_secret=${API_SECRET}

gmail.mail.transport.protocol=smtp
gmail.mail.smtp.auth=true
gmail.mail.smtp.starttls.enable=true
gmail.mail.debug=true
gmail.mail.from=${GMAIL_FROM}
gmail.mail.from.password=${GMAIL_PASSWORD}
gmail.smtp.ssl.enable=true
gmail.smtp.host=smtp.gmail.com
gmail.smtp.port=587



jwt.duration=31557600000
jwt.secret=${JWT_SECRET}


youtube.api.key=${YOUTUBE_API_KEY}


ticketmaster.api.key=${TICKETMASTER_API_KEY}


app.frontend.base-url=${APP_FRONTEND_BASE_URL}


```

🔐 Crea un file env.properties nella root del backend per mantenere separati e sicuri i valori sensibili (come le chiavi API e le credenziali). Assicurati che sia incluso nel .gitignore.

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
📧 [just.breathe.tam@gmail.com](mailto:just.breathe.tam@gmail.com?subject=Richiesta%20di%20assistenza)
🔗 [Link online Just-Breathe-app](https://just-breathe.vercel.app/)
