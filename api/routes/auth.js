const router = require("express").Router();

const {getToken,validateTokens} = require("../controllers/auth");

router.route("/generateToken").get(getToken);
router.route("/validateToken").post(validateTokens);



module.exports = router;
