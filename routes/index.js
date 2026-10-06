const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    titulo: "Mural de Publicações",
    subtitulo: "Node.js, Express, Handlebars, Sequelize e SQLite"
  });
});

router.get("/saude", (req, res) => {
  res.json({ status: "ok", aplicacao: "mural-servidor-aula-02" });
});

module.exports = router;
