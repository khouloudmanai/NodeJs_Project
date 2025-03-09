const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ error: "Non autorisé, token manquant" });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // L'utilisateur est maintenant accessible dans req.user
    next();
  } catch (err) {
    return res.status(401).send({ error: "Token invalide" });
  }
};

module.exports = authenticate;