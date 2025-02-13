const express = require("express");
const router = express.Router();
const RoundController = require("../controllers/round.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, adminMiddleware, RoundController.createRound); // ✅ Admin starts round
router.get("/current", authMiddleware, adminMiddleware, RoundController.getCurrentRound); // ✅ Users see current round
router.get("/completed", authMiddleware, adminMiddleware, RoundController.getCompletedRounds); // ✅ Admin sees completed rounds

module.exports = router;