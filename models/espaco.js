const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Espaco = sequelize.define('Espaco', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    localizacao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    recursos: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    situacao: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Espaco;
};