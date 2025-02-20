const express = require("express");
const router = express.Router();
const BetController = require("../controllers/bet.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

// ✅ Secure betting routes
router.post("/place-bet", authMiddleware, BetController.placeBet);
router.post("/check-result", authMiddleware, BetController.checkResult);
router.get('/get-all-bets', authMiddleware, BetController.getAllBets);

module.exports = router;
