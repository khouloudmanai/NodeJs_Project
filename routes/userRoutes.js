// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

// Récupérer tous les utilisateurs (admin seulement)
router.get('/', authMiddleware, roleMiddleware.isAdmin, userController.getAllUsers);

// Récupérer un utilisateur par son ID
router.get('/:id', authMiddleware, userController.getUserById);

// Mettre à jour un utilisateur
router.put('/:id', authMiddleware, userController.updateUser);

// Supprimer un utilisateur
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;