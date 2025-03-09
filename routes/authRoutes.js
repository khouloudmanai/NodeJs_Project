const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authentication = require('../middlewares/authMiddleware'); // Import the authMiddleware

// Route pour l'inscription
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
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
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Identifiants invalides.' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    let redirectUrl = '/';
    if (user.role === 'client') {
      redirectUrl = '/client';
    } else if (user.role === 'professional') {
      redirectUrl = '/professional';
    } else if (user.role === 'admin') {
      redirectUrl = '/admin';
    }

    res.status(200).json({ success: true, token, redirect: redirectUrl });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err.message);
    res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la connexion.' });
  }
});

// Route protégée avec le middleware d'authentification
router.get('/me', authentication, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;