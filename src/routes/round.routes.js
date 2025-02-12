const express = require("express");
const router = express.Router();
const RoundController = require("../controllers/round.controller");

router.post("/create", RoundController.createRound); // ✅ Admin starts the first round manually
router.get("/current", RoundController.getCurrentRound); // ✅ Users see the current active round
router.get("/completed", RoundController.getCompletedRounds); // ✅ Admin sees completed rounds

module.exports = router;
