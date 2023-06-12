module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define("vote", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
  });

  return Vote;
};
