require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const dashboardRoutes = require("./routes/adm/dashboardRoutes"); //WES

const SECRET_KEY = process.env.SECRET_KEY || "";
const prisma = new PrismaClient();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // URL exata do frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
const port = 3100;

// rotas
const loginDoadorRouter = require("./loginDoador");
const loginOngRouter = require("./loginOng");
app.use(loginDoadorRouter);
app.use(loginOngRouter);

const cadastroONGRouter = require("./cadastroOng");
app.use(cadastroONGRouter);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!"); // aqui fiz só pela maldição, mas depois mudaremos
});

function validarSenhaForte(senha) {
  const regexSenha =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regexSenha.test(senha);
}

//usuario
app.post("/usuario/create", async (req, res) => {
  const { cpf, nome, email, senha, tipo } = req.body;

  if (!validarSenhaForte(senha)) {
    return res.status(400).json({
      error:
        "Senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais",
    });
  }
  // validação do CPF
  if (!cpf || cpf.length !== 11 || !/^\d+$/.test(cpf)) {
    return res.status(400).json({ error: "CPF inválido" });
  }

  if (!nome || nome.length < 3) {
    return res
      .status(400)
      .json({ error: "Nome deve ter pelo menos 3 caracteres" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  try {
    const cpfExistente = await prisma.usuario.findUnique({ where: { cpf } });
    if (cpfExistente) {
      return res.status(400).json({ error: "CPF já cadastrado" });
    }

    const emailExistente = await prisma.usuario.findUnique({
      where: { email },
    });
    if (emailExistente) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Criptografar a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        cpf,
        nome,
        email,
        senha: await bcrypt.hash(senha, 10),
        tipo,
      },
    });
    res.status(201).json(usuario);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res
      .status(500)
      .json({ error: "Erro ao criar usuário", details: error.message });
  }
});
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    let entidade = await prisma.usuario.findUnique({ where: { email } });
    let tipoEntidade = "parceiro";

    if (!entidade) {
      entidade = await prisma.ong.findUnique({ where: { email } });
      tipoEntidade = "ONG";
    }

    if (!entidade) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    const senhaValida = await bcrypt.compare(senha, entidade.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: entidade.id, tipo: tipoEntidade },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
      user: { id: entidade.id, nome: entidade.nome, tipo: tipoEntidade },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res
      .status(500)
      .json({ error: "Erro ao fazer login", details: error.message });
  }
});

//read

app.get("/usuario/list", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res
      .status(500)
      .json({ error: "Erro ao listar usuários", details: error.message });
  }
});

//buscar o Id de algum usuário

app.get("/usuario/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
    });
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar usuário", details: error.message });
  }
});

//editar usuario (update)

app.put("/usuario/update/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, tipo } = req.body;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
    });
    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { nome, email, senha, tipo },
    });

    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar usuário", details: error.message });
  }
});
//delete usuário
app.delete("/usuario/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
    });
    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await prisma.usuario.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res
      .status(500)
      .json({ error: "Erro ao deletar usuário", details: error.message });
  }
});

