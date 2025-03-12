import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = 3100;

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!'); // aqui fiz só pela maldição, mas depois mudaremos
});

//usuario
app.post('/usuario/create', async (req, res) => {
  const { cpf, nome, email, senha, tipo } = req.body;

  // validação do CPF
  if (!cpf || cpf.length !== 11 || !/^\d+$/.test(cpf)) {
    return res.status(400).json({ error: 'CPF inválido' });
  }

  if (!nome || nome.length < 3) {
    return res.status(400).json({ error: 'Nome deve ter pelo menos 3 caracteres' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
  
    const cpfExistente = await prisma.usuario.findUnique({ where: { cpf } });
    if (cpfExistente) {
      return res.status(400).json({ error: 'CPF já cadastrado' });
    }

    // vai verificar se o email já existe
    const emailExistente = await prisma.usuario.findUnique({ where: { email } });
    if (emailExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    
    const usuario = await prisma.usuario.create({
      data: { cpf, nome, email, senha, tipo },
    });

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
  }
});

//ong
const validateOngData = ({ nome, email, cnpj }) => {
  // validação do CNPJ
  if (!cnpj || cnpj.length !== 14 || !/^\d+$/.test(cnpj)) {
    return { isValid: false, error: 'CNPJ inválido' };
  }
  if (!nome || nome.length < 3) {
    return { isValid: false, error: 'Nome deve ter pelo menos 3 caracteres' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { isValid: false, error: 'Email inválido' };
  }

  return { isValid: true };
};


app.post('/ong/create', async (req, res) => {
  const { nome, email, senha, cnpj, telefone, descricao } = req.body;

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
      return res.status(400).json({ error: 'CNPJ já cadastrado' });
    }

    if (emailExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

  
    const ong = await prisma.ong.create({
      data: { nome, email, cnpj, senha, telefone, descricao },
    });

    res.status(200).json(ong);
  } catch (error) {
    console.error('Erro ao criar ONG:', error);
    res.status(500).json({ error: 'Erro ao criar ONG', details: error.message });
  }
});
//campanha
app.post('/campanha/create', async (req, res) => {
  const { nome, descricao, meta, idOng } = req.body;

  if (!nome || nome.length < 3) {
    return res.status(400).json({ error: 'Nome deve ter pelo menos 3 caracteres' });
  }

  // validação da meta
  if (!meta || meta <= 0) {
    return res.status(400).json({ error: 'Meta deve ser maior que zero' });
  }

  try {
    
    const ongExistente = await prisma.ong.findUnique({ where: { id: idOng } });
    if (!ongExistente) {
      return res.status(400).json({ error: 'ONG não encontrada' });
    }

 
    const campanha = await prisma.campanha.create({
      data: { nome, descricao, meta, idOng },
    });

    res.status(200).json(campanha);
  } catch (error) {
    console.error('Erro ao criar campanha:', error);
    res.status(500).json({ error: 'Erro ao criar campanha', details: error.message });
  }
});

//endpoint para criar uma doação

app.post('/doacao/create', async (req, res) => {
  const { valor, idUsuario, idCampanha } = req.body;

  // validação do valor
  if (!valor || valor <= 0) {
    return res.status(400).json({ error: 'Valor deve ser maior que zero' });
  }

  try {
    const usuarioExistente = await prisma.usuario.findUnique({ where: { id: idUsuario } });
    if (!usuarioExistente) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

  
    const campanhaExistente = await prisma.campanha.findUnique({ where: { id: idCampanha } });
    if (!campanhaExistente) {
      return res.status(400).json({ error: 'Campanha não encontrada' });
    }

    const doacao = await prisma.doacao.create({
      data: { valor, idUsuario, idCampanha },
    });

    // Retorna a doação criada
    res.status(200).json(doacao);
  } catch (error) {
    console.error('Erro ao criar doação:', error);
    res.status(500).json({ error: 'Erro ao criar doação', details: error.message });
  }
});

//falta eu colocar o da transação

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});