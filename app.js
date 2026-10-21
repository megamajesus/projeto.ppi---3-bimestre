const path = require("node:path");
const express = require("express");
const { engine } = require("express-handlebars");

const indexRouter = require("./routes/index");
const espacosRouter = require("./routes/espacos");

const MENSAGENS_SITUACAO = {
  "Disponível":
    "O espaço está livre e pode ser utilizado. Confirme a reserva com o responsável pelo setor.",
  "Em uso":
    "O espaço está ocupado no momento. Consulte o responsável para saber o próximo horário livre.",
  "Em manutenção":
    "O espaço está temporariamente indisponível para manutenção ou reparos."
};

const helpers = {
  // Resume textos longos para os cartões da listagem
  resumir(texto, limite) {
    const valor = String(texto ?? "").trim();
    const max = Number.isInteger(limite) ? limite : 60;

    return valor.length > max ? `${valor.slice(0, max - 1).trimEnd()}…` : valor;
  },

  // "Em manutenção" -> "em-manutencao" (usado como sufixo de classe CSS)
  classeSituacao(situacao) {
    return String(situacao ?? "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  },

  mensagemSituacao(situacao) {
    return MENSAGENS_SITUACAO[situacao] ?? "Consulte o responsável pelo espaço.";
  },

  pessoas(quantidade) {
    return `${quantidade} ${Number(quantidade) === 1 ? "pessoa" : "pessoas"}`;
  },

  registros(quantidade) {
    return `${quantidade} ${Number(quantidade) === 1 ? "registro" : "registros"}`;
  }
};

function createApp() {
  const app = express();

  app.engine(
    "hbs",
    engine({
      extname: ".hbs",
      defaultLayout: "main",
      layoutsDir: path.join(__dirname, "views", "layouts"),
      partialsDir: path.join(__dirname, "views", "partials"),
      helpers
    })
  );

  app.set("view engine", "hbs");
  app.set("views", path.join(__dirname, "views"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "public")));

  // Middleware próprio: registra método, endereço e horário de cada requisição
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });

  app.use("/", indexRouter);
  app.use("/espacos", espacosRouter);

  // 404 — depois de todas as rotas válidas
  app.use((req, res) => {
    res.status(404).render("404", {
      titulo: "Espaço não encontrado"
    });
  });

  // 500 — por último e com quatro parâmetros
  // eslint-disable-next-line no-unused-vars
  app.use((erro, req, res, next) => {
    // Detalhes técnicos ficam apenas no terminal do servidor
    console.error("Erro tratado pela aplicação:", erro);

    if (res.headersSent) {
      return next(erro);
    }

    return res.status(500).render("erro", {
      titulo: "Erro inesperado"
    });
  });

  return app;
}

module.exports = { createApp };
