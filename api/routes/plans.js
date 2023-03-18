const router = require("express").Router();
const {savePlan,getPlanById,deletePlanById,updatePlan} = require("../controllers/plans");



router.route("/:id").get(getPlanById);
router.route("/").post(savePlan);
router.route("/:id").delete(deletePlanById)
router.route("/:id").patch(updatePlan)




module.exports = router;
