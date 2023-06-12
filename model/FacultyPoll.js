module.exports = (sequelize, DataTypes) => {
  const FacultyPoll = sequelize.define("facultyPoll", {
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

  FacultyPoll.prototype.hasVotedBy = async function (student) {
    const voteCount = await this.countStudents({ where: { id: student.id } });
    return voteCount > 0;
  };

  FacultyPoll.prototype.addVote = async function (candidate, { through }) {
    await this.addStudent(through.StudentId, { through });
  };

  return FacultyPoll;
};
