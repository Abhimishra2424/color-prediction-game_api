const roundService = require("../services/round.service");

const RoundController = {
  async createRound(req, res) {
    try {
      const activeRound = await roundService.getCurrentRound();
      if (activeRound) {
        return res.status(400).json({ message: "A round is already active!" });
      }

      const newRound = await roundService.createNewRound();
      res.status(201).json(newRound);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  async getCurrentRound(req, res) {
    try {
      const activeRound = await roundService.getCurrentRound();
      if (!activeRound) {
        return res.status(404).json({ message: "No active round found!" });
      }
      res.status(200).json(activeRound);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  async getCompletedRounds(req, res) {
    try {
      const rounds = await roundService.getCompletedRounds();
      res.status(200).json(rounds);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  async getRound(req, res) {
    try {
      const activeRound = await roundService.getCurrentRoundExcludeWinningColor();
      if (!activeRound) {
        return res.status(404).json({ message: "No active round found!" });
      }
      res.status(200).json(activeRound);
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

};

module.exports = RoundController;