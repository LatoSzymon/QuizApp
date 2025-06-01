const exp = require("express");
const { startSession, answerQuestion, theCompletionus, getSessionById, getUserSessions} = require("../controllers/sessionControl");
const { verifyJWT } = require("../middleware/userMiddleware");

const router = exp.Router();

router.post("/start", verifyJWT, startSession);
router.patch("/:id/answer", verifyJWT, answerQuestion);
router.patch("/:id/complete", verifyJWT, theCompletionus);
router.get("/:id", verifyJWT, getSessionById);
router.get("/user/:userId", verifyJWT, getUserSessions);

module.exports = router;


