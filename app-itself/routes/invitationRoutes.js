const express = require("express");
const { sendInvitation, getMyInvitations, respondToInvitation } = require("../controllers/invitationController");
const { verifyJWT } = require("../middleware/userMiddleware");

const router = express.Router();

router.post("/", verifyJWT, sendInvitation);
router.get("/", verifyJWT, getMyInvitations);
router.patch("/:id", verifyJWT, respondToInvitation);

module.exports = router;
