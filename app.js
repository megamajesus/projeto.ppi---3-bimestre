// Puxa as ferramentas principais que vamos usar no projeto
const express = require("express"); // O "motor" do nosso servidor web
const { engine } = require("express-handlebars"); // A ferramenta que desenha as páginas HTML misturadas com dados
const path = require("path"); // Ajuda a encontrar os caminhos das pastas no computador

const app = express(); // Cria o nosso aplicativo/servidor

// 1. CONFIGURAÇÃO DA APARÊNCIA (Handlebars)
// Aqui a gente avisa o Express que vamos usar o Handlebars para montar as páginas HTML
app.engine("hbs", engine({
    extname: ".hbs",
    defaultLayout: "main" // Todo HTML vai usar esse layout padrão (cabeçalho, rodapé)
}));
app.set("view engine", "hbs"); // Define que os arquivos de visualização terminam com .hbs
app.set("views", path.join(__dirname, "views")); // Mostra onde a pasta "views" (telas) está guardada

// 2. CONFIGURAÇÕES BÁSICAS E SEGURANÇA (Middlewares)
// Permite que o servidor entenda dados enviados em formato JSON e de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Libera a pasta "public" para o navegador conseguir ler os arquivos de estilo (CSS) e imagens
app.use(express.static(path.join(__dirname, "public")));

// Nosso próprio "fiscal" de rotas: toda vez que alguém acessar uma página, 
// ele imprime no terminal do computador qual foi o link e se foi um acesso do tipo GET ou POST
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next(); // Manda o pedido seguir viagem para a próxima etapa
});

// 3. TRAZENDO AS REGRAS E BANCO DE DADOS
// (A rota de espaços e o model foram desativados temporariamente para o servidor não dar erro)
// const espacosRouter = require('./routes/espacos'); 
// const Espaco = require("./models/Espaco");

// 4. AS ROTAS DO SITE (O que acontece quando entram em cada link)

// Quando alguém entra na página principal (o site puro, ex: "meusite.com/")
app.get("/", async (req, res, next) => {
    try {
        // Renderiza a página "index.hbs" direto (sem buscar no banco por enquanto)
        res.render("index", { destaques: [] });
    } catch (error) {
        next(error); // Se der algum pepino, joga o erro para o sistema tratar
    }
});

// Página de teste de saúde/diagnóstico do servidor (responde um "ok" em formato JSON)
app.get("/saude", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// (Rota de espaços desativada temporariamente)
// app.use("/espacos", espacosRouter);

// 5. SE O CLIENTE TENTAR ENTRAR NUM LINK QUE NÃO EXISTE (Erro 404)
app.use((req, res, next) => {
    res.status(404).render("404"); // Mostra a página bonitinha de "espaço não encontrado"
});

// 6. SE DER ALGUM ERRO GRAVE NO SERVIDOR (Erro 500)
// Precisa ter exatamente esses 4 pedacinhos (err, req, res, next) para o Express saber que é o protetor de erros
app.use((err, req, res, next) => {
    console.error("Erro interno:", err.stack); // Mostra o erro real no terminal para você programador ver
    res.status(500).render("erro"); // Mostra uma página amigável de erro para o usuário (sem expor códigos feios)
});

// Exporta o aplicativo pronto para ser ligado pelo arquivo server.js
module.exports = app;