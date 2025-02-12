const express = require("express");
const router = express.Router();
const WalletController = require("../controllers/wallet.controller");

router.post("/", WalletController.getWallet);
router.post("/add-money", WalletController.addMoneyRequest);
router.post("/approve-money", WalletController.approveRequest);
router.post("/reject-money", WalletController.rejectRequest);

module.exports = router;