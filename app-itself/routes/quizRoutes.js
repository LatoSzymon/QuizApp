const express = require("express");
const { createQuiz, getAllOfTheQuizzyWizzy, getQuizById, updateQuiz, deletusQuizus } = require("../controllers/quizController");
const {verifyJWT} = require("../middleware/userMiddleware");
const checkOwnership = require("../middleware/ownership");

const router = express.Router();

router.get("/", getAllOfTheQuizzyWizzy);
router.get("/:id", getQuizById);
router.post("/", verifyJWT, createQuiz);
router.put("/:id", verifyJWT, checkOwnership, updateQuiz);
router.delete("/:id", verifyJWT, checkOwnership, deletusQuizus);

module.exports = router;


