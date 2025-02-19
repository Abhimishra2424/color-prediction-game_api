const express = require("express");
const TransactionController = require("../controllers/transaction.controller");
const { adminMiddleware, authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ User Routes
router.post("/add", authMiddleware, TransactionController.createTransaction);
router.post("/get", authMiddleware, TransactionController.getUserTransactions);
router.get("/:id", authMiddleware, TransactionController.getTransactionById);

// ✅ Admin Routes
router.get("/admin/all", adminMiddleware, TransactionController.getAllTransactions);
router.put("/admin/approve/:id", adminMiddleware, TransactionController.approveTransaction);
router.put("/admin/reject/:id", adminMiddleware, TransactionController.rejectTransaction);

module.exports = router;
