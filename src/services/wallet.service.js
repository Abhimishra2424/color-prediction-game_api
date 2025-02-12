const db = require("../db");
const Wallet = db.wallet;
const AddMoneyRequest = db.addMoneyRequest;

const WalletService = {

    async createWallet(userId) {
        return await Wallet.create({ user_id: userId, balance: 0.0 });
    },

    async getWallet(user_id) {
        return await Wallet.findOne({ where: { user_id } });
    },

    async createAddMoneyRequest(user_id, amount, transaction_number) {
        return await AddMoneyRequest.create({
            user_id,
            amount,
            transaction_number,
            status: "pending",
        });
    },

    async approveAddMoneyRequest(request_id) {
        const request = await AddMoneyRequest.findByPk(request_id);
        if (!request || request.status !== "pending") return null;

        const wallet = await Wallet.findOne({ where: { user_id: request.user_id } });
        if (!wallet) return null;

        wallet.balance = parseFloat(wallet.balance) + parseFloat(request.amount);
        await wallet.save();

        request.status = "approved";
        await request.save();

        return wallet;
    },

    async rejectAddMoneyRequest(request_id) {
        const request = await AddMoneyRequest.findByPk(request_id);
        if (!request || request.status !== "pending") return null;

        request.status = "rejected";
        await request.save();

        return request;
    },

    async getRequestByTransactionNumber(transaction_number){
        return await AddMoneyRequest.findOne({ where: { transaction_number } });
    }
    
};

module.exports = WalletService;