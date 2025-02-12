const BetService = require("../services/bet.service");

const BetController = {
    async placeBet(req, res) {
        try {
            const { user_id, round_id, bet_color, bet_amount } = req.body;
            const result = await BetService.placeBet(user_id, round_id, bet_color, bet_amount);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    },

    async checkResult(req, res) {
        try {
            const { round_id, user_id, bet_id } = req.body;
    
            if (!round_id || !user_id || !bet_id) {
                return res.status(400).json({ success: false, message: "Round ID, User ID, and Bet ID are required." });
            }
    
            const result = await BetService.checkResult(round_id, user_id, bet_id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    },    
};

module.exports = BetController;
