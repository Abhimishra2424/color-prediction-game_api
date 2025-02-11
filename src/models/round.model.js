const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Round = sequelize.define(
    "round",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      round_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "completed"),
        defaultValue: "active",
      },
    },
    {
      tableName: "round",
      timestamps: true,
      createdAt: "cdate",
      updatedAt: "udate",
    }
  );

  return Round;
};
