// routes/dashboard.js
const router = require("express").Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/dashboard/resumo?ongId=1
router.get("/resumo", async (req, res) => {
  const ongId = parseInt(req.query.ongId);

  try {
    // total arrecadado + doadores únicos
    const [totais] = await prisma.$queryRaw(
      Prisma.sql`
        SELECT
          COALESCE(SUM(d.valor), 0) AS totalDoacoes,
          COUNT(DISTINCT d.idUsuario) AS doadoresUnicos
        FROM Doacao d
        JOIN Campanha c ON c.id = d.idCampanha
        WHERE c.idOng = ${ongId} AND d.status = 'concluido'
      `
    );

    // Converter BigInt para Number, se existirem
    const totalDoacoes = Number(totais?.totalDoacoes || 0);
    const doadoresUnicos = Number(totais?.doadoresUnicos || 0);

    // campanhas ativas
    const campanhasAtivas = await prisma.campanha.count({
      where: {
        idOng: ongId,
        OR: [{ dataFim: null }, { dataFim: { gte: new Date() } }],
      },
    });

    res.json({
      totalDoacoes: totalDoacoes, // Já convertido
      doadoresUnicos: doadoresUnicos, // Já convertido
      campanhasAtivas,
    });
  } catch (err) {
    console.error("Erro detalhado no resumo:", err);
    res.status(500).json({ error: "Erro no resumo", details: err.message });
  }
});

// GET /api/dashboard/doacoes-por-mes?ongId=1
router.get("/doacoes-por-mes", async (req, res) => {
  const ongId = parseInt(req.query.ongId);
  const anoAtual = new Date().getFullYear();

  try {
    const rows = await prisma.$queryRaw`
      SELECT
        DATE_FORMAT(d.dataDoacao, '%b') AS mes,
        CAST(SUM(d.valor) AS DECIMAL(10,2)) AS valor
      FROM Doacao d
      JOIN Campanha c ON c.id = d.idCampanha
      WHERE c.idOng = ${ongId}
        AND YEAR(d.dataDoacao) = ${anoAtual}
        AND d.status = 'concluido'
      GROUP BY YEAR(d.dataDoacao), MONTH(d.dataDoacao), DATE_FORMAT(d.dataDoacao, '%b')
      ORDER BY MONTH(d.dataDoacao)
    `;
    res.json(rows);
  } catch (err) {
    console.error("Erro detalhado:", err);
    res.status(500).json({
      error: "Erro ao buscar doações por mês",
      details: err.message,
    });
  }
});
// Últimas N doações (sem filtro ainda)
router.get("/minhas-doacoes", async (req, res) => {
  try {
    const doacoes = await prisma.doacao.findMany();
    res.json(doacoes);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao buscar doações", details: err.message });
  }
});

module.exports = router;
