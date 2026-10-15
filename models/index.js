const path = require("node:path");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "database", "mural.sqlite"),
  logging: false
});

const Publicacao = require("./publicacao")(sequelize, DataTypes);

module.exports = { sequelize, Publicacao };
