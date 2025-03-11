require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');

const User = require('./models/User'); // Importation du modèle User
const authentication = require('./middlewares/authMiddleware'); // Middleware d'authentification

const app = express();

//  Connexion à MongoDB avec gestion des erreurs
mongoose.connect(process.env.DB_URI)
  .then(() => console.log(' Connecté à MongoDB'))
  .catch(err => {
    console.error(' Erreur de connexion à MongoDB:', err);
    process.exit(1);
  });

//  Configuration des sessions avec stockage MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI,
        collectionName: "sessions",
    }),
    cookie: {
        httpOnly: true,
        secure: false, // Mettre true si HTTPS est activé
        maxAge: 1000 * 60 * 60 * 24, // Expiration après 1 jour
    }
}));

//  Middleware
app.use(cors({
  origin: 'http://localhost:4200', // Modifier selon le front-end
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Configuration EJS pour les vues
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//  Routes publiques (Vue Login & Inscription)
app.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Inscription' });
});
app.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Connexion' });
});

//  Route d'inscription (Register)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Cet email est déjà utilisé." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });

        await newUser.save();
        res.status(201).json({ message: "Utilisateur enregistré avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }
});

//  Route de connexion (Login)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Identifiants invalides' });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 📌 Stocke les données en session
        req.session.token = token;
        req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };

        res.status(200).json({
            success: true,
            redirect: user.role === 'client' ? '/client' : user.role === 'professional' ? '/professional' : '/admin'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//  Routes protégées avec session et authentication
app.get('/client', authentication, (req, res) => {
    res.render('users/client', { title: 'Tableau de bord Client', user: req.session.user });
});
app.get('/professional', authentication, (req, res) => {
    res.render('users/professional', { title: 'Tableau de bord Professionnel', user: req.session.user });
});
app.get('/admin', authentication, (req, res) => {
    res.render('users/admin', { title: 'Tableau de bord Admin', user: req.session.user });
});

// Route de déconnexion (Logout)
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); // Redirige vers la page de connexion
    });
});

//  Page d'accueil
app.get('/', (req, res) => {
    res.render('index', { title: 'Accueil', user: req.session.user || null });
});

//  Middleware pour gérer les erreurs 404
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page non trouvée' });
});

// Middleware global pour la gestion des erreurs
app.use((err, req, res, next) => {
    console.error(' Erreur serveur:', err);
    res.status(500).render('500', { title: 'Erreur serveur' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(` Server started on port ${PORT}`);
});
