const Faculty = require("./Faculty");
const Department = require("./Department");
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("admin", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "admin",
    },
    refreshtoken: {
      type: DataTypes.STRING,
    },
  });
  // Define the associations
  // Admin.associate = (models) => {
  //   Admin.belongsTo(models.Faculty);
  //   Admin.belongsTo(models.Department);
  //   Admin.hasMany(models.Poll);
  // };

  return Admin;
};
