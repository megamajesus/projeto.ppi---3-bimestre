// Importa o framework Express para gerenciar o roteamento
const express = require("express");

// Importa o modelo 'Espaco' do Sequelize para interagir com o banco de dados
const { Espaco } = require("../models");

// Cria uma nova instância de roteador do Express
const router = express.Router();

/**
 * ROTA: GET /
 * DESCRIÇÃO: Rota principal (Home) da aplicação.
 * Busca os 3 espaços com maior capacidade para exibir em destaque na página inicial.
 */
router.get("/", async (req, res, next) => {
  try {
    // Consulta o banco de dados para buscar os espaços em destaque
    const destaques = await Espaco.findAll({
      // Ordenação primária: maior capacidade primeiro (DESC)
      // Ordenação secundária: ordem alfabética pelo nome (ASC) para desempatar
      order: [
        ["capacidade", "DESC"],
        ["nome", "ASC"]
      ],
      limit: 3, // Limita o resultado a no máximo 3 registros
      raw: true // Retorna os dados como objetos JavaScript puros (ideal para views Handlebars)
    });

    // Renderiza a página inicial ('views/index.hbs') enviando o título e a lista de destaques
    res.render("index", {
      titulo: "Início",
      destaques
    });
  } catch (erro) {
    // Encaminha qualquer erro de execução para o tratamento de erros do Express
    next(erro);
  }
});

/**
 * ROTA: GET /saude
 * DESCRIÇÃO: Endpoint de verificação de integridade (Health Check).
 * Utilizado para checar se o servidor está online e respondendo adequadamente.
 */
router.get("/saude", (req, res) => {
  // Retorna resposta HTTP 200 (OK) com um objeto JSON informando o status
  res.status(200).json({ status: "ok" });
});

// Exporta o roteador com as rotas definidas para ser usado no app principal
module.exports = router;