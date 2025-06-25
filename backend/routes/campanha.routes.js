const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/campanhas
router.get("/", async (req, res) => {
  const { ongId } = req.query;
  
  try {
    const campanhas = await prisma.campanha.findMany({
      where: ongId ? { idOng: parseInt(ongId) } : undefined
    });
    res.json(campanhas);
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar campanhas",
      details: err.message
    });
  }
});

// POST /api/campanhas
router.post("/", async (req, res) => {
  const { nome, descricao, meta, imageUrl, dataFim, idOng } = req.body;

  try {
    const nova = await prisma.campanha.create({
      data: {
        nome,
        descricao,
        meta: parseFloat(meta),
        imageUrl,
        dataFim: dataFim ? new Date(dataFim) : null,
        idOng: parseInt(idOng),
      },
    });
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({
      error: "Erro ao criar campanha",
      details: err.message,
    });
  }
});

// PUT /api/campanhas/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, meta, imageUrl, dataFim } = req.body;

  try {
    const atualizada = await prisma.campanha.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        descricao,
        meta: parseFloat(meta),
        imageUrl,
        dataFim: dataFim ? new Date(dataFim) : null,
      },
    });
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({
      error: "Erro ao atualizar campanha",
      details: err.message,
    });
  }
});

// DELETE /api/campanhas/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.campanha.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({
      error: "Erro ao excluir campanha",
      details: err.message,
    });
  }
});

module.exports = router;
