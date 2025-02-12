const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Transaction = sequelize.define(
    "transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("credit", "debit"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Reason for transaction (Add Money, Withdrawal, etc.)",
      },
      transaction_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "transaction",
      timestamps: true,
      createdAt: "cdate",
      updatedAt: "udate",
    }
  );

  return Transaction;
};
