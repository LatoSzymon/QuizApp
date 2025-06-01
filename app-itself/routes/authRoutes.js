const express = require("express");
const router = express.Router();
const { rejestracja, login, getProfile, updateProfile, forgotPassword, resetPassword } = require("../controllers/usersController");
const { verifyJWT } = require("../middleware/userMiddleware");
const passport = require("passport");
require("../config/passportGoogle");
const jwt = require("jsonwebtoken");

router.post("/register", rejestracja);
router.post("/login", login);
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
        { expiresIn: '1h' }
    );

    res.json({ token, user });
});

module.exports = router;
