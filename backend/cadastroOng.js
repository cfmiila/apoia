const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY || '';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});
const app = express();


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // URL exata do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware de logs detalhados
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const port = 3100;

// Validações
const validarSenhaForte = (senha) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(senha);
};

const validateOngData = ({ nome, email, cnpj }) => {
  if (!nome || nome.length < 3) {
    return { isValid: false, error: 'Nome deve ter pelo menos 3 caracteres' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { isValid: false, error: 'Email inválido' };
  }

  if (!cnpj || cnpj.length !== 14 || !/^\d+$/.test(cnpj)) {
    return { isValid: false, error: 'CNPJ inválido (deve ter 14 dígitos numéricos)' };
  }

  return { isValid: true };
};

// Rota corrigida - versão consistente com o frontend
app.post('/api/v1/ong/create', async (req, res) => {
  console.log('Corpo da requisição:', req.body); // Log detalhado
  
  try {
    const { nome, email, senha, cnpj, telefone, descricao } = req.body;

    // Validações
    if (!validarSenhaForte(senha)) {
      return res.status(400).json({ 
        error: 'Senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais' 
      });
    }

    const validation = validateOngData({ nome, email, cnpj });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    // Verifica se ONG já existe
    const [cnpjExistente, emailExistente] = await Promise.all([
      prisma.ong.findUnique({ where: { cnpj } }),
      prisma.ong.findUnique({ where: { email } }),
    ]);

    if (cnpjExistente || emailExistente) {
      return res.status(400).json({ 
        error: cnpjExistente ? 'CNPJ já cadastrado' : 'Email já cadastrado',
        field: cnpjExistente ? 'cnpj' : 'email'
      });
    }

    // Cria a ONG com senha hasheada
    const hashedSenha = await bcrypt.hash(senha, 10);
    const ong = await prisma.ong.create({
      data: { 
        nome, 
        email, 
        cnpj, 
        senha: hashedSenha,
        telefone, 
        descricao 
      },
    });

    // Remove a senha hash da resposta
    const { senha: _, ...ongSemSenha } = ong;

    return res.status(201).json({ 
      success: true,
      message: 'ONG cadastrada com sucesso',
      data: ongSemSenha
    });

  } catch (error) {
    console.error('Erro detalhado:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta
    });
    
    // Tratamento específico para erros do Prisma
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'Violação de campo único',
        details: error.meta?.target 
      });
    }
    
    return res.status(500).json({ 
      error: 'Erro interno no servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected' // Adicione verificação real do banco se necessário
  });
});

// Rota alternativa mantida para compatibilidade
app.post('/ong/create', async (req, res) => {
  res.status(410).json({ 
    error: 'Esta rota está obsoleta',
    message: 'Use /api/v1/ong/create em vez disso'
  });
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Encerramento limpo
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Conexão com o banco de dados encerrada');
  process.exit(0);
});