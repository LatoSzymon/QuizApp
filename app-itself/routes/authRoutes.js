const express = require("express");
const router = express.Router();
const { rejestracja, login, updateProfile, forgotPassword, resetPassword, getFullProfile } = require("../controllers/usersController");
const { verifyJWT } = require("../middleware/userMiddleware");
const passport = require("passport");
require("../config/passportGoogle");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: "Za dużo nieudanych logowań! Ponowna próba za 15 minut"
});

router.post("/register", rejestracja);
router.post("/login", loginLimiter, login);
router.get("/me", verifyJWT, (req, res) => {
    res.json({message: "Token działa", user: req.user});
});
router.put("/me", verifyJWT, updateProfile);
router.post("/forgot-pswd", forgotPassword);
router.post("/reset-pswd", resetPassword);
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", {session: false}), (req, res) => {
    const user = req.user;
    const token = jwt.sign(
        { userId: user.id, role: user.role, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token, user });
});
router.get("/full-profile", verifyJWT, getFullProfile);



module.exports = router;
