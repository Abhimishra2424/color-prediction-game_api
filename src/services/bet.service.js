const { trim } = require("lodash");
const db = require("../db");
const Bet = db.bet;
const Wallet = db.wallet;
const Transaction = db.transaction;
const Round = db.round;
const User = db.user;
const { v4: uuidv4 } = require("uuid"); // Import UUID library


const BetService = {

    async placeBet(user_id, round_id, bet_color, bet_amount) {
        if (!user_id || !round_id || !bet_color || !bet_amount) {
            throw new Error("User ID, round ID, color, and amount are required.");
        }

        if (isNaN(bet_amount) || parseFloat(bet_amount) <= 0) {
            throw new Error("Bet amount must be a valid positive number.");
        }

        return await db.sequelize.transaction(async (t) => {
            // 🔹 Check if round is active
            const round = await Round.findOne({ where: { id: round_id, status: "active" }, transaction: t });
            if (!round) {
                throw new Error("Betting is closed for this round.");
            }

            // 🔹 Check if user already placed a bet in this round
            const existingBet = await Bet.findOne({ where: { user_id, round_id }, transaction: t });
            if (existingBet) {
                throw new Error("You have already placed a bet for this round.");
            }

            // 🔹 Check wallet balance
            const wallet = await Wallet.findOne({ where: { user_id }, transaction: t });

            if (!wallet || parseFloat(wallet.balance) < parseFloat(bet_amount)) {
                throw new Error("Insufficient balance.");
            }

            // 🔹 Deduct bet amount from wallet
            wallet.balance = parseFloat(wallet.balance) - parseFloat(bet_amount);
            await wallet.save({ transaction: t });
    
            // 🔹 Create a bet entry with bet_type: "pending"
            const bet = await Bet.create(
                { user_id, round_id, bet_color, bet_amount, bet_type: "pending" }, // ✅ Added bet_type: "pending"
                { transaction: t }
            );
    
            // 🔹 Generate a unique transaction number
            const transactionNumber = uuidv4();

            // 🔹 Create a debit transaction
            await Transaction.create(
                {
                    user_id,
                    amount: -bet_amount,
                    type: "debit",
                    status: "completed",
                    source: `Bet placed on ${bet_color}`,
                    transaction_number: transactionNumber,
                },
                { transaction: t }
            );
    
            return { success: true, message: "Bet placed successfully.", bet_id: bet.id };
        });
    },

    async checkResult(round_id, user_id, bet_id) {
        return await db.sequelize.transaction(async (t) => {
            // 🔹 Get the latest completed round
            const latestRound = await Round.findOne({
                where: { status: "completed" },
                order: [["end_time", "DESC"]],
                transaction: t
            });

            if (!latestRound) {
                throw new Error("No completed round found.");
            }

            // 🔹 Ensure provided round_id matches the last completed round
            if (latestRound.id !== round_id) {
                throw new Error("Invalid round ID. The provided round is not the last completed round.");
            }

            // 🔹 Find user's bet
            const bet = await Bet.findOne({
                where: { id: bet_id, user_id, round_id },
                transaction: t
            });

            if (!bet) {
                throw new Error("Bet not found.");
            }

            // 🔹 Check if the bet color matches the winning color
            const isWinner = bet.bet_color.trim().toLowerCase() === latestRound.winning_color.trim().toLowerCase();
            let winnings = 0;

            if (isWinner) {
                winnings = parseFloat(bet.bet_amount) * 2; // Example: 2x winnings

                // 🔹 Ensure wallet exists before updating balance
                let wallet = await Wallet.findOne({ where: { user_id }, transaction: t });

                if (!wallet) {
                    wallet = await Wallet.create({ user_id, balance: winnings }, { transaction: t }); // Create wallet if missing
                } else {
                    wallet.balance += winnings;
                    await wallet.save({ transaction: t });
                }

                const existingWinTransaction = await Transaction.findOne({
                    where: {
                        user_id,
                        type: "credit",
                        source: `Winning bet on ${bet.bet_color}`
                    },
                    transaction: t
                });

                if (!existingWinTransaction) {
                    // Generate a unique transaction number
                    const transactionNumber = uuidv4();
                    // Create a credit transaction
                    await Transaction.create({
                        user_id,
                        amount: winnings,
                        type: "credit",
                        status: "completed",
                        source: `Winning bet on ${bet.bet_color}`,
                        transaction_number: transactionNumber
                    }, { transaction: t });

                    // Ensure wallet balance is updated only once
                    wallet.balance = parseFloat(wallet.balance) + parseFloat(winnings);
                    await wallet.save({ transaction: t });
                }
    
                // 🔹 Update bet_type to "win"
                bet.bet_type = "win";
                await bet.save({ transaction: t });
            } else {
                // 🔹 Update bet_type to "loss"
                bet.bet_type = "loss";
                await bet.save({ transaction: t });
            }
            return {
                success: true,
                round_id,
                user_id,
                bet_id,
                bet_color: bet.bet_color,
                winning_color: latestRound.winning_color,
                result: isWinner ? "Win" : "Lose",
                winnings,
                message: isWinner ? `Congratulations! You won ${winnings}.` : "Better luck next time."
            };
        });
    },

    async getAllBets(user_id) {
        try {
            const bets = await Bet.findAll({
                where: { user_id },
                order: [["cdate", "DESC"]],
                include: [
                    { model: Round, attributes: ["round_no", "winning_color"], where: { status: "completed" } },
                ],
            });
            return { success: true, bets };
        } catch (error) {
            throw new Error(error.message);
        }
    }

};

module.exports = BetService;
