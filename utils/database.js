const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodejs-assignment", "root", "Pratik@2001", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
