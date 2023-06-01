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
db.candidate = require("./Candidate")(sequelize, Sequelize);
db.student = require("./Student")(sequelize, Sequelize);
db.poll = require("./Poll")(sequelize, Sequelize);
db.faculty = require("./Faculty")(sequelize, Sequelize);
db.department = require("./Department")(sequelize, Sequelize);

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes sync done!");
});

// db.poll.belongsTo(db.admin);
// db.poll.belongsTo(db.faculty);
// db.poll.belongsTo(db.department);
// db.poll.hasMany(db.candidate, { as: "candidates" });
// db.candidate.belongsTo(db.poll, { foreignKey: "candidateId", as: "cadidate" });

// db.student.belongsTo(db.faculty);
// db.student.belongsTo(db.department);

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
db.department.hasMany(db.student);

module.exports = db;
