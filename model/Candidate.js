// const Faculty = require("../model/Faculty");
const Poll = require("../model/Poll");
module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define("candidate", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    matricule: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  // Define the associations
  // Candidate.associate = (models) => {
  //   Candidate.belongsTo(Poll);

  //   // Poll.belongsTo(models.Admin);
  //   // Poll.belongsTo(Faculty);
  //   // Poll.belongsTo(Department);
  // };

  // Candidate.belongsTo(Student);

  return Candidate;
};
