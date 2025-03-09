const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser'); // Ajout de cookie-parser
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authMiddleware = require('./middlewares/authMiddleware'); // Middleware d'authentification

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:7000', // Remplacez par l'URL de votre frontend
  credentials: true, // Autoriser les cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Utiliser cookie-parser pour gérer les cookies

// Configuration des sessions
app.use(session({
  secret: process.env.JWT_SECRET || 'votre_clé_secrète',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Mettre `true` si vous utilisez HTTPS
}));

// Configuration du moteur de vue EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connexion à MongoDB
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => {
    console.error('Erreur de connexion à MongoDB', err);
    process.exit(1);
  });

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Routes pour les pages EJS
app.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Inscription' });
});

app.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Connexion' });
});

// Routes protégées avec le middleware d'authentification
app.get('/client', authMiddleware, (req, res) => {
  res.render('client', { title: 'Tableau de bord Client', user: req.user });
});

app.get('/professional', authMiddleware, (req, res) => {
  res.render('professional', { title: 'Tableau de bord Professionnel', user: req.user });
});

app.get('/admin', authMiddleware, (req, res) => {
  res.render('admin', { title: 'Tableau de bord Admin', user: req.user });
});

app.get('/', (req, res) => {
  const user = req.user || null; // Utiliser req.user au lieu de req.session.user
  res.render('index', { title: 'Accueil', user });
});

// Middleware pour gérer les erreurs 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page non trouvée' });
});

// Middleware pour gérer les erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Erreur serveur' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));