// const Faculty = require("./Faculty");
const candidate = require("./Candidate");
module.exports = (sequelize, DataTypes) => {
  const Poll = sequelize.define("poll", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    electionType: {
      type: DataTypes.ENUM,
      values: ["department", "faculty"],
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
  // Poll.hasMany(models.candidate, { foreignKey: "candidate_id" });

  // Define the associations
  // Poll.associate = (models) => {
  //   Poll.hasMany(models.candidate, { foreignKey: "candidate_id" });

  //   // Poll.belongsTo(models.Admin);
  //   // Poll.belongsTo(Faculty);
  //   // Poll.belongsTo(Department);
  // };

  return Poll;
};
