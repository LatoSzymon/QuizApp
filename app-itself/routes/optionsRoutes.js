const exp = require("express");
const { addOption, getOptionsForQuest } = require("../controllers/optionCon");
const {verifyJWT} = require("../middleware/userMiddleware");
const {checkOwnership, checkQuestionOwnership} = require("../middleware/ownership");
const router = exp.Router();

router.post("/question/:id", verifyJWT, checkQuestionOwnership, addOption);
router.get("/question/:questionId", getOptionsForQuest);

module.exports = router;

