const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/eventos (Nenhuma mudança necessária aqui, já que o Prisma retorna todos os campos)
router.get("/", async (req, res) => {
  const { ongId } = req.query;

  try {
    const eventos = await prisma.evento.findMany({
      where: ongId ? { idOng: parseInt(ongId) } : undefined,
      orderBy: { data: "asc" },
      include: {
        interessados: true,
      },
    });

    res.json(eventos);
  } catch (err) {
    res.status(500).json({
      error: "Erro ao buscar eventos",
      details: err.message,
    });
  }
});

// POST /api/eventos
router.post("/", async (req, res) => {
  const { nome, descricao, data, horario, local, endereco, imagemUrl, idOng } =
    req.body; // ✅ Adicionado 'horario'

  try {
    const novoEvento = await prisma.evento.create({
      data: {
        nome,
        descricao,
        data: data ? new Date(data) : null,
        horario, // ✅ Salva o horário
        local,
        endereco,
        imagemUrl,
        idOng: parseInt(idOng),
      },
    });

    res.status(201).json(novoEvento);
  } catch (err) {
    res.status(400).json({
      error: "Erro ao criar evento",
      details: err.message,
    });
  }
});

// PUT /api/eventos/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, data, horario, local, endereco, imagemUrl } =
    req.body; // ✅ Adicionado 'horario'

  try {
    const eventoAtualizado = await prisma.evento.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        descricao,
        data: data ? new Date(data) : null,
        horario, // ✅ Atualiza o horário
        local,
        endereco,
        imagemUrl,
      },
    });

    res.json(eventoAtualizado);
  } catch (err) {
    res.status(400).json({
      error: "Erro ao atualizar evento",
      details: err.message,
    });
  }
});

// DELETE /api/eventos/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.evento.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (err) {
    res.status(400).json({
      error: "Erro ao excluir evento",
      details: err.message,
    });
  }
});

// POST /api/eventos/:id/interesse
router.post("/:id/interesse", async (req, res) => {
  const { id } = req.params;
  const { idUsuario } = req.body;

  if (!idUsuario) {
    return res.status(400).json({ error: "ID do usuário é obrigatório" });
  }

  try {
    // Cria interesse — garante unique pelo model
    const interesse = await prisma.usuarioEvento.create({
      data: {
        idUsuario: parseInt(idUsuario),
        idEvento: parseInt(id),
      },
    });

    res.status(201).json(interesse);
  } catch (err) {
    if (err.code === "P2002") {
      // Erro Prisma unique constraint
      return res.status(409).json({ error: "Usuário já demonstrou interesse" });
    }
    res
      .status(500)
      .json({ error: "Erro ao registrar interesse", details: err.message });
  }
});

module.exports = router;
