const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/doacoes - Registrar nova doação (INALTERADO)
router.post("/", async (req, res) => {
  const { valor, idCampanha, idUsuario } = req.body;

  try {
    // Verifica se a campanha existe
    const campanha = await prisma.campanha.findUnique({
      where: { id: parseInt(idCampanha) },
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
        idCampanha: parseInt(idCampanha),
      },
    });

    // Atualiza o valor arrecadado na campanha
    await prisma.campanha.update({
      where: { id: parseInt(idCampanha) },
      data: {
        valorArrecadado: {
          increment: parseFloat(valor),
        },
      },
    });

    res.status(201).json(doacao);
  } catch (err) {
    res.status(400).json({
      error: "Erro ao registrar doação",
      details: err.message,
    });
  }
});

// GET /api/doacoes - Listar doações (com filtro opcional e filtro por ONG)
router.get("/", async (req, res) => {
  const { campanhaId, usuarioId, limit, ongId } = req.query; // ADICIONADO: 'limit' e 'ongId'

  try {
    const whereClause = {};

    if (campanhaId) {
      whereClause.idCampanha = parseInt(campanhaId);
    }
    if (usuarioId) {
      whereClause.idUsuario = parseInt(usuarioId);
    }

    // NOVO: Adiciona o filtro por ongId através da relação com a Campanha
    if (ongId) {
      whereClause.campanha = {
        idOng: parseInt(ongId), // Filtra as doações onde a campanha associada pertence a esta ONG
      };
    }

    const doacoes = await prisma.doacao.findMany({
      where: whereClause, // Usa a cláusula where construída dinamicamente
      take: limit ? parseInt(limit) : undefined, // Aplica o limite se presente
      orderBy: {
        dataDoacao: "desc", // Ordena pelas doações mais recentes
      },
      include: {
        campanha: {
          select: {
            nome: true,
            idOng: true, // Inclua idOng aqui para debug ou para uso futuro
          },
        },
        usuario: {
          select: {
            nome: true,
          },
        },
      },
    });

    res.json(doacoes);
  } catch (err) {
    console.error("Erro ao buscar doações:", err); // Log detalhado do erro
    res.status(500).json({
      error: "Erro ao buscar doações",
      details:
        process.env.NODE_ENV === "development"
          ? err.message // Mostra detalhes do erro apenas em desenvolvimento
          : "Erro interno do servidor",
    });
  }
});

module.exports = router;
