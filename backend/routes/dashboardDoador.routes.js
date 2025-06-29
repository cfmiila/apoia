const router = require("express").Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/dashboard-doador/resumo/:idUsuario
// Resumo das doações do doador (total doado, número de campanhas/ongs apoiadas)
router.get("/resumo/:idUsuario", async (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);

  if (isNaN(idUsuario)) {
    return res.status(400).json({ error: "ID de usuário inválido." });
  }

  try {
    const [resumo] = await prisma.$queryRaw(
      Prisma.sql`
        SELECT
          CAST(COALESCE(SUM(d.valor), 0) AS DECIMAL(10,2)) AS totalDoado,
          COUNT(DISTINCT d.idCampanha) AS campanhasApoiadas,
          COUNT(DISTINCT c.idOng) AS ongsApoiadas
        FROM Doacao d
        JOIN Campanha c ON d.idCampanha = c.id
        WHERE d.idUsuario = ${idUsuario} AND d.status = 'concluido'
      `
    );

    res.json({
      totalDoado: Number(resumo?.totalDoado) || 0, // Garantir Number para JSON
      campanhasApoiadas: Number(resumo?.campanhasApoiadas) || 0, // Garantir Number para JSON
      ongsApoiadas: Number(resumo?.ongsApoiadas) || 0, // Garantir Number para JSON
    });
  } catch (err) {
    console.error("Erro ao buscar resumo do doador:", err);
    res.status(500).json({
      error: "Erro ao buscar resumo do doador",
      details: err.message,
    });
  }
});

// GET /api/dashboard-doador/minhas-doacoes/:idUsuario
// Lista todas as doações de um usuário específico
router.get("/minhas-doacoes/:idUsuario", async (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);

  if (isNaN(idUsuario)) {
    return res.status(400).json({ error: "ID de usuário inválido." });
  }

  try {
    const doacoes = await prisma.doacao.findMany({
      where: {
        idUsuario: idUsuario,
      },
      orderBy: {
        dataDoacao: "desc", // Ordena pelas doações mais recentes
      },
      include: {
        campanha: {
          select: {
            nome: true,
            ong: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    res.json(doacoes);
  } catch (err) {
    console.error("Erro ao buscar minhas doações:", err);
    res.status(500).json({
      error: "Erro ao buscar minhas doações",
      details: err.message,
    });
  }
});

// GET /api/dashboard-doador/doacoes-por-campanha/:idUsuario
// Agrupa o valor doado por campanha
router.get("/doacoes-por-campanha/:idUsuario", async (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);

  if (isNaN(idUsuario)) {
    return res.status(400).json({ error: "ID de usuário inválido." });
  }

  try {
    const doacoesPorCampanha = await prisma.$queryRaw`
      SELECT
        c.nome AS nomeCampanha,
        CAST(SUM(d.valor) AS DECIMAL(10,2)) AS valorTotal
      FROM Doacao d
      JOIN Campanha c ON d.idCampanha = c.id
      WHERE d.idUsuario = ${idUsuario} AND d.status = 'concluido'
      GROUP BY c.nome
      ORDER BY valorTotal DESC
    `;

    // Converte BigInt para Number, se necessário (para COUNT/SUM)
    const formattedData = doacoesPorCampanha.map((item) => ({
      nomeCampanha: item.nomeCampanha,
      valorTotal: Number(item.valorTotal),
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Erro ao buscar doações por campanha:", err);
    res.status(500).json({
      error: "Erro ao buscar doações por campanha",
      details: err.message,
    });
  }
});

// GET /api/dashboard-doador/doacoes-por-mes/:idUsuario
// Agrega doações por mês do ano atual para o doador
router.get("/doacoes-por-mes/:idUsuario", async (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);
  const anoAtual = new Date().getFullYear();

  if (isNaN(idUsuario)) {
    return res.status(400).json({ error: "ID de usuário inválido." });
  }

  try {
    const rows = await prisma.$queryRaw`
      SELECT
        DATE_FORMAT(d.dataDoacao, '%b') AS mes,
        CAST(SUM(d.valor) AS DECIMAL(10,2)) AS valor
      FROM Doacao d
      JOIN Campanha c ON c.id = d.idCampanha
      WHERE d.idUsuario = ${idUsuario}
        AND YEAR(d.dataDoacao) = ${anoAtual}
        AND d.status = 'concluido'
      GROUP BY YEAR(d.dataDoacao), MONTH(d.dataDoacao), DATE_FORMAT(d.dataDoacao, '%b')
      ORDER BY MONTH(d.dataDoacao)
    `;

    const formattedData = rows.map((item) => ({
      mes: item.mes,
      valor: Number(item.valor), // Converte BigInt para Number
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Erro ao buscar doações por mês para doador:", err);
    res.status(500).json({
      error: "Erro ao buscar doações por mês para doador",
      details: err.message,
    });
  }
});

// Rota para buscar detalhes de uma doação específica para o certificado
// GET /api/dashboard-doador/doacao/:idDoacao
router.get("/doacao/:idDoacao", async (req, res) => {
  const idDoacao = parseInt(req.params.idDoacao);

  if (isNaN(idDoacao)) {
    return res.status(400).json({ error: "ID da doação inválido." });
  }

  try {
    const doacao = await prisma.doacao.findUnique({
      where: { id: idDoacao },
      include: {
        campanha: {
          select: {
            nome: true,
            descricao: true,
            ong: {
              select: {
                nome: true,
                razaoSocial: true, // Adicione outros campos da ONG se necessário
                cnpj: true,
              },
            },
          },
        },
        usuario: {
          select: {
            nome: true,
            email: true, // Adicione outros campos do usuário se necessário
          },
        },
      },
    });

    if (!doacao) {
      return res.status(404).json({ error: "Doação não encontrada." });
    }

    res.json(doacao);
  } catch (err) {
    console.error("Erro ao buscar detalhes da doação:", err);
    res.status(500).json({
      error: "Erro ao buscar detalhes da doação",
      details: err.message,
    });
  }
});

module.exports = router;
