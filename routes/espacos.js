// Importa o framework Express para criação de rotas
const express = require("express");

// Importa o model 'Espaco' para realizar consultas na tabela do banco de dados
const { Espaco } = require("../models");

// Cria um roteador do Express para gerenciar as rotas deste módulo
const router = express.Router();

/**
 * ROTA: GET /espacos
 * DESCRIÇÃO: Lista todos os espaços em ordem alfabética.
 */
router.get("/", async (req, res, next) => {
  try {
    // Busca todos os registros na tabela 'Espaco'
    // 'order': ordena os resultados pelo campo 'nome' em ordem ascendente (A-Z)
    // 'raw: true': retorna objetos JS puros em vez de instâncias do Sequelize (mais leve para renderizar)
    const espacos = await Espaco.findAll({
      order: [["nome", "ASC"]],
      raw: true
    });

    // Renderiza a view 'espacos/listar.hbs' passando os dados necessários
    return res.render("espacos/listar", {
      titulo: "Espaços cadastrados",
      espacos, // Lista de espaços encontrados
      possuiEspacos: espacos.length > 0, // Booleano para validar na view se existem itens registrados
      quantidade: espacos.length // Quantidade total de espaços cadastrados
    });
  } catch (erro) {
    // Encaminha qualquer erro inesperado para o middleware de tratamento de erros do Express
    return next(erro);
  }
});

/**
 * ROTA: GET /espacos/:id
 * DESCRIÇÃO: Exibe os detalhes de um espaço específico com base no seu ID.
 */
router.get("/:id", async (req, res, next) => {
  try {
    // Converte o parâmetro 'id' vindo da URL de String para Número
    const id = Number(req.params.id);

    // Validação: verifica se o ID é um número inteiro válido e maior que zero
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(404).render("404", {
        titulo: "Espaço não encontrado"
      });
    }

    // Busca o espaço no banco de dados através da sua Chave Primária (Primary Key - PK)
    const espaco = await Espaco.findByPk(id, { raw: true });

    // Se o espaço não for encontrado no banco de dados, retorna a página de erro 404
    if (!espaco) {
      return res.status(404).render("404", {
        titulo: "Espaço não encontrado"
      });
    }

    // Renderiza a view 'espacos/detalhar.hbs' com os dados do espaço encontrado
    return res.render("espacos/detalhar", {
      titulo: espaco.nome,
      espaco
    });
  } catch (erro) {
    // Encaminha qualquer erro inesperado para o middleware de tratamento de erros
    return next(erro);
  }
});

// Exporta o roteador para ser utilizado no arquivo principal da aplicação (ex: app.js)
module.exports = router;