const { Sequelize } = require("sequelize");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DIALECT,
        dialectOptions: {
            ssl: {
                require: true,
                ca: fs.readFileSync(path.join(__dirname, './cert.pem')),
                rejectUnauthorized: false,
                connectTimeout: 60000, // 60 seconds timeout
            },
        },
        define: {
            charset: "utf8",
            collate: "utf8_general_ci",
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 100000,  // Increase acquire timeout
            idle: 20000       // Increase idle time
        },
        timezone: "+05:30", // Indian Standard Time (IST)
    }
);

// Authenticate database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connection has been established successfully.");
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
    }
})();

const checkDr = fs.readFileSync(path.join(__dirname))
console.log(checkDr)

const check = fs.readFileSync(path.join(__dirname, './cert.pem'))
console.log(check)

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.bet = require("./models/bet.model")(sequelize, Sequelize);
db.round = require("./models/round.model")(sequelize, Sequelize);
db.transaction = require("./models/transaction.model")(sequelize, Sequelize);
db.user = require("./models/user.model")(sequelize, Sequelize);
db.wallet = require("./models/wallet.model")(sequelize, Sequelize);

// 🛠️ Associations

// 1️⃣ User - Wallet (One-to-One)
db.user.hasOne(db.wallet, { foreignKey: "user_id", onDelete: "CASCADE" });
db.wallet.belongsTo(db.user, { foreignKey: "user_id" });

// 2️⃣ User - Bet (One-to-Many)
db.user.hasMany(db.bet, { foreignKey: "user_id", onDelete: "CASCADE" });
db.bet.belongsTo(db.user, { foreignKey: "user_id" });

// 3️⃣ Round - Bet (One-to-Many)
db.round.hasMany(db.bet, { foreignKey: "round_id", onDelete: "CASCADE" });
db.bet.belongsTo(db.round, { foreignKey: "round_id" });

// 4️⃣ User - Transaction (One-to-Many)
db.user.hasMany(db.transaction, { foreignKey: "user_id", onDelete: "CASCADE" });
db.transaction.belongsTo(db.user, { foreignKey: "user_id" });

// Sync database
db.sequelize
    .sync({ force: false }) // Use `alter: true` to update tables without deleting data
    .then(() => {
        console.log("✅ Database & tables created!");
    })
    .catch((error) => {
        console.error("❌ Error syncing database:", error);
    });

module.exports = db;
