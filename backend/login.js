// backend/routes/auth.js (ou onde você organizar suas rotas)

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "";

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Tenta encontrar como usuário (doador)
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (usuario) {
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(400).json({ error: "Email ou senha incorretos" });
      }

      const token = jwt.sign(
        { id: usuario.id, tipo: "DOADOR", nome: usuario.nome },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        token,
        user: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: "DOADOR",
        },
      });
    }

    // Se não for usuário, tenta como ONG
    const ong = await prisma.ong.findUnique({ where: { email } });

    if (!ong) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    const senhaValida = await bcrypt.compare(senha, ong.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: ong.id, tipo: "ONG", nome: ong.nome },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token,
      user: {
        id: ong.id,
        nome: ong.nome,
        email: ong.email,
        tipo: "ONG",
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no login", details: error.message });
  }
});



module.exports = router;
