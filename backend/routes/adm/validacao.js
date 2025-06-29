const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/ongs-pendentes', async (req, res) => {
  try {
    const ongsPendentes = await prisma.ong.findMany({
      where: { status: "pendente" },
    });
    res.json(ongsPendentes);
  } catch (error) {
    console.error('Erro ao buscar ONGs pendentes:', error);
    res.status(500).json({ error: 'Erro ao buscar ONGs pendentes' });
  }
});

router.put('/ongs/:id/validar', async (req, res) => {
  const { id } = req.params;

  try {
    const ongAtualizada = await prisma.ong.update({
      where: { id: Number(id) },
      data: { status: "aprovada" },
    });
    res.json({ message: 'ONG validada com sucesso', ong: ongAtualizada });
  } catch (error) {
    console.error('Erro ao validar ONG:', error);
    res.status(500).json({ error: 'Erro ao validar ONG' });
  }
});


router.put('/ongs/:id/rejeitar', async (req, res) => {
  const { id } = req.params;

  try {
    const ongAtualizada = await prisma.ong.update({
      where: { id: Number(id) },
      data: { status: "rejeitada" },
    });
    res.json({ message: 'ONG rejeitada com sucesso', ong: ongAtualizada });
  } catch (error) {
    console.error('Erro ao rejeitar ONG:', error);
    res.status(500).json({ error: 'Erro ao rejeitar ONG' });
  }
});


module.exports = router;
