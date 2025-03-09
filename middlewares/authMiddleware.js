const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Lire le token depuis le cookie

  if (!token) {
    return res.status(401).json({ success: false, message: 'Accès non autorisé.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajouter les informations de l'utilisateur à la requête
    next();
  } catch (err) {
    console.error('Erreur de vérification du token:', err.message);
    res.status(401).json({ success: false, message: 'Token invalide.' });
  }
};

module.exports = authMiddleware;