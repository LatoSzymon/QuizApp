const exp = require("express");
const {createQuestion, getQuestionsForQuiz, updateQuestion, deleteQuestion} = require("../controllers/questionCon");
const {verifyJWT} = require("../middleware/userMiddleware");
const {checkOwnership, checkQuestionOwnership} = require("../middleware/ownership");
const router = exp.Router();

const adaptQuizIdParam = (req, res, next) => {
  req.params.id = req.params.quizId;
  next();
};

router.post("/quiz/:quizId", verifyJWT, adaptQuizIdParam, checkOwnership, createQuestion);
router.get("/quiz/:quizId", getQuestionsForQuiz);
router.put("/:id", verifyJWT, adaptQuizIdParam, checkQuestionOwnership, updateQuestion);
router.delete("/:id", verifyJWT, adaptQuizIdParam, checkQuestionOwnership, deleteQuestion);

module.exports = router;