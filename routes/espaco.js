const express = require('express');
const router = express.Router();
const { Espaco } = require('../models');

// Rota para verificar a saúde da API
router.get('/saude', (req, res) => {
  res.json({ status: 'OK' });
});

// Página Inicial
router.get('/', async (req, res) => {
  try {
    const espacos = await Espaco.findAll({ limit: 3 });
    res.render('index', { espacos });
  } catch (erro) {
    console.error(erro);
    res.status(500).render('erro');
  }
});

// Listagem de todos os Espaços / Laboratórios
router.get('/espacos', async (req, res) => {
  try {
    const espacos = await Espaco.findAll();
    res.render('espacos/listar', { espacos });
  } catch (erro) {
    console.error(erro);
    res.status(500).render('erro');
  }
});

// Detalhes de um Espaço específico
router.get('/espacos/:id', async (req, res) => {
  try {
    const espaco = await Espaco.findByPk(req.params.id);
    
    if (!espaco) {
      return res.status(404).render('404');
    }

    res.render('espacos/detalhar', { espaco });
  } catch (erro) {
    console.error(erro);
    res.status(500).render('erro');
  }
});

module.exports = router;