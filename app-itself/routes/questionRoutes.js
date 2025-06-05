const exp = require("express");
const {createQuestion, getQuestionsForQuiz, updateQuestion, deleteQuestion, getAllQest} = require("../controllers/questionCon");
const {verifyJWT, requireRole} = require("../middleware/userMiddleware");
const {checkOwnership, checkQuestionOwnership} = require("../middleware/ownership");
const router = exp.Router();

const adaptQuizIdParam = (req, res, next) => {
  req.params.id = req.params.quizId;
  next();
};

router.post("/quiz/:quizId", verifyJWT, adaptQuizIdParam, checkOwnership, createQuestion);
router.get("/quiz/:quizId", getQuestionsForQuiz);
router.put("/:id", verifyJWT, checkQuestionOwnership, updateQuestion);
router.delete("/:id", verifyJWT, checkQuestionOwnership, deleteQuestion);
router.get("/", verifyJWT, requireRole("admin"), getAllQest);


module.exports = router;