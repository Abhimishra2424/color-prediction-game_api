"use strict";
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const hpp = require("hpp");

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
app.use("/api/users", userRoutes);

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
