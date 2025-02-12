const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AddMoneyRequest = sequelize.define(
    "add_money_request",
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
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      transaction_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
    },
    {
      tableName: "add_money_request",
      timestamps: true,
    }
  );

  return AddMoneyRequest;
};