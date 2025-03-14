require('dotenv').config(); // Charger les variables d'environnement depuis .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const emailService = require('./mailer/Emailservice'); // Assure-toi que tu as cette classe dans ton dossier mailer
const eventRoutes = require('./routes/eventRoutes'); 
const appointmentRoutes = require('./routes/appointmentRoutes');// Importer les routes pour les événements
const User = require('./models/user');
const Emailservice = require('./mailer/Emailservice');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Middleware pour gérer les CORS et le JSON
app.use(cors({
  origin: 'http://localhost:7000', // Frontend URL
  credentials: true, // Permettre les cookies
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Pour parser les données JSON dans les requêtes
app.use(express.urlencoded({ extended: true })); // Pour traiter les formulaires encodés en URL

// Connexion à MongoDB
mongoose.connect(process.env.DB_URI)
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => {
  console.error('❌ Erreur de connexion à MongoDB :', err);
  process.exit(1);
});

app.use(express.json());
// Routes API
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/events', eventRoutes);

const emailService = new Emailservice({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // Si 'true' utiliser SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Routes API
const userRoutes = require('./routes/userRoutes'); // Assurez-vous que le chemin est correct
app.use('/appointments', appointmentRoutes);

// Exemple de route de base
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API de gestion des utilisateurs!");
});




// Route pour créer un rendez-vous
app.use('/Appointment', userRoutes);
app.post('/appointments/create', async (req, res) => {
  const { clientName, professionalName, date, status } = req.body;

  // Vérification des champs nécessaires
  if (!clientName || !professionalName || !date) {
    return res.status(400).json({ message: "Missing required fields: clientName, professionalName, date." });
  }

  try {
    // Créer un nouveau rendez-vous
    const newAppointment = new Appointment({
      clientName,
      professionalName,
      date,
      status,
    });
 // Sauvegarder le rendez-vous dans la base de données
 const savedAppointment = await newAppointment.save();

 // Répondre avec le rendez-vous créé
 res.status(201).json({
   message: 'Appointment created successfully',
   appointment: savedAppointment,
 });
} catch (error) {
 console.error('Error creating appointment:', error);
 res.status(500).json({ message: 'Error creating appointment', error: error.message });
}
});


// Route pour envoyer un email
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    const emailSent = await emailServiceInstance.sendEmail({ to, subject, text });
    if (emailSent) {
      res.send({ message: 'Email sent successfully' });
    } else {
      res.status(500).send({ message: 'Failed to send email' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error sending email', error: error.message });
  }
});

// Page d'accueil
app.get("/", (req, res) => {
  res.send("Hello World! The server is running.");
});

// Gestion des erreurs pour les routes non définies
app.use((req, res, next) => {
  res.status(404).send({ message: 'Route not found' });
});

// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log('SECRET_KEY:', process.env.JWT_SECRET); // Vérifier si le JWT_SECRET est bien chargé
});
