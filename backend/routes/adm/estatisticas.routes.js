const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    console.log("Iniciando consulta de estatísticas...");

    const totalDoacoes = await prisma.doacao.count();
    const totalOngs = await prisma.ong.count();
    const totalUsuarios = await prisma.usuario.count();

    let valorArrecadado = 0;
    try {
      const valorArrecadadoAgg = await prisma.doacao.aggregate({
        _sum: { valor: true },
      });
      valorArrecadado = valorArrecadadoAgg._sum.valor || 0;
    } catch (e) {
      console.error("Erro agregando valorArrecadado:", e);
    }

    let campanhasAtivas = 0;
    try {
      campanhasAtivas = await prisma.campanha.count({
        where: { status: 'ativa' },
      });
    } catch (e) {
      console.error("Erro contando campanhasAtivas:", e);
    }

    let tendencia = [];
    try {
      tendencia = await prisma.$queryRaw`
        SELECT DATE_FORMAT(dataDoacao, '%Y-%m') AS mes, SUM(valor) AS total
        FROM doacao
        GROUP BY mes
        ORDER BY mes
      `;
    } catch (e) {
      console.error("Erro consultando tendencia:", e);
    }

    let campanhasTop = [];
    try {
      campanhasTop = await prisma.campanha.findMany({
        orderBy: { arrecadado: 'desc' },
        take: 10,
        select: { nome: true, arrecadado: true },
      });
    } catch (e) {
      console.error("Erro buscando campanhasTop:", e);
    }

    let doacoesPorOng = [];
    try {
      doacoesPorOng = await prisma.$queryRaw`
        SELECT o.nome AS ong, SUM(d.valor) AS total
        FROM doacao d
        JOIN campanha c ON d.idCampanha = c.id
        JOIN ong o ON c.idOng = o.id
        GROUP BY o.nome
        ORDER BY total DESC
        LIMIT 10
      `;
    } catch (e) {
      console.error("Erro consultando doacoesPorOng:", e);
    }

    let crescimentoOngs = [];
    try {
      crescimentoOngs = await prisma.$queryRaw`
        SELECT DATE_FORMAT(dataCadastro, '%Y-%m') AS mes, COUNT(*) AS total
        FROM ong
        GROUP BY mes
        ORDER BY mes
      `;
    } catch (e) {
      console.error("Erro consultando crescimentoOngs:", e);
    }

    let crescimentoUsuarios = [];
    try {
      crescimentoUsuarios = await prisma.$queryRaw`
        SELECT DATE_FORMAT(dataCriacao, '%Y-%m') AS mes, COUNT(*) AS total
        FROM usuario
        GROUP BY mes
        ORDER BY mes
      `;
    } catch (e) {
      console.error("Erro consultando crescimentoUsuarios:", e);
    }

    // Converte BigInt para número
    const safeJson = (obj) =>
      JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? Number(v) : v)));

    res.json(
      safeJson({
        success: true,
        data: {
          totalDoacoes,
          totalOngs,
          totalUsuarios,
          valorArrecadado,
          campanhasAtivas,
          tendencia,
          campanhasTop,
          doacoesPorOng,
          crescimentoOngs,
          crescimentoUsuarios,
        },
      })
    );
  } catch (error) {
    console.error("Erro geral na rota /adm/estatisticas:", error);
    res.status(500).json({ success: false, error: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;
