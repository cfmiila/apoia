const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/doacoes - Registrar nova doação
router.post("/", async (req, res) => {
  const { valor, idCampanha, idUsuario } = req.body;

  try {
    // Verifica se a campanha existe
    const campanha = await prisma.campanha.findUnique({
      where: { id: parseInt(idCampanha) }
    });

    if (!campanha) {
      return res.status(404).json({ error: "Campanha não encontrada" });
    }

    // Cria a doação
    const doacao = await prisma.doacao.create({
      data: {
        valor: parseFloat(valor),
        dataDoacao: new Date(),
        idUsuario: parseInt(idUsuario),
        idCampanha: parseInt(idCampanha)
      }
    });

    // Atualiza o valor arrecadado na campanha
    await prisma.campanha.update({
      where: { id: parseInt(idCampanha) },
      data: {
        valorArrecadado: {
          increment: parseFloat(valor)
        }
      }
    });

    res.status(201).json(doacao);
  } catch (err) {
    res.status(400).json({
      error: "Erro ao registrar doação",
      details: err.message
    });
  }
});

// GET /api/doacoes - Listar doações (com filtro opcional)
router.get("/", async (req, res) => {
  const { campanhaId, usuarioId } = req.query;

  try {
    const doacoes = await prisma.doacao.findMany({
      where: {
        ...(campanhaId && { idCampanha: parseInt(campanhaId) }),
        ...(usuarioId && { idUsuario: parseInt(usuarioId) })
      },
      include: {
        campanha: {
          select: {
            nome: true
          }
        },
        usuario: {
          select: {
            nome: true
          }
        }
      }
    });
    
    res.json(doacoes);
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar doações",
      details: err.message
    });
  }
});

module.exports = router;