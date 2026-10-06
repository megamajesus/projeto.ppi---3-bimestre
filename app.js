const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const espacosRoutes = require('./routes/espacos');

const app = express();

// Middlewares para JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware estático (CSS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware próprio para log de requisições
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Configuração do Handlebars com Helper personalizável
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
      formatarCapacidade: (qtd) => `${qtd} lugares`
    }
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Registrando rotas
app.use('/', espacosRoutes);

// Middleware 404 para rotas desconhecidas
app.use((req, res) => {
  res.status(404).render('404');
});

// Middleware de erro 500
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('erro');
});

module.exports = app;