const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../app");
const { prepararBanco } = require("../server");
const { sequelize, Espaco } = require("../models");

let app;

test.before(async () => {
  await prepararBanco();
  app = createApp();
});

test.after(async () => {
  await sequelize.close();
});

test("GET / responde 200 e apresenta o título do projeto", async () => {
  const resposta = await request(app).get("/");

  assert.equal(resposta.status, 200);
  assert.match(resposta.text, /Laboratórios e Espaços/);
  assert.match(resposta.text, /Painel de laboratórios e espaços/);
  assert.match(resposta.text, /href="\/espacos"/);
});

test("a página inicial apresenta três destaques vindos do banco", async () => {
  const resposta = await request(app).get("/");
  const destaques = resposta.text.match(/class="destaque"/g) ?? [];

  assert.equal(destaques.length, 3);
  assert.match(resposta.text, /Auditório/);
});

test("GET /saude responde 200 e JSON { status: 'ok' }", async () => {
  const resposta = await request(app).get("/saude");

  assert.equal(resposta.status, 200);
  assert.equal(resposta.body.status, "ok");
});

test("GET /espacos responde 200 e apresenta a listagem", async () => {
  const resposta = await request(app).get("/espacos");

  assert.equal(resposta.status, 200);
  assert.match(resposta.text, /Espaços cadastrados/);
  assert.match(resposta.text, /Laboratório de redes/);
  assert.match(resposta.text, /Sala maker/);
});

test("a listagem exibe a situação em texto e um cartão por registro", async () => {
  const total = await Espaco.count();
  const resposta = await request(app).get("/espacos");
  const cartoes = resposta.text.match(/class="cartao-espaco"/g) ?? [];

  assert.equal(cartoes.length, total);
  assert.match(resposta.text, /Disponível/);
  assert.match(resposta.text, /Em uso/);
  assert.match(resposta.text, /Em manutenção/);
});

test("a listagem está em ordem alfabética pelo nome", async () => {
  const resposta = await request(app).get("/espacos");
  const nomes = [...resposta.text.matchAll(/cartao-espaco__nome">([^<]+)</g)].map(
    (m) => m[1]
  );

  assert.ok(nomes.length >= 6);
  assert.deepEqual(nomes, [...nomes].sort((a, b) => a.localeCompare(b, "pt-BR")));
});

test("GET /espacos/1 abre um registro existente", async () => {
  const espaco = await Espaco.findByPk(1);

  assert.ok(espaco, "O registro de ID 1 deve existir");

  const resposta = await request(app).get("/espacos/1");

  assert.equal(resposta.status, 200);
  assert.match(resposta.text, new RegExp(espaco.nome));
  assert.match(resposta.text, new RegExp(espaco.localizacao));
  assert.match(resposta.text, /Situação atual/);
  assert.match(resposta.text, /href="\/espacos"/);
});

test("o detalhamento mostra todos os campos obrigatórios", async () => {
  const resposta = await request(app).get("/espacos/1");

  for (const rotulo of ["Nome", "Localização", "Capacidade", "Recursos", "Situação"]) {
    assert.match(resposta.text, new RegExp(`<dt>${rotulo}</dt>`));
  }
});

test("GET /espacos/99999 responde 404", async () => {
  const resposta = await request(app).get("/espacos/99999");

  assert.equal(resposta.status, 404);
  assert.match(resposta.text, /Espaço não encontrado/);
});

test("GET /espacos/abc responde 404", async () => {
  const resposta = await request(app).get("/espacos/abc");

  assert.equal(resposta.status, 404);
  assert.match(resposta.text, /Espaço não encontrado/);
});

test("identificadores zero, negativos e decimais respondem 404", async () => {
  for (const id of ["0", "-1", "1.5"]) {
    const resposta = await request(app).get(`/espacos/${id}`);
    assert.equal(resposta.status, 404, `/espacos/${id} deveria responder 404`);
  }
});

test("uma rota desconhecida responde 404 com a página contextualizada", async () => {
  const resposta = await request(app).get("/rota-inexistente");

  assert.equal(resposta.status, 404);
  assert.match(resposta.text, /Espaço não encontrado/);
  assert.match(resposta.text, /href="\/espacos"/);
});

test("uma falha interna responde 500 sem expor detalhes técnicos", async (t) => {
  t.mock.method(Espaco, "findAll", async () => {
    throw new Error("SELECT secreto FROM tabela_interna");
  });
  t.mock.method(console, "error", () => {});

  const resposta = await request(app).get("/espacos");

  assert.equal(resposta.status, 500);
  assert.match(resposta.text, /falha inesperada/i);
  assert.doesNotMatch(resposta.text, /SELECT|tabela_interna|node_modules/);
});

test("reiniciar o banco não duplica os dados iniciais", async () => {
  const antes = await Espaco.count();

  await prepararBanco();

  const depois = await Espaco.count();

  assert.ok(antes >= 6, "Devem existir pelo menos seis registros iniciais");
  assert.equal(depois, antes);
});

test("os testes não dependem de conteúdo do projeto de achados e perdidos", async () => {
  const resposta = await request(app).get("/espacos");

  assert.doesNotMatch(resposta.text, /Achados e Perdidos|Garrafa azul|\/itens/);
});
