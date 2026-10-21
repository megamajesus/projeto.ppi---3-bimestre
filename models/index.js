const path = require("node:path");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database", "laboratorios-espacos.sqlite"),
  logging: false
});

const Espaco = require("./espaco")(sequelize, DataTypes);

module.exports = { sequelize, Espaco };
