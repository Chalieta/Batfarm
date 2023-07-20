module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "plant",
    {
      user_id: DataTypes.STRING,
      item_id: DataTypes.INTEGER,
      counter: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0,
      },
    },
    {
      timestamps: false,
    }
  );
};
