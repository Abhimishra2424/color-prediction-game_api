const express = require("express");
const router = express.Router();
const WalletController = require("../controllers/wallet.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, WalletController.getWallet);
router.post("/add-money", authMiddleware, WalletController.addMoneyRequest);
router.post("/approve-money", authMiddleware, WalletController.approveRequest);
router.post("/reject-money", authMiddleware, WalletController.rejectRequest);

module.exports = router;