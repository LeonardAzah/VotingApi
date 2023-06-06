// const Department = require("../model/Department");

module.exports = (sequelize, DataTypes) => {
  const Faculty = sequelize.define("faculty", {
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
  });

  Faculty.prototype.addDepartment = function (department) {
    return department.setFaculty(this);
  };
  Faculty.prototype.addFacultyPoll = function (poll) {
    return poll.setFaculty(this);
  };

  return Faculty;
};
