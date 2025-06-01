const express = require("express");
const { createTag, getAllTag, deleteTagussy } = require("../controllers/tagControl");
const { verifyJWT, requireRole } = require("../middleware/userMiddleware");

const router = express.Router();

router.get("/", getAllTag);
router.post("/", verifyJWT, requireRole("admin"), createTag);
router.delete("/:id", verifyJWT, requireRole("admin"), deleteTagussy);

module.exports = router;