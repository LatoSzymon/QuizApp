const express = require("express");
const {
    createGroup,
    inviteUserToGroup,
    changeMemberRole,
    getUserGroups,
    assignQuizToGroup,
    getGroupQuizzes
} = require("../controllers/groupController");
const { verifyJWT } = require("../middleware/userMiddleware");

const router = express.Router();

router.post("/", verifyJWT, createGroup);
router.post("/:id/invite", verifyJWT, inviteUserToGroup);
router.patch("/:id/role", verifyJWT, changeMemberRole);
router.get("/mine", verifyJWT, getUserGroups);
router.post("/:id/assign-quiz", verifyJWT, assignQuizToGroup);
router.get("/:id/quizzes", verifyJWT, getGroupQuizzes);

module.exports = router;
