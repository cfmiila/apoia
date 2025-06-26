const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();
const validarSenhaForte = (senha) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(senha);
};

const validarCPF = (cpf) => {
  if (!cpf) return false;
  // Remove caracteres não numéricos e verifica se tem 11 dígitos
  const justNums = cpf.replace(/\D/g, '');
  return /^\d{11}$/.test(justNums);
};


router.post('/create', async (req, res) => {
  console.log('Recebido para cadastro de doador:', req.body);

  try {
    const { nome, email, senha, cpf, telefone, endereco } = req.body;

    // 1. Validação dos dados de entrada
    if (!nome || !email || !senha || !cpf || !endereco) {
      return res.status(400).json({ error: 'Campos obrigatórios (nome, email, senha, cpf, endereço) não foram preenchidos.' });
    }
    if (!validarSenhaForte(senha)) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.' });
    }
    if (!validarCPF(cpf)) {
      return res.status(400).json({ error: 'CPF inválido. Forneça 11 dígitos numéricos.' });
    }
    if (!endereco.cep || !endereco.logradouro || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado) {
        return res.status(400).json({ error: 'Endereço incompleto. CEP, logradouro, número, bairro, cidade e estado são obrigatórios.' });
    }

    const [emailExistente, cpfExistente] = await Promise.all([
      prisma.usuario.findUnique({ where: { email } }),
      prisma.usuario.findUnique({ where: { cpf } }),
    ]);

    if (emailExistente) {
      return res.status(409).json({ error: 'Este email já está em uso.' }); 
    }
    if (cpfExistente) {
      return res.status(409).json({ error: 'Este CPF já está cadastrado.' });
    }

    // 3. Hashear a senha
    const hashedSenha = await bcrypt.hash(senha, 10);


    const novoUsuario = await prisma.$transaction(async (tx) => {
      
      const novoEndereco = await tx.endereco.create({
        data: {
          cep: endereco.cep,
          logradouro: endereco.logradouro,
          numero: endereco.numero,
          complemento: endereco.complemento,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado,
        },
      });

      
      const usuario = await tx.usuario.create({
        data: {
          nome,
          email,
          cpf,
          senha: hashedSenha,
          telefone: telefone || null, 
          role: 'DOADOR',
          idEndereco: novoEndereco.id,
        },
      });

      return usuario;
    });

    const { senha: _, ...usuarioParaResposta } = novoUsuario;

    return res.status(201).json({
      success: true,
      message: 'Doador cadastrado com sucesso!',
      data: usuarioParaResposta,
    });

  } catch (error) {
    console.error('Erro detalhado no cadastro de doador:', error);
    if (error.code === 'P2002') {
      const field = error.meta?.target?.join(', ');
      return res.status(409).json({ error: `O campo '${field}' já está em uso.` });
    }

  
    return res.status(500).json({
      error: 'Ocorreu um erro interno no servidor. Por favor, tente novamente.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;