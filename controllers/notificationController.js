// controllers/notificationController.js
const { sendEmail } = require('../services/emailService');

// Envoyer une notification
exports.sendNotification = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    const info = await sendEmail(to, subject, text, html);
    res.status(200).json({ message: 'Notification envoyée', info });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi de la notification', error });
  }
};

// Récupérer les notifications d'un utilisateur
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    // Implémentez la logique pour récupérer les notifications de l'utilisateur
    const notifications = []; // Exemple de données
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications', error });
  }
};