const express = require("express");
const router = express.Router();
const WalletController = require("../controllers/wallet.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// ✅ User Routes
router.post("/", authMiddleware, WalletController.getWallet);
router.post("/add-money", authMiddleware, WalletController.addMoneyRequest);

// ✅ Admin Routes
router.post("/admin/approve-money", authMiddleware, adminMiddleware, WalletController.approveRequest);
router.post("/admin/reject-money", authMiddleware, adminMiddleware, WalletController.rejectRequest);

module.exports = router;