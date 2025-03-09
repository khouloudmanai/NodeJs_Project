const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Route pour l'inscription
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }

    // Créer un nouvel utilisateur
    user = new User({ name, email, password, role });

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Réponse JSON avec redirection
    res.status(200).json({ success: true, message: 'Inscription réussie', redirect: '/login' });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err.message);
    res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de l\'inscription.' });
  }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Identifiants invalides.' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Identifiants invalides.' });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Stocker le token dans un cookie HTTP-only et sécurisé
    res.cookie('token', token, {
      httpOnly: true, // Le cookie n'est pas accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // Cookie sécurisé en production (HTTPS)
      maxAge: 3600000, // Durée de vie du cookie (1 heure)
      sameSite: 'strict' // Protection contre les attaques CSRF
    });

    // Réponse JSON avec redirection
    let redirectUrl = '/';
    if (user.role === 'client') {
      redirectUrl = '/client';
    } else if (user.role === 'professional') {
      redirectUrl = '/professional';
    } else if (user.role === 'admin') {
      redirectUrl = '/admin';
    }

    res.status(200).json({ success: true, redirect: redirectUrl });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err.message);
    res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la connexion.' });
  }
});

// Route pour la déconnexion
router.post('/logout', (req, res) => {
  // Supprimer le cookie
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Déconnexion réussie', redirect: '/login' });
});

module.exports = router;