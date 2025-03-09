const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware'); // Ajoutez cette ligne

const router = express.Router();

// Envoyer une notification (e-mail, SMS, etc.) (admin seulement)
router.post('/send', authMiddleware, roleMiddleware.isAdmin, notificationController.sendNotification);

// Récupérer les notifications d'un utilisateur
router.get('/user/:userId', authMiddleware, notificationController.getUserNotifications);

module.exports = router;