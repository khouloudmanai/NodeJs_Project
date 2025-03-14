const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure you have a User model defined

const authenticate = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ error: "Not authorized" });
    }
};

module.exports = authenticate;
