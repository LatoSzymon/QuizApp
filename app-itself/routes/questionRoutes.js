const exp = require("express");
const {createQuestion, getQuestionsForQuiz} = require("../controllers/questionCon");
const {verifyJWT} = require("../middleware/userMiddleware");
const checkOwnership = require("../middleware/ownership");
const router = exp.Router();

router.post("/quiz/:quizId", verifyJWT, checkOwnership, createQuestion);
router.get("/quiz/:quizId", getQuestionsForQuiz);

module.exports = router;