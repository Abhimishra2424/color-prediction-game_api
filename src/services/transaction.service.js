const db = require("../db");
const Transaction = db.transaction;

const TransactionService = {
  // ✅ Create a Transaction
  async createTransaction(data) {
    return await Transaction.create(data);
  },

  // ✅ Get Transactions for a User
  async getUserTransactions(user_id) {
    return await Transaction.findAll({ where: { user_id } });
  },

  // ✅ Get a Single Transaction by ID (User)
  async getTransactionById(id, user_id) {
    return await Transaction.findOne({ where: { id, user_id } });
  },

  // ✅ Admin - Get All Transactions
  async getAllTransactions() {
    return await Transaction.findAll();
  },

  // ✅ Admin - Update Transaction Status
  async updateTransactionStatus(id, status) {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return null;
    transaction.status = status;
    await transaction.save();
    return transaction;
  }
};

module.exports = TransactionService;