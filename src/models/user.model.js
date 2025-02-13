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
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
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
