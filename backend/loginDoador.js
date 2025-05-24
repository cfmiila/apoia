const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "";

router.post("/login/doador", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true,
        tipo: true,
      },
    });

    if (!usuario) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    if (usuario.tipo !== "DOADOR") {
      return res
        .status(403)
        .json({ error: "Acesso permitido apenas para doadores" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        tipo: usuario.tipo,
        nome: usuario.nome,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    });
  } catch (error) {
    console.error("Erro no login do doador:", error);
    res.status(500).json({ error: "Erro no login", details: error.message });
  }
});

module.exports = router;