//ong
const validateOngData = ({ nome, email, cnpj }) => {
  // validação do CNPJ
  if (!cnpj || cnpj.length !== 14 || !/^\d+$/.test(cnpj)) {
    return { isValid: false, error: "CNPJ inválido" };
  }
  if (!nome || nome.length < 3) {
    return { isValid: false, error: "Nome deve ter pelo menos 3 caracteres" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { isValid: false, error: "Email inválido" };
  }

  return { isValid: true };
};

app.post("/ong/create", async (req, res) => {
  const { nome, email, senha, cnpj, telefone, descricao } = req.body;

  if (!validarSenhaForte(senha)) {
    return res.status(400).json({
      error:
        "Senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais",
    });
  }
  const validation = validateOngData(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    // aqui vai verificar se o CNPJ ou email já existem
    const [cnpjExistente, emailExistente] = await Promise.all([
      prisma.ong.findUnique({ where: { cnpj } }),
      prisma.ong.findUnique({ where: { email } }),
    ]);

    if (cnpjExistente) {
      return res.status(400).json({ error: "CNPJ já cadastrado" });
    }

    if (emailExistente) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const ong = await prisma.ong.create({
      data: {
        nome,
        email,
        senha: await bcrypt.hash(senha, 10),
        cnpj,
        telefone,
        descricao,
      },
    });

    // Retorna a mensagem de sucesso e a ONG criada
    res.status(200).json({ message: "ONG cadastrada com sucesso", ong });
  } catch (error) {
    console.error("Erro ao criar ONG:", error);
    res
      .status(500)
      .json({ error: "Erro ao criar ONG", details: error.message });
  }
});
//editar (ong)

app.put("/ong/update/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, cnpj, telefone, descricao } = req.body;

  try {
    const ongExistente = await prisma.ong.findUnique({
      where: { id: parseInt(id) },
    });
    if (!ongExistente) {
      return res.status(404).json({ error: "ONG não encontrada" });
    }

    const ongAtualizada = await prisma.ong.update({
      where: { id: parseInt(id) },
      data: { nome, email, senha, cnpj, telefone, descricao },
    });

    res.status(200).json(ongAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar ONG:", error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar ONG", details: error.message });
  }
});
//deletar ONG
app.delete("/ong/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const ongExistente = await prisma.ong.findUnique({
      where: { id: parseInt(id) },
    });
    if (!ongExistente) {
      return res.status(404).json({ error: "ONG não encontrada" });
    }

    await prisma.ong.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "ONG deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar ONG:", error);
    res
      .status(500)
      .json({ error: "Erro ao deletar ONG", details: error.message });
  }
});

//campanha
app.post("/campanha/create", async (req, res) => {
  const { nome, descricao, meta, idOng } = req.body;

  if (!nome || nome.length < 3) {
    return res
      .status(400)
      .json({ error: "Nome deve ter pelo menos 3 caracteres" });
  }

  // validação da meta
  if (!meta || meta <= 0) {
    return res.status(400).json({ error: "Meta deve ser maior que zero" });
  }

  try {
    const ongExistente = await prisma.ong.findUnique({ where: { id: idOng } });
    if (!ongExistente) {
      return res.status(400).json({ error: "ONG não encontrada" });
    }

    const campanha = await prisma.campanha.create({
      data: { nome, descricao, meta, idOng },
    });
    res.status(201).json(campanha);
  } catch (error) {
    console.error("Erro ao criar campanha:", error);
    res
      .status(500)
      .json({ error: "Erro ao criar campanha", details: error.message });
  }
});

//endpoint para criar uma doação

app.post("/doacao/create", async (req, res) => {
  const { valor, idUsuario, idCampanha } = req.body;

  // validação do valor
  if (!valor || valor <= 0) {
    return res.status(400).json({ error: "Valor deve ser maior que zero" });
  }

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: idUsuario },
    });
    if (!usuarioExistente) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const campanhaExistente = await prisma.campanha.findUnique({
      where: { id: idCampanha },
    });
    if (!campanhaExistente) {
      return res.status(400).json({ error: "Campanha não encontrada" });
    }

    const doacao = await prisma.doacao.create({
      data: { valor, idUsuario, idCampanha },
    });
    res.status(201).json(doacao);
  } catch (error) {
    console.error("Erro ao criar doação:", error);
    res
      .status(500)
      .json({ error: "Erro ao criar doação", details: error.message });
  }
});

//falta eu colocar o da transação

//aqui é do painel da ong

app.use("/api", dashboardRoutes);
const campanhaRoutes = require("./routes/campanha.routes");
app.use("/api/campanhas", campanhaRoutes);
const ongsRouter = require("./routes/ongs.routes");
app.use("/api/ongs", ongsRouter);
const doacoesRouter = require("./routes/doacoes.routes");
app.use("/api/doacoes", doacoesRouter);
const eventosRouter = require("./routes/eventos.routes");
app.use("/api/eventos", eventosRouter);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

module.exports = app;
