const WalletService = require("../services/wallet.service");

const WalletController = {

  async getWallet(req, res) {
    try {
      const { user_id } = req.body; // Get user_id from request body
      if (!user_id) return res.status(400).json({ success: false, message: "User ID is required" });

      const wallet = await WalletService.getWallet(user_id);
      if (!wallet) return res.status(404).json({ success: false, message: "Wallet not found" });

      return res.status(200).json({ success: true, data: wallet });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async addMoneyRequest(req, res) {
    try {
      const { amount, transaction_number, user_id } = req.body;

      // 🔹 Validate required fields
      if (!amount || !transaction_number || !user_id) {
        return res.status(400).json({ success: false, message: "Amount, transaction number, and user ID are required." });
      }

      // 🔹 Check if the transaction number already exists
      const existingRequest = await WalletService.getRequestByTransactionNumber(transaction_number);
      if (existingRequest) {
        return res.status(400).json({ success: false, message: `Transaction number ${transaction_number} is already used. Please use a unique one.` });
      }

      // 🔹 Create a new add money request
      const request = await WalletService.createAddMoneyRequest(user_id, amount, transaction_number);

      return res.status(201).json({ success: true, message: "Add money request submitted successfully.", data: request });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async approveRequest(req, res) {
    const { request_id } = req.body;

    const updatedWallet = await WalletService.approveAddMoneyRequest(request_id);
    if (!updatedWallet) return res.status(400).json({ message: "Invalid request" });

    res.json({ message: "Money added successfully", wallet: updatedWallet });
  },

  async rejectRequest(req, res) {
    const { request_id } = req.body;

    const updatedRequest = await WalletService.rejectAddMoneyRequest(request_id);
    if (!updatedRequest) return res.status(400).json({ message: "Invalid request" });

    res.json({ message: "Request rejected", request: updatedRequest });
  },
};

module.exports = WalletController;