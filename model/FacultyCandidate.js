module.exports = (sequelize, DataTypes) => {
  const FacultyCandidate = sequelize.define("faculty_candidate", {
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

  return FacultyCandidate;
};
