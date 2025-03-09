require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authentication = require('./middlewares/authMiddleware'); // Ensure the middleware is imported
const User = require('./models/User'); // Ensure you have a User model defined

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:7000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration du moteur de vue EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connexion à MongoDB avec gestion des erreurs améliorée
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => {
  console.error('❌ Erreur de connexion à MongoDB :', err);
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

// Route pour la connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'Utilisateur non trouvé' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: 'Identifiants invalides' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, token, redirect: user.role === 'client' ? '/client' : user.role === 'professional' ? '/professional' : '/admin' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Routes protégées avec le middleware d'authentification
app.get('/client', authentication, (req, res) => {
  res.render('users/client', { title: 'Tableau de bord Client', user: req.user });
});

app.get('/professional', authentication, (req, res) => {
  res.render('users/professional', { title: 'Tableau de bord Professionnel', user: req.user });
});

app.get('/admin', authentication, (req, res) => {
  res.render('users/admin', { title: 'Tableau de bord Admin', user: req.user });
});

app.get('/', (req, res) => {
  const user = req.user || null;
  res.render('index', { title: 'Accueil', user });
});

// Middleware pour gérer les erreurs 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page non trouvée' });
});

// Middleware pour gérer les erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).render('500', { title: 'Erreur serveur' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log('SECRET_KEY:', process.env.JWT_SECRET);
});