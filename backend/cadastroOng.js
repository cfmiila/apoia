const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY || '';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient(); // Instância do Prisma
const router = express.Router();

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

router.post('/create', async (req, res) => {
  console.log('Corpo da requisição:', req.body);

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
    console.error('Erro detalhado:', error);

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

module.exports = router;