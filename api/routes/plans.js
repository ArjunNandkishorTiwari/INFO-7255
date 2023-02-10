const router = require("express").Router();
const {savePlan,getPlanById,deletePlanById} = require("../controllers/plans");



router.route("/:id").get(getPlanById);
router.route("/").post(savePlan);
router.route("/:id").delete(deletePlanById)




module.exports = router;
