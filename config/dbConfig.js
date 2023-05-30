require("dotenv").config();

module.exports = {
  HOST: "localhost",
  USER: "hbstudent",
  PASSWORD: "hbstudent",
  DB: "school_votingdb",
  dialect: "mysql",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
