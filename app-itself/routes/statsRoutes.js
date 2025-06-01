const express = require("express");
const { getUserStatsSummary, getQuizStatsSummary } = require("../controllers/statsControl");
const { verifyJWT } = require("../middleware/userMiddleware");
const {checkOwnership} = require("../middleware/ownership");

const router = express.Router();

router.get("/user/:userId/summary", verifyJWT, getUserStatsSummary);
router.get("quiz/:quiz/summary", verifyJWT, checkOwnership, getQuizStatsSummary);

module.exports = router;