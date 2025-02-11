const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Bet = sequelize.define(
    "bet",
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
      round_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bet_color: {
        type: DataTypes.ENUM("Red", "Green", "Blue", "Yellow"),
        allowNull: false,
      },
      bet_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "bet",
      timestamps: true,
      createdAt: "cdate",
      updatedAt: "udate",
    }
  );

  return Bet;
};
