module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define("department", {
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

  Department.prototype.addDepartment = function (department) {
    return department.setDepartment(this);
  };
  Department.prototype.addDepartmentPoll = function (poll) {
    return poll.setDepartment(this);
  };

  return Department;
};
