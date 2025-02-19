const express = require("express");
const TransactionController = require("../controllers/transaction.controller");
const { authenticateUser, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ User Routes
router.post("/add", authenticateUser, TransactionController.createTransaction);
router.get("/", authenticateUser, TransactionController.getUserTransactions);
router.get("/:id", authenticateUser, TransactionController.getTransactionById);

// ✅ Admin Routes
router.get("/admin/all", adminMiddleware, TransactionController.getAllTransactions);
router.put("/admin/approve/:id", adminMiddleware, TransactionController.approveTransaction);
router.put("/admin/reject/:id", adminMiddleware, TransactionController.rejectTransaction);

module.exports = router;
