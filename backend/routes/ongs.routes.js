const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/ongs
router.get("/", async (req, res) => {
  try {
    const ongs = await prisma.ong.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        descricao: true,
        status: true,
        dataCadastro: true,
        cnpj: true,
      },
      orderBy: {
        dataCadastro: "desc", // Ordena por data de cadastro (mais recentes primeiro)
      },
    });

    res.json(ongs);
  } catch (err) {
    console.error("Erro detalhado:", err);
    res.status(500).json({
      error: "Erro ao buscar ONGs",
      details:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Erro interno do servidor",
    });
  }
});

// GET /api/ongs/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const ong = await prisma.ong.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        descricao: true,
        status: true,
        dataCadastro: true,
        cnpj: true,
      },
    });

    if (!ong) {
      return res.status(404).json({ error: "ONG não encontrada" });
    }

    res.json(ong);
  } catch (err) {
    console.error("Erro detalhado:", err);
    res.status(500).json({
      error: "Erro ao buscar ONG",
      details:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Erro interno do servidor",
    });
  }
});

module.exports = router;
