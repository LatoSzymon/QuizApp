const exp = require("express");
const router = exp.Router();
const {getGlobalRanking, getWeeklyRanking, tagRanging, catRanking} = require("../controllers/rankingControllers");

router.get("/global", getGlobalRanking);
router.get("/weekly", getWeeklyRanking);
router.get("/tag/:tag", tagRanging);
router.get("/category/:categoryId", catRanking);

module.exports = router;