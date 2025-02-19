const TransactionService = require("../services/transaction.service");

const TransactionController = {
  // ✅ Create a Transaction (User)
  async createTransaction(req, res) {
    try {
      const user_id = req.user.id;
      const transaction = await TransactionService.createTransaction({ ...req.body, user_id });
      res.status(201).json({ success: true, message: "Transaction created", transaction });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ Get User Transactions
  async getUserTransactions(req, res) {
    try {
      const { user_id } = req.body;
      const transactions = await TransactionService.getUserTransactions(user_id);
      res.status(200).json({ success: true, transactions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ Get Single Transaction (User)
  async getTransactionById(req, res) {
    try {
      const { id } = req.params;
      const transaction = await TransactionService.getTransactionById(id, req.user.id);
      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }
      res.status(200).json({ success: true, transaction });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ Admin - Get All Transactions
  async getAllTransactions(req, res) {
    try {
      const transactions = await TransactionService.getAllTransactions();
      res.status(200).json({ success: true, transactions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ Admin - Approve Transaction
  async approveTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = await TransactionService.updateTransactionStatus(id, "approved");
      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }
      res.status(200).json({ success: true, message: "Transaction approved", transaction });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ Admin - Reject Transaction
  async rejectTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = await TransactionService.updateTransactionStatus(id, "rejected");
      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }
      res.status(200).json({ success: true, message: "Transaction rejected", transaction });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = TransactionController;