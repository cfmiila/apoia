const supertest = require('supertest');
const app = require('./server.js');  // Importa o app do server.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const request = supertest(app); // Configura o Supertest com o app

describe('Testes para o endpoint /ong/create', () => {
  // Limpa o banco de dados antes de cada teste
  beforeEach(async () => {
    await prisma.Ong.deleteMany(); // Certifique-se de que "Ong" é o nome correto do modelo
  });

  // Teste 1: CNPJ inválido (não tem 14 caracteres ou não é numérico)
  it('Deve retornar 400 se o CNPJ for inválido', async () => {
    const response = await request
      .post('/ong/create')
      .send({
        nome: 'ONG válida',
        email: 'ong@valida.com',
        cnpj: '123', // CNPJ inválido
        senha: 'senha123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('CNPJ inválido');
  });

  // Teste 2: Nome com menos de 3 caracteres
  it('Deve retornar 400 se o nome tiver menos de 3 caracteres', async () => {
    const response = await request
      .post('/ong/create')
      .send({
        nome: 'ON', // Nome inválido
        email: 'ong@valida.com',
        cnpj: '12345678901234',
        senha: 'senha123',
      });
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Nome deve ter pelo menos 3 caracteres'); 
  });

  // Teste 3: Email inválido
  it('Deve retornar 400 se o email for inválido', async () => {
    const response = await request
      .post('/ong/create')
      .send({
        nome: 'ONG válida',
        email: 'email-invalido', // Email inválido
        cnpj: '12345678901234',
        senha: 'senha123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Email inválido');
  });

  // Teste 4: Dados válidos (deve retornar 200)
  it('Deve retornar 200 se os dados da ONG forem válidos', async () => {
    const response = await request
      .post('/ong/create')
      .send({
        nome: 'ONG válida',
        email: 'ong@valida.com',
        cnpj: '12345678901234',
        senha: 'senha123',
      });
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('ong'); // Verifica se a resposta contém a ONG
    expect(response.body.ong.nome).toBe('ONG válida'); // Verifica se o nome está correto
  });

  // Teste 5: CNPJ já cadastrado
  it('Deve retornar 400 se o CNPJ já estiver cadastrado', async () => {
    // Cadastra uma ONG com o mesmo CNPJ antes do teste
    await request
      .post('/ong/create')
      .send({
        nome: 'ONG existente',
        email: 'ong@existente.com',
        cnpj: '12345678901234',
        senha: 'senha123',
      });

    // Tenta cadastrar outra ONG com o mesmo CNPJ
    const response = await request
      .post('/ong/create')
      .send({
        nome: 'Nova ONG',
        email: 'nova@ong.com',
        cnpj: '12345678901234', // CNPJ já cadastrado
        senha: 'senha123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('CNPJ já cadastrado');
  });

  // Teste 6: Email já cadastrado
  it('Deve retornar 400 se o email já estiver cadastrado', async () => {
    // Cadastra uma ONG com o mesmo email antes do teste
    await request
      .post('/ong/create')
      .send({
        nome: 'ONG existente',
        email: 'ong@existente.com',
        cnpj: '12345678901234',
        senha: 'senha123',
      });

    // Tenta cadastrar outra ONG com o mesmo email
    const response = await request
      .post('/ong/create')
      .send({
        nome: 'Nova ONG',
        email: 'ong@existente.com', // Email já cadastrado
        cnpj: '98765432109876',
        senha: 'senha123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Email já cadastrado');
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});