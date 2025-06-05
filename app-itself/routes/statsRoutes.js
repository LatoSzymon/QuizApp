const express = require("express");
const { getUserStatsSummary, getQuizStatsSummary } = require("../controllers/statsControl");
const { verifyJWT } = require("../middleware/userMiddleware");
const {checkOwnership} = require("../middleware/ownership");

const router = express.Router();
const adaptQuizIdParam = (req, res, next) => {
  req.params.id = req.params.quizId;
  next();
};

router.get("/user/:userId/summary", verifyJWT, getUserStatsSummary);
router.get("/quiz/:quizId/summary", verifyJWT, adaptQuizIdParam, checkOwnership, getQuizStatsSummary);

module.exports = router;