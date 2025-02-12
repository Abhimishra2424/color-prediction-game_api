const db = require("../db");
const Round = db.round;

const getRandomColor = () => {
  const colors = ["Red", "Green", "Black", "Blue", "Orange", "Pink"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const RoundService = {
  async createNewRound() {
    const lastRound = await Round.findOne({ order: [["id", "DESC"]] });
    const roundNo = lastRound ? lastRound.round_no + 1 : 1;

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 3 * 60 * 1000); // 3 mins later

    const newRound = await Round.create({
      round_no: roundNo,
      start_time: startTime,
      end_time: endTime,
      status: "active",
      winning_color: getRandomColor(), // Assign a random color
    });

    console.log(`✅ Round ${roundNo} started!`);
    return newRound;
  },

  async completeRound(roundId) {
    const round = await Round.findByPk(roundId);
    if (!round) return null;

    round.status = "completed";
    await round.save();
    console.log(`⏳ Round ${round.round_no} completed!`);
    return round;
  },

  async getCurrentRound() {
    return await Round.findOne({
      where: { status: "active" },
      order: [["id", "DESC"]],
    });
  },

  async getCompletedRounds() {
    return await Round.findAll({
      where: { status: "completed" },
      order: [["id", "DESC"]],
    });
  },
};

module.exports = RoundService;
