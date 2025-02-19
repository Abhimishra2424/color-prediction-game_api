const express = require("express");
const router = express.Router();
const RoundController = require("../controllers/round.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, adminMiddleware, RoundController.createRound); // ✅ Admin starts round
router.get("/current", authMiddleware, adminMiddleware, RoundController.getCurrentRound); // ✅ Admin see current round
router.get("/completed", authMiddleware, RoundController.getCompletedRounds);
router.get("/round", authMiddleware, RoundController.getRound) // ✅ User See current round Exclude winning_color from response

module.exports = router;