const dbConfig = require("../config/dbConfig");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected...");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require("./Admin")(sequelize, Sequelize);
db.facultyCandidate = require("./FacultyCandidate")(sequelize, Sequelize);
db.departmentalCandidate = require("./DepartmentalCandidate")(
  sequelize,
  Sequelize
);
db.student = require("./Student")(sequelize, Sequelize);
db.facultyPoll = require("./FacultyPoll")(sequelize, Sequelize);
db.departmentalPoll = require("./DepartmentalPoll")(sequelize, Sequelize);
db.faculty = require("./Faculty")(sequelize, Sequelize);
db.department = require("./Department")(sequelize, Sequelize);
db.vote = require("./Vote")(sequelize, Sequelize);

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes sync done!");
});

db.faculty.hasMany(db.department, {
  foreignKey: "faculty_id",
  as: "department",
});
db.department.belongsTo(db.faculty, {
  foreignKey: "faculty_id",
  as: "faculty",
});

db.student.belongsTo(db.faculty, { foreignKey: "faculty_id", as: "faculty" });
db.student.belongsTo(db.department, {
  foreignKey: "department_id",
  as: "department",
});

db.admin.belongsTo(db.faculty, { foreignKey: "faculty_id", as: "faculty" });
db.admin.belongsTo(db.department, {
  foreignKey: "department_id",
  as: "department",
});

db.faculty.hasMany(db.student, { foreignKey: "faculty_id", as: "student" });
db.department.hasMany(db.student, {
  foreignKey: "department_id",
  as: "student",
});

db.departmentalPoll.belongsTo(db.department, {
  foreignKey: "department_id",
  as: "department",
});

db.student.hasMany(db.departmentalCandidate, {
  foreignKey: "student_id",
  // as: "student",
});
db.departmentalPoll.hasMany(db.departmentalCandidate, {
  foreignKey: "departmental_poll_id",
  as: "departmental_poll",
});

db.facultyPoll.belongsTo(db.faculty, {
  foreignKey: "faculty_id",
  as: "faculty",
});

db.facultyCandidate.belongsTo(db.student);

db.facultyCandidate.belongsTo(db.facultyPoll, {
  foreignKey: "faculty_poll_id",
});

db.vote.belongsTo(db.facultyPoll, {
  foreignKey: "pollId",
});
db.vote.belongsTo(db.student, {
  foreignKey: "studentId",
});
db.vote.belongsTo(db.facultyCandidate, {
  foreignKey: "candidateId",
});

module.exports = db;
