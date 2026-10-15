module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Publicacao",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      titulo: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 120]
        }
      },
      conteudo: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      autor: {
        type: DataTypes.STRING(80),
        allowNull: false,
        defaultValue: "Estudante"
      },
      categoria: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: "Geral"
      }
    },
    {
      tableName: "publicacoes",
      timestamps: true
    }
  );
};
