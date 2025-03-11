const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
    if (!req.session.token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
        req.user = decoded; // Ajoute les infos de l'utilisateur au `req`
        next();
    } catch (error) {
        req.session.destroy();
        return res.redirect('/login');
    }
};

module.exports = authentication;
