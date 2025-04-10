const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY || ''; 
require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors');
const { PrismaClient } = require('@prisma/client'); 

const prisma = new PrismaClient();
const app = express();
app.use(cors());
const port = 3100;
//ong
const validateOngData = ({ nome, email, cnpj }) => {
  // validação do CNPJ
  if (!cnpj || cnpj.length !== 14 || !/^\d+$/.test(cnpj)) {
    return { isValid: false, error: 'CNPJ inválido' };
  }
  if (!nome || nome.length < 3) {
    return { isValid: false, error: 'Nome deve ter pelo menos 3 caracteres' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { isValid: false, error: 'Email inválido' };
  }

  return { isValid: true };
};


app.post('/ong/create', async (req, res) => {
  const { nome, email, senha, cnpj, telefone, descricao } = req.body;
  if (!validarSenhaForte(senha)) {
    return res.status(400).json({ 
      error: 'Senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais' 
    });
  }
  const validation = validateOngData(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    // aqui vai verificar se o CNPJ ou email já existem
    const [cnpjExistente, emailExistente] = await Promise.all([
      prisma.ong.findUnique({ where: { cnpj } }),
      prisma.ong.findUnique({ where: { email } }),
    ]);

    if (cnpjExistente) {
      return res.status(400).json({ error: 'CNPJ já cadastrado' });
    }

    if (emailExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

  
    const ong = await prisma.ong.create({
      data: { nome, email, cnpj, senha, telefone, descricao },
    });

    // Retorna a mensagem de sucesso e a ONG criada
    res.status(200).json({ message: 'ONG cadastrada com sucesso', ong });
  } catch (error) {
    console.error('Erro ao criar ONG:', error);
    res.status(500).json({ error: 'Erro ao criar ONG', details: error.message });
  }
});
//editar (ong)

app.put('/ong/update/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, cnpj, telefone, descricao } = req.body;

  try {
    const ongExistente = await prisma.ong.findUnique({ where: { id: parseInt(id) } });
    if (!ongExistente) {
      return res.status(404).json({ error: 'ONG não encontrada' });
    }

    const ongAtualizada = await prisma.ong.update({
      where: { id: parseInt(id) },
      data: { nome, email, senha, cnpj, telefone, descricao },
    });

    res.status(200).json(ongAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar ONG:', error);
    res.status(500).json({ error: 'Erro ao atualizar ONG', details: error.message });
  }
});
//deletar ONG
app.delete('/ong/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const ongExistente = await prisma.ong.findUnique({ where: { id: parseInt(id) } });
    if (!ongExistente) {
      return res.status(404).json({ error: 'ONG não encontrada' });
    }

    await prisma.ong.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: 'ONG deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar ONG:', error);
    res.status(500).json({ error: 'Erro ao deletar ONG', details: error.message });
  }
});