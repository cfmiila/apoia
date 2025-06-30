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
        // Adicionando a relação 'endereco' para que os campos de endereço sejam incluídos
        endereco: {
          select: {
            cep: true,
            numero: true,
            complemento: true,
            bairro: true,
            cidade: true,
            estado: true,
          },
        },
      },
      orderBy: {
        dataCadastro: "desc", // Ordena por data de cadastro (mais recentes primeiro)
      },
    });

    res.json(ongs);
  } catch (err) {
    console.error("Erro detalhado ao buscar ONGs:", err);
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
        // Adicionando a relação 'endereco' para que os campos de endereço sejam incluídos
        endereco: {
          select: {
            cep: true,
            numero: true,
            complemento: true,
            bairro: true,
            cidade: true,
            estado: true,
          },
        },
      },
    });

    if (!ong) {
      return res.status(404).json({ error: "ONG não encontrada" });
    }

    res.json(ong);
  } catch (err) {
    console.error("Erro detalhado ao buscar ONG:", err);
    res.status(500).json({
      error: "Erro ao buscar ONG",
      details:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Erro interno do servidor",
    });
  }
});

// ... (existing code for GET routes)

// PUT /api/ongs/:id - Update an ONG
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, descricao, status, cnpj, endereco } = req.body;

  try {
    // Check if an address already exists for this ONG
    const existingAddress = await prisma.endereco.findUnique({
      where: { ongId: parseInt(id) }, // This specific findUnique works if ongId is @unique
      select: { id: true }, // We just need its existence
    });

    const updateData = {
      nome,
      email,
      telefone,
      descricao,
      status,
      cnpj,
    };

    if (endereco) {
      if (existingAddress) {
        // If address exists, update it
        updateData.endereco = {
          update: {
            cep: endereco.cep,
            numero: endereco.numero,
            complemento: endereco.complemento,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
          },
        };
      } else {
        // If no address exists, create it and link it
        updateData.endereco = {
          create: {
            cep: endereco.cep,
            numero: endereco.numero,
            complemento: endereco.complemento,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
          },
        };
      }
    }

    const updatedOng = await prisma.ong.update({
      where: { id: parseInt(id) },
      data: updateData, // Use the dynamically built updateData
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        descricao: true,
        status: true,
        dataCadastro: true,
        cnpj: true,
        endereco: {
          select: {
            cep: true,
            numero: true,
            complemento: true,
            bairro: true,
            cidade: true,
            estado: true,
          },
        },
      },
    });

    res.json(updatedOng);
  } catch (err) {
    // ... (rest of your error handling)
    console.error("Erro detalhado ao atualizar ONG:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "ONG não encontrada" });
    }
    res.status(500).json({
      error: "Erro ao atualizar ONG",
      details:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Erro interno do servidor",
    });
  }
});

module.exports = router;
