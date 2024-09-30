const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]; // Get token from Authorization header
        if (!token) {
            return res.status(401).json({ message: "Authentification failed" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        const user = await User.findByPk(decoded.id); // Find user by ID
        if (!user) {
            return res.status(401).json({ message: "Authentification failed" });
        }
        req.user = user; // Attach user to request
        next();
    } catch(err){
        res.status(401).json({ message: "You need to be authentified" });
    }
}

module.exports = authMiddleware;
