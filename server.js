const { sequelize, Espaco } = require("./models");
const { createApp } = require("./app");

const PORT = Number(process.env.PORT) || 3000;

const ESPACOS_INICIAIS = [
  {
    nome: "Laboratório de redes",
    localizacao: "Bloco B, sala 12",
    capacidade: 30,
    recursos:
      "Roteadores e switches Cisco, bancadas de montagem de cabos, servidores para prática e quadro branco.",
    situacao: "Disponível",
    icone: "images/icone-redes.svg"
  },
  {
    nome: "Sala maker",
    localizacao: "Bloco C, térreo",
    capacidade: 20,
    recursos:
      "Impressoras 3D, cortadora a laser, kits de Arduino e Raspberry Pi, ferramentas manuais e bancadas.",
    situacao: "Em uso",
    icone: "images/icone-maker.svg"
  },
  {
    nome: "Auditório",
    localizacao: "Bloco A, 1º andar",
    capacidade: 200,
    recursos:
      "Palco, projetor de alta resolução, sistema de som com microfones sem fio, ar-condicionado e acessibilidade.",
    situacao: "Disponível",
    icone: "images/icone-auditorio.svg"
  },
  {
    nome: "Laboratório de informática",
    localizacao: "Bloco B, sala 05",
    capacidade: 40,
    recursos:
      "40 computadores conectados à internet, projetor, softwares de programação e design instalados.",
    situacao: "Em manutenção",
    icone: "images/icone-informatica.svg"
  },
  {
    nome: "Sala de audiovisual",
    localizacao: "Bloco A, sala 03",
    capacidade: 35,
    recursos:
      "Telão, projetor, caixas de som, câmera para gravação de aulas e poltronas fixas.",
    situacao: "Em uso",
    icone: "images/icone-audiovisual.svg"
  },
  {
    nome: "Biblioteca setorial",
    localizacao: "Bloco D, térreo",
    capacidade: 120,
    recursos:
      "Acervo físico, mesas de estudo em grupo, cabines individuais, computadores para pesquisa e Wi-Fi.",
    situacao: "Disponível",
    icone: "images/icone-biblioteca.svg"
  }
];

async function prepararBanco() {
  await sequelize.authenticate();
  await sequelize.sync();

  // Só insere os dados iniciais quando a tabela está vazia (evita duplicação)
  const quantidade = await Espaco.count();

  if (quantidade === 0) {
    await Espaco.bulkCreate(ESPACOS_INICIAIS);
  }
}

async function iniciarServidor() {
  try {
    await prepararBanco();

    const app = createApp();

    return app.listen(PORT, () => {
      console.log(`Laboratórios e Espaços disponível em http://localhost:${PORT}`);
      console.log("Pressione Ctrl+C para encerrar.");
    });
  } catch (erro) {
    console.error("Não foi possível iniciar o servidor.");
    console.error(erro);
    process.exitCode = 1;
    return null;
  }
}

if (require.main === module) {
  iniciarServidor();
}

module.exports = { iniciarServidor, prepararBanco };
