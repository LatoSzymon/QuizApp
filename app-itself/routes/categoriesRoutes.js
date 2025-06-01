const exp = require("express");
const {createCategory, getAllCats, updateCategory, deleteCat} = require("../controllers/categoryController");
const {verifyJWT, requireRole} = require("../middleware/userMiddleware");

const router = exp.Router();

router.get("/", getAllCats);
router.post("/", verifyJWT, requireRole("admin"), createCategory);
router.put("/:id", verifyJWT, requireRole("admin"), updateCategory);
router.delete("/:id", verifyJWT, requireRole("admin"), deleteCat);

module.exports = router;