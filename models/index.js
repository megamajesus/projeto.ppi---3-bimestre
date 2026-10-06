const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const Espaco = require('./espaco')(sequelize);

const inicializarBanco = async () => {
  await sequelize.sync();

  const quantidade = await Espaco.count();
  if (quantidade === 0) {
    await Espaco.bulkCreate([
      {
        nome: 'Laboratório de Redes',
        localizacao: 'Bloco A, Sala 102',
        capacidade: 30,
        recursos: 'Roteadores Cisco, Switches, Racks de Patch Panel, Cabos UTP Cat6',
        situacao: 'Disponível'
      },
      {
        nome: 'Sala Maker',
        localizacao: 'Bloco B, Sala 05',
        capacidade: 20,
        recursos: 'Impressoras 3D, Placas Arduino, Ferramentas de Eletrônica, Cortadora Laser',
        situacao: 'Em uso'
      },
      {
        nome: 'Auditório Principal',
        localizacao: 'Prédio Central',
        capacidade: 150,
        recursos: 'Projetor 4K, Sistema de Som Surround, Microfones Sem Fio, Ar-condicionado',
        situacao: 'Disponível'
      },
      {
        nome: 'Laboratório de Informática',
        localizacao: 'Bloco A, Sala 108',
        capacidade: 40,
        recursos: 'Computadores Core i7, Monitores Duplos, Quadros Brancos, Projetor',
        situacao: 'Disponível'
      },
      {
        nome: 'Sala de Audiovisual',
        localizacao: 'Bloco C, Sala 12',
        capacidade: 25,
        recursos: 'Câmeras DSLR, Iluminação Softbox, Fundo Verde (Chroma Key), Ilha de Edição',
        situacao: 'Em manutenção'
      },
      {
        nome: 'Biblioteca Setorial',
        localizacao: 'Prédio Central, Pavimento Superior',
        capacidade: 80,
        recursos: 'Mesas de Estudo Individual, Computadores para Pesquisa, Acervo Físico, Wi-Fi',
        situacao: 'Disponível'
      }
    ]);
  }
};

module.exports = { sequelize, Espaco, inicializarBanco };