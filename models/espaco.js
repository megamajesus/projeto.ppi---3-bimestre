const SITUACOES = ["Disponível", "Em uso", "Em manutenção"];

module.exports = (sequelize, DataTypes) => {
  const Espaco = sequelize.define(
    "Espaco",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      localizacao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      capacidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1
        }
      },
      recursos: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      situacao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [SITUACOES]
        }
      },
      // Campo adicional (explicado no README): caminho do ícone em public/images.
      icone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      tableName: "espacos",
      timestamps: true
    }
  );

  Espaco.SITUACOES = SITUACOES;

  return Espaco;
};
