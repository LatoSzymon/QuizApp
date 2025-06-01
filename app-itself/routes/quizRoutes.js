const express = require("express");
const { createQuiz, getAllOfTheQuizzyWizzy, getQuizById, updateQuiz, deletusQuizus, getQuizzesSharedToMe, shareQuizWithUser } = require("../controllers/quizController");
const {verifyJWT} = require("../middleware/userMiddleware");
const {checkOwnership} = require("../middleware/ownership");

const router = express.Router();

router.get("/", getAllOfTheQuizzyWizzy);
router.get("/:id", getQuizById);
router.post("/", verifyJWT, createQuiz);
router.put("/:id", verifyJWT, checkOwnership, updateQuiz);
router.delete("/:id", verifyJWT, checkOwnership, deletusQuizus);
router.get("/shared-to-me", verifyJWT, getQuizzesSharedToMe);
router.post("/:id/share", verifyJWT, checkOwnership, shareQuizWithUser);

module.exports = router;


