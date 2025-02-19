"use strict";
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const hpp = require("hpp");

const roundService = require("./services/round.service");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(morgan("dev"));

// Ignore favicon requests
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Routes
const userRoutes = require("./routes/user.routes");
const roundRoutes = require("./routes/round.routes");
const walletRoutes = require("./routes/wallet.routes");
const betRoutes = require("./routes/bet.routes");
const transactionRoutes = require("./routes/transaction.routes");

app.use("/api/users", userRoutes); // ✅ Users APIs added
app.use("/api/rounds", roundRoutes); // ✅ Rounds APIs added
app.use("/api/wallet", walletRoutes); // ✅ Wallet APIs added
app.use("/api/bet", betRoutes); // ✅ Bet APIs added
app.use("/api/transactions", transactionRoutes); // ✅ Transactions APIs added

// ✅ Auto-check and create rounds every second
setInterval(async () => {
    try {
        const activeRound = await roundService.getCurrentRound();

        if (activeRound && new Date() > new Date(activeRound.end_time)) {
            console.log("⏳ Completing expired round...");
            await roundService.completeRound(activeRound.id);

            console.log("🚀 Creating a new round...");
            await roundService.createNewRound();
        }
    } catch (error) {
        console.error("❌ Error in interval:", error.message);
    }
}, 1000); // Every 1 second

// For invalid routes
app.all("*", (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});