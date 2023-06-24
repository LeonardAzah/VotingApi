module.exports = (sequelize, DataTypes) => {
  const DepartmentVote = sequelize.define("departmentvote", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
  });

  return DepartmentVote;
};
