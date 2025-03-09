// routes/appointmentRoutes.js
const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

// Créer un rendez-vous (client seulement)
router.post('/', authMiddleware, roleMiddleware.isClient, appointmentController.createAppointment);

// Récupérer tous les rendez-vous d'un utilisateur (client ou professionnel)
router.get('/user/:userId', authMiddleware, appointmentController.getUserAppointments);

// Récupérer un rendez-vous par son ID
router.get('/:id', authMiddleware, appointmentController.getAppointmentById);

// Mettre à jour un rendez-vous (statut, notes, etc.) (professionnel seulement)
router.put('/:id', authMiddleware, roleMiddleware.isProfessional, appointmentController.updateAppointment);

// Annuler un rendez-vous (client seulement)
router.delete('/:id', authMiddleware, roleMiddleware.isClient, appointmentController.cancelAppointment);

module.exports = router;