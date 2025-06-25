const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get("/dashboard/counts", async (req, res) => {
  try {
    const [ongs, doacoes, campanhas, usuarios] = await Promise.all([
      prisma.ong.count(),
      prisma.doacao.count(),
      prisma.campanha.count(),
      prisma.usuario.count(),
    ]);
    
    res.json({ 
      success: true,
      counts: {
        ongs, 
        doacoes, 
        campanhas, 
        usuarios 
      }
    });
    
  } catch (error) {
    console.error("Erro no dashboard:", error);
    res.status(500).json({ 
      success: false,
      error: "Erro ao buscar dados",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;