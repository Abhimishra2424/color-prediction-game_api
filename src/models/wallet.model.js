const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Wallet = sequelize.define(
    "wallet",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
    },
    {
      tableName: "wallet",
      timestamps: true,
      createdAt: "cdate",
      updatedAt: "udate",
    }
  );

  return Wallet;
};
