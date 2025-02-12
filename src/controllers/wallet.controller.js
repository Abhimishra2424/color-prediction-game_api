const WalletService = require("../services/wallet.service");

const WalletController = {

  // ✅ Get Wallet by User ID
  async getWallet(req, res) {
    try {
      const { user_id } = req.body; 
      if (!user_id) {
        return res.status(400).json({ success: false, message: "User ID is required." });
      }

      const wallet = await WalletService.getWallet(user_id);
      if (!wallet) {
        return res.status(404).json({ success: false, message: "Wallet not found." });
      }

      return res.status(200).json({ success: true, data: wallet });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  // ✅ Create Add Money Request
  async addMoneyRequest(req, res) {
    try {
      const { amount, transaction_number, user_id, source } = req.body;

      // 🔹 Validate required fields
      if (!user_id || !amount || !transaction_number) {
        return res.status(400).json({ 
          success: false, 
          message: "User ID, amount, and transaction number are required." 
        });
      }

      // 🔹 Ensure amount is a positive number
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Amount must be a valid positive number." 
        });
      }

      // 🔹 Check if the transaction number already exists
      const existingRequest = await WalletService.getRequestByTransactionNumber(transaction_number);
      if (existingRequest) {
        return res.status(400).json({ 
          success: false, 
          message: `Transaction number ${transaction_number} already exists. Use a unique one.` 
        });
      }

      // 🔹 Create a new add money request
      const request = await WalletService.addMoneyRequest(user_id, amount, transaction_number, source);
      
      return res.status(201).json({ 
        success: true, 
        message: "Add money request submitted successfully.", 
        data: request 
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  // ✅ Approve Add Money Request
  async approveRequest(req, res) {
    try {
      const { request_id } = req.body;
      if (!request_id) {
        return res.status(400).json({ success: false, message: "Request ID is required." });
      }

      const updatedWallet = await WalletService.approveAddMoneyRequest(request_id);
      if (!updatedWallet) {
        return res.status(400).json({ success: false, message: "Invalid request or request already processed." });
      }

      return res.status(200).json({ success: true, message: "Money added successfully.", wallet: updatedWallet });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  // ✅ Reject Add Money Request
  async rejectRequest(req, res) {
    try {
      const { request_id } = req.body;
      if (!request_id) {
        return res.status(400).json({ success: false, message: "Request ID is required." });
      }

      const updatedRequest = await WalletService.rejectAddMoneyRequest(request_id);
      if (!updatedRequest) {
        return res.status(400).json({ success: false, message: "Invalid request or request already processed." });
      }

      return res.status(200).json({ success: true, message: "Request rejected.", request: updatedRequest });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

};

module.exports = WalletController;