# Mural de Publicações — Aula 02

Projeto didático completo e funcional para revisar a integração entre Node.js,
Express, Handlebars, Sequelize e SQLite.

## Requisitos

- Node.js 18 ou superior;
- npm.

## Execução

Abra o terminal na pasta do projeto e execute:

```bash
npm install
npm start
```

Depois, acesse:

```text
http://localhost:3000
```

## Páginas disponíveis

- `/` — apresentação do projeto;
- `/publicacoes` — listagem recuperada do banco;
- `/publicacoes/1` — detalhes de uma publicação;
- `/saude` — verificação simples do servidor;
- qualquer endereço inexistente — página 404.

## Banco de dados

Na primeira execução, a aplicação cria automaticamente:

```text
database/mural.sqlite
```

Se o banco estiver vazio, seis publicações didáticas serão inseridas. Para
reiniciar os dados, encerre o servidor, exclua `database/mural.sqlite` e execute
`npm start` novamente.

## Testes

```bash
npm test
```

Os testes verificam a página inicial, a listagem, os detalhes, o endpoint de
saúde e a resposta 404.

## Estrutura

```text
mural-servidor-aula-02/
├── app.js
├── server.js
├── package.json
├── database/
├── models/
├── routes/
├── public/
├── views/
└── test/
```

## Fluxo principal

```text
navegador → Express → rota → Sequelize → SQLite
                              ↓
                         Handlebars
                              ↓
                        página HTML
```

O projeto está propositalmente completo, sem lacunas `TODO`. Ele poderá ser
copiado posteriormente para a criação da versão orientada aos estudantes.
