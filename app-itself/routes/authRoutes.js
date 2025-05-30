const express = require("express");
const router = express.Router();
const { rejestracja, login } = require("../controllers/usersController");
const { verifyJWT } = require("../middleware/userMiddleware");

router.post("/register", rejestracja);
router.post("/login", login);

router.get("/me", verifyJWT, (req, res) => {
    res.json({message: "Token działa", user: req.user});
});

module.exports = router;
