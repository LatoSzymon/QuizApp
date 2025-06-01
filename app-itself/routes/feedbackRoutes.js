const express = require("express");
const { addComment, getComments, addRating, getAverageRating } = require("../controllers/feedbackControl");
const { verifyJWT } = require("../middleware/userMiddleware");

const router = express.Router();

router.post("/:quizId/comment", verifyJWT, addComment);
router.get("/:quizId/comments", getComments);

router.post("/:quizId/rate", verifyJWT, addRating);
router.get("/:quizId/average-rating", getAverageRating);

module.exports = router;
