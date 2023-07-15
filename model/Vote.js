module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define("vote", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    encryptedVote: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  return Vote;
};
