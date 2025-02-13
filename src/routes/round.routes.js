const express = require("express");
const router = express.Router();
const RoundController = require("../controllers/round.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, RoundController.createRound); // ✅ Admin starts round
router.get("/current", authMiddleware, RoundController.getCurrentRound); // ✅ Users see current round
router.get("/completed", authMiddleware, RoundController.getCompletedRounds); // ✅ Admin sees completed rounds

module.exports = router;
