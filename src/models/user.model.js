const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(225),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(225),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(225),
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
    },
    {
      tableName: "user",
      timestamps: true,
      createdAt: "cdate",
      updatedAt: "udate",
    }
  );

  return User;
};
