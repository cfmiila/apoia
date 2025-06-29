const express = require("express");
const { PrismaClient } = require("@prisma/client");
const puppeteer = require("puppeteer"); // Importa o puppeteer
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid'); // Para gerar UUIDs se necessário

const prisma = new PrismaClient();
const router = express.Router();

// Função auxiliar para formatar moeda
const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Rota para gerar o certificado em PDF
router.post("/gerar/:idDoacao", async (req, res) => {
  const { idDoacao } = req.params;

  try {
    const doacao = await prisma.doacao.findUnique({
      where: { id: parseInt(idDoacao) },
      include: {
        usuario: true,
        campanha: {
          include: {
            ong: true,
          },
        },
        certificado: true,
      },
    });

    if (!doacao) {
      return res.status(404).json({ error: "Doação não encontrada." });
    }
    if (doacao.status !== "concluido") {
      return res.status(400).json({ error: "Certificado só pode ser gerado para doações concluídas." });
    }

    let certificadoExistente = doacao.certificado;
    let urlCertificadoPdf = certificadoExistente?.urlCertificadoPdf;
    let codigoVerificacao = certificadoExistente?.codigoVerificacao;

    // Se o certificado já existe e tem uma URL, retorna-o para evitar regeração desnecessária
    if (certificadoExistente && urlCertificadoPdf) {
      console.log("Certificado já gerado, retornando URL existente.");
      return res.status(200).json({
        message: "Certificado já gerado.",
        url: urlCertificadoPdf,
        codigoVerificacao: codigoVerificacao,
      });
    }

    // Se não existe, gera um novo código de verificação
    if (!codigoVerificacao) {
      codigoVerificacao = uuidv4();
    }

    // --- Lógica de Geração do Certificado PDF com Puppeteer ---
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necessário para ambientes de produção (Docker, VPS)
    });
    const page = await browser.newPage();

    // Monta o HTML do certificado
    const certificateHtml = `
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Certificado de Impacto</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background-color: #f0f2f5;
              }
              .certificate-container {
                  width: 21cm; /* A4 width */
                  height: 29.7cm; /* A4 height */
                  padding: 3cm 2cm;
                  box-sizing: border-box;
                  background: white;
                  border: 10px solid #28a745; /* Cor principal da plataforma */
                  border-image: linear-gradient(to right, #28a745, #218838) 1;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
                  position: relative;
                  overflow: hidden;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between; /* Para empurrar o rodapé para baixo */
              }
              .header {
                  text-align: center;
                  margin-bottom: 2rem;
              }
              .title {
                  font-size: 2.5rem;
                  font-weight: bold;
                  color: #2c3e50;
                  margin-bottom: 0.5rem;
              }
              .subtitle {
                  font-size: 1.2rem;
                  color: #7f8c8d;
              }
              .content {
                  text-align: center;
                  flex-grow: 1; /* Permite que o conteúdo ocupe o espaço disponível */
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
              }
              .recipient {
                  font-size: 3.5rem;
                  font-weight: bold;
                  color: #2980b9;
                  margin-bottom: 1.5rem;
                  text-transform: uppercase;
                  line-height: 1.2;
              }
              .declaration {
                  font-size: 1.4rem;
                  color: #34495e;
                  line-height: 1.6;
              }
              .highlight {
                  font-weight: bold;
                  color: #27ae60;
              }
              .campaign-name {
                  font-weight: bold;
                  color: #e67e22;
              }
              .ong-info {
                  font-size: 1rem;
                  color: #5d6d7e;
                  margin-top: 1.5rem;
              }
              .footer {
                  text-align: center;
                  margin-top: 2rem;
                  padding-top: 1rem;
                  border-top: 1px solid #eee;
              }
              .verification-code {
                  font-size: 0.9rem;
                  color: #7f8c8d;
                  margin-top: 0.5rem;
              }
              .verification-link {
                  font-size: 0.9rem;
                  color: #3498db;
                  text-decoration: none;
              }
              .date-signature {
                  font-size: 1rem;
                  color: #5d6d7e;
                  margin-top: 1rem;
              }
              .decorative-elements {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  pointer-events: none;
                  opacity: 0.1; /* Ajuste a opacidade para um efeito sutil */
              }
              .decorative-elements::before,
              .decorative-elements::after {
                  content: '';
                  position: absolute;
                  width: 150px;
                  height: 150px;
                  background: radial-gradient(circle, #28a745 0%, transparent 70%);
                  border-radius: 50%;
                  filter: blur(50px);
                  z-index: -1;
              }
              .decorative-elements::before {
                  top: -50px;
                  left: -50px;
              }
              .decorative-elements::after {
                  bottom: -50px;
                  right: -50px;
              }
              .logo {
                  max-width: 150px;
                  height: auto;
                  margin-bottom: 1rem;
                  background-color: transparent; /* Garante que o fundo da imagem seja transparente se PNG */
              }
              @page {
                  size: A4;
                  margin: 0;
              }
          </style>
      </head>
      <body>
          <div class="certificate-container">
              <div class="decorative-elements"></div>
              
              <div class="header">
                  ${doacao.campanha.ong.imageUrl ? `<img src="${doacao.campanha.ong.imageUrl}" alt="${doacao.campanha.ong.nome} Logo" class="logo mx-auto">` : `<div class="title text-green-700">${doacao.campanha.ong.nome}</div>`}
                  <div class="title">Certificado de Impacto</div>
                  <div class="subtitle">Agradecemos sua generosidade e compromisso com o bem.</div>
              </div>

              <div class="content">
                  <p class="declaration">Atestamos com profunda gratidão que</p>
                  <p class="recipient">${doacao.usuario.nome}</p>
                  <p class="declaration">
                      contribuiu com uma doação de 
                      <span class="highlight">${formatCurrency(doacao.valor)}</span> 
                      em ${new Date(doacao.dataDoacao).toLocaleDateString("pt-BR")} para a campanha 
                      <span class="campaign-name">"${doacao.campanha.nome}"</span>.
                  </p>
                  <p class="declaration mt-4">
                      Sua generosidade faz a diferença! Com esta doação, você apoia 
                      as importantes iniciativas de 
                      <span class="highlight">${doacao.campanha.ong.nome}</span>,
                      contribuindo diretamente para ${doacao.descricaoImpacto || doacao.campanha.descricao || "o avanço de projetos sociais e ambientais cruciais para a comunidade."}
                  </p>
              </div>

              <div class="footer">
                  <p class="date-signature">
                      Emitido em: ${new Date().toLocaleDateString("pt-BR")}
                  </p>
                  <p class="verification-code">
                      Código de Verificação: <span class="font-bold">${codigoVerificacao}</span>
                  </p>
                  <a href="http://localhost:3000/verificar-certificado/${codigoVerificacao}" target="_blank" class="verification-link">
                      Verificar autenticidade online
                  </a>
              </div>
          </div>
      </body>
      </html>
    `;

    await page.setContent(certificateHtml, {
      waitUntil: "networkidle0", // Espera a rede ficar ociosa
    });

    // Caminho para salvar o PDF
    const filename = `certificado_impacto_${doacao.id}.pdf`;
    const outputPath = path.join(__dirname, "../public/certificados", filename);

    // Garante que a pasta existe
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true, // Inclui cores e imagens de fundo
    });

    await browser.close();

    const publicUrl = `/public/certificados/${filename}`; // URL pública para acesso ao PDF

    // Salva ou atualiza o certificado no banco de dados
    const certificado = await prisma.certificadoImpacto.upsert({
      where: { idDoacao: doacao.id },
      update: {
        urlCertificadoPdf: publicUrl,
        descricaoImpacto: doacao.descricaoImpacto || doacao.campanha.descricao || doacao.campanha.ong.descricao || "Esta doação contribui diretamente para as iniciativas sociais e ambientais desenvolvidas por nossa organização.",
        codigoVerificacao: codigoVerificacao,
        dataEmissao: new Date(),
      },
      create: {
        idDoacao: doacao.id,
        urlCertificadoPdf: publicUrl,
        descricaoImpacto: doacao.descricaoImpacto || doacao.campanha.descricao || doacao.campanha.ong.descricao || "Esta doação contribui diretamente para as iniciativas sociais e ambientais desenvolvidas por nossa organização.",
        codigoVerificacao: codigoVerificacao,
      },
    });

    res.status(200).json({
      message: "Certificado gerado com sucesso!",
      url: publicUrl,
      codigoVerificacao: codigoVerificacao,
    });
  } catch (err) {
    console.error("Erro ao gerar certificado:", err);
    res.status(500).json({
      error: "Erro ao gerar certificado",
      details: err.message,
    });
  }
});

// Rota para buscar um certificado por código de verificação
router.get("/verificar/:codigo", async (req, res) => {
  const { codigo } = req.params;
  try {
    const certificado = await prisma.certificadoImpacto.findUnique({
      where: { codigoVerificacao: codigo },
      include: {
        doacao: {
          include: {
            usuario: true,
            campanha: {
              include: {
                ong: true,
              },
            },
          },
        },
      },
    });

    if (!certificado) {
      return res.status(404).json({ error: "Certificado não encontrado ou inválido." });
    }

    res.status(200).json(certificado);
  } catch (error) {
    console.error("Erro ao verificar certificado:", error);
    res.status(500).json({ error: "Erro interno ao verificar certificado." });
  }
});

module.exports = router;