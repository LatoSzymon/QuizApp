const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "brak tokanu"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (arrrrr) {
        res.status(403).json({message: "nieprawidłowy token"});
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (req.user.role != role) {
            return res.status(403).json({ message: "brak uprawnień lol" });
        }
        next();
    };
};

module.exports = { verifyJWT, requireRole };