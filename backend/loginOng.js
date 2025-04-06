const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || '';


router.post('/login/ong', async (req, res) => {
  const { email, senha } = req.body;

  try {
    
    const ong = await prisma.ong.findUnique({ 
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true,
        cnpj: true
      }
    });

    if (!ong) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

 
    const senhaValida = await bcrypt.compare(senha, ong.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    // Gera token JWT com tipo ONG
    const token = jwt.sign(
      { 
        id: ong.id, 
        tipo: 'ONG',
        nome: ong.nome,
        cnpj: ong.cnpj
      }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      token,
      ong: {
        id: ong.id,
        nome: ong.nome,
        email: ong.email,
        cnpj: ong.cnpj
      }
    });
  } catch (error) {
    console.error('Erro no login da ONG:', error);
    res.status(500).json({ error: 'Erro no login', details: error.message });
  }
});

module.exports = router;