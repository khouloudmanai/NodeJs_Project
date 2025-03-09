// middlewares/roleMiddleware.js
const roleMiddleware = {
  // Vérifie si l'utilisateur est un client
  isClient: (req, res, next) => {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Accès refusé : réservé aux clients' });
    }
    next();
  },

  // Vérifie si l'utilisateur est un professionnel
  isProfessional: (req, res, next) => {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Accès refusé : réservé aux professionnels' });
    }
    next();
  },

  // Vérifie si l'utilisateur est un admin
  isAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé : réservé aux administrateurs' });
    }
    next();
  },
};

module.exports = roleMiddleware;