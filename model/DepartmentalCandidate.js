module.exports = (sequelize, DataTypes) => {
  const DepartmentalCandidate = sequelize.define("departmentalCandidate", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
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

  return DepartmentalCandidate;
};
