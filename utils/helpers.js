// utils/helpers.js
const logger = require('./logger');

// Fonction pour formater une date
const formatDate = (date) => {
  return new Date(date).toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Fonction pour valider une adresse e-mail
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Fonction pour générer un mot de passe aléatoire
const generateRandomPassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Fonction pour gérer les erreurs
const handleError = (error, res) => {
  logger.error(`Erreur : ${error.message}`);
  res.status(500).json({ message: 'Une erreur est survenue', error: error.message });
};

// Exporter les fonctions utilitaires
module.exports = {
  formatDate,
  validateEmail,
  generateRandomPassword,
  handleError,
};