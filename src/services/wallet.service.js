const db = require("../db");
const Wallet = db.wallet;
const Transaction = db.transaction;
const { Op } = require("sequelize");

const WalletService = {

    // ✅ Create a new wallet for the user
    async createWallet(userId) {
        return await Wallet.create({ user_id: userId, balance: 0.0 });
    },

    // ✅ Get wallet details by user_id
    async getWallet(user_id) {
        if (!user_id) throw new Error("User ID is required.");
        const wallet = await Wallet.findOne({ where: { user_id } });
        if (!wallet) throw new Error("Wallet not found.");
        return wallet;
    },

    // ✅ Create an add-money request
    async addMoneyRequest(user_id, amount, transaction_number, source) {
        if (!user_id || !amount || !transaction_number) {
            throw new Error("User ID, amount, and transaction number are required.");
        }

        if (isNaN(amount) || amount <= 0) {
            throw new Error("Amount must be a valid positive number.");
        }

        // 🔹 Check if transaction number is already used
        const existingTransaction = await Transaction.findOne({ where: { transaction_number } });
        if (existingTransaction) {
            throw new Error(`Transaction number "${transaction_number}" already exists.`);
        }

        // 🔹 Create a pending transaction
        return await Transaction.create({
            user_id,
            amount,
            transaction_number,
            type: "credit",
            status: "pending",
            source: source
        });
    },

    // ✅ Approve a money request and update wallet balance
    async approveAddMoneyRequest(transaction_id) {
        if (!transaction_id) throw new Error("Transaction ID is required.");

        const transaction = await Transaction.findByPk(transaction_id);
        if (!transaction) throw new Error("Transaction not found.");
        if (transaction.status !== "pending") throw new Error("Transaction is already processed.");

        const wallet = await Wallet.findOne({ where: { user_id: transaction.user_id } });
        if (!wallet) throw new Error("Wallet not found.");

        // Start a database transaction to ensure data consistency
        return await db.sequelize.transaction(async (t) => {
            wallet.balance = parseFloat(wallet.balance) + parseFloat(transaction.amount);
            await wallet.save({ transaction: t });

            transaction.status = "approved";
            await transaction.save({ transaction: t });

            return wallet;
        });
    },

    // ✅ Reject a money request
    async rejectAddMoneyRequest(transaction_id) {
        if (!transaction_id) throw new Error("Transaction ID is required.");

        const transaction = await Transaction.findByPk(transaction_id);
        if (!transaction) throw new Error("Transaction not found.");
        if (transaction.status !== "pending") throw new Error("Transaction is already processed.");

        transaction.status = "rejected";
        await transaction.save();

        return transaction;
    },

    // ✅ Get request by transaction number
    async getRequestByTransactionNumber(transaction_number) {
        if (!transaction_number) throw new Error("Transaction number is required.");
        return await Transaction.findOne({ where: { transaction_number } });
    },

    // ✅ Create a withdrawal request
    async withdrawRequest(user_id, amount) {
        if (!user_id || !amount) {
            throw new Error("User ID and amount are required.");
        }

        if (isNaN(amount) || amount <= 0) {
            throw new Error("Invalid withdrawal amount.");
        }

        const wallet = await Wallet.findOne({ where: { user_id } });

        if (!wallet || wallet.balance < amount) {
            throw new Error("Insufficient balance.");
        }

        return await Transaction.create({
            user_id,
            amount,
            type: "debit",
            status: "pending",
            source: "withdrawal"
        });
    },

    // ✅ Approve Withdrawal Request
    async approveWithdrawRequest(transaction_id) {
        if (!transaction_id) throw new Error("Transaction ID is required.");

        const transaction = await Transaction.findByPk(transaction_id);
        if (!transaction) throw new Error("Transaction not found.");
        if (transaction.status !== "pending") throw new Error("Transaction already processed.");

        const wallet = await Wallet.findOne({ where: { user_id: transaction.user_id } });
        if (!wallet || wallet.balance < transaction.amount) throw new Error("Insufficient balance.");

        // Process withdrawal
        return await db.sequelize.transaction(async (t) => {
            wallet.balance -= parseFloat(transaction.amount);
            await wallet.save({ transaction: t });

            transaction.status = "approved";
            await transaction.save({ transaction: t });

            return wallet;
        });
    },

    // ✅ Reject Withdrawal Request
    async rejectWithdrawRequest(transaction_id) {
        if (!transaction_id) throw new Error("Transaction ID is required.");

        const transaction = await Transaction.findByPk(transaction_id);
        if (!transaction) throw new Error("Transaction not found.");
        if (transaction.status !== "pending") throw new Error("Transaction already processed.");

        transaction.status = "rejected";
        await transaction.save();

        return transaction;
    },
};

module.exports = WalletService;