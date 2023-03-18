const router = require("express").Router();
const {savePlan,getPlanById,deletePlanById,updatePlan} = require("../controllers/plans");



router.route("/:id").get(getPlanById);
router.route("/").post(savePlan);
router.route("/:id").delete(deletePlanById)
router.route("/:id").patch(updatePlan)

router.get("/", async (req, res) => {
    res.status(400).json({ message: "invalid plan ID" });
    console.log("invalid plan ID");
    return;
  });
  
  //delete without planId
  router.delete("/", async (req, res) => {
    res.status(400).json({ message: "invalid plan ID" });
    return;
  });

  router.patch("/", async (req, res) => {
    res.status(400).json({ message: "invalid plan ID" });
    return;
  });
  



module.exports = router;
