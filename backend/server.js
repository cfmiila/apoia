require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = 3100;

// Configurações de Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Middleware de Autenticação
function autenticarToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Rotas de Autenticação
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Rotas de Usuário
app.post('/usuario/create', async (req, res) => {
  const { cpf, nome, email, senha, tipo } = req.body;

  if (!validarSenhaForte(senha)) {
    return res.status(400).json({
      error: 'Senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais'
    });
  }

  try {
    const usuario = await prisma.usuario.create({
      data: { 
        cpf, 
        nome, 
        email, 
        senha: await bcrypt.hash(senha, 10), 
        tipo 
      },
    });
    res.status(201).json(usuario);
  } catch (error) {
    handleError(res, error, 'Erro ao criar usuário');
  }
});

app.get('/usuario/list', autenticarToken, async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.status(200).json(usuarios);
  } catch (error) {
    handleError(res, error, 'Erro ao listar usuários');
  }
});

// Rotas de ONG
app.post('/ong/create', async (req, res) => {
  const { nome, email, senha, cnpj, telefone, descricao } = req.body;
  
  if (!validarSenhaForte(senha)) {
    return res.status(400).json({
      error: 'Senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais'
    });
  }

  try {
    const ong = await prisma.ong.create({
      data: { 
        nome, 
        email, 
        senha: await bcrypt.hash(senha, 10), 
        cnpj, 
        telefone, 
        descricao 
      },
    });
    res.status(201).json(ong);
  } catch (error) {
    handleError(res, error, 'Erro ao criar ONG');
  }
});

// Rotas de Campanha
app.post('/campanha/create', autenticarToken, async (req, res) => {
  const { nome, descricao, meta, idOng } = req.body;

  try {
    const campanha = await prisma.campanha.create({
      data: { nome, descricao, meta, idOng },
    });
    res.status(201).json(campanha);
  } catch (error) {
    handleError(res, error, 'Erro ao criar campanha');
  }
});

// Rotas de Doação
app.post('/doacao/create', autenticarToken, async (req, res) => {
  const { valor, idUsuario, idCampanha } = req.body;

  try {
    const doacao = await prisma.doacao.create({
      data: { valor, idUsuario, idCampanha },
    });
    res.status(201).json(doacao);
  } catch (error) {
    handleError(res, error, 'Erro ao criar doação');
  }
});

// Rotas de Pagamento
app.use('/pagamento', require('./routes/pagamento'));

// Funções Auxiliares
function validarSenhaForte(senha) {
  const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regexSenha.test(senha);
}

function handleError(res, error, message) {
  console.error(`${message}:`, error);
  res.status(500).json({ 
    error: message,
    details: error.message 
  });
}

// Inicialização do Servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;