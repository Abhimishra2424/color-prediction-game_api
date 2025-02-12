const express = require("express");
const router = express.Router();
const BetController = require("../controllers/bet.controller");

// ✅ Place a bet
router.post("/place-bet", BetController.placeBet);

router.post("/check-result", BetController.checkResult);

module.exports = router;
