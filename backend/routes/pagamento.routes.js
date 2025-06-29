const express = require("express");
const { PrismaClient } = require("@prisma/client");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();
const router = express.Router();

// Criar Checkout Session
router.post("/create-payment-intent", async (req, res) => {
  console.log("Recebida requisição para criar sessão de checkout:", req.body);

  const { valor, idUsuario, idCampanha } = req.body;

  // Validações
  if (!valor || valor <= 0) {
    console.log("Valor inválido:", valor);
    return res.status(400).json({ error: "Valor deve ser maior que zero" });
  }
  if (!idUsuario || !idCampanha) {
    console.log("IDs ausentes:", { idUsuario, idCampanha });
    return res
      .status(400)
      .json({ error: "IDs de usuário e campanha são obrigatórios" });
  }

  try {
    // 1. Buscar a campanha no banco de dados
    const campanha = await prisma.campanha.findUnique({
      where: { id: idCampanha },
    });

    if (!campanha) {
      return res.status(404).json({ error: "Campanha não encontrada" });
    }

    // 2. Criar a doação no banco de dados
    const novaDoacao = await prisma.doacao.create({
      data: {
        valor,
        idUsuario,
        idCampanha,
        status: "pendente",
      },
    });

    // 3. Criar a Checkout Session no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Doação para ${campanha.nome}`,
            },
            unit_amount: Math.round(valor * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/login`,
      metadata: {
        idDoacao: novaDoacao.id.toString(),
        idUsuario: idUsuario.toString(),
        idCampanha: idCampanha.toString(),
      },
    });

    // 4. Criar registro de transação
    const novaTransacao = await prisma.transacao.create({
      data: {
        stripePaymentIntentId: session.payment_intent,
        status: "requer_confirmacao",
        metodoPagamento: "STRIPE",
        doacao: {
          connect: {
            id: novaDoacao.id,
          },
        },
      },
    });

    res.status(200).json({
      sessionId: session.id, // Retornando sessionId ao invés de clientSecret
    });
  } catch (error) {
    console.error("Erro no processo de doação:", error);
    res
      .status(500)
      .json({ error: "Erro ao processar doação", details: error.message });
  }
});

// Webhook para atualizar status do pagamento
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Lidar com eventos de checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Atualizar transação
      await prisma.transacao.update({
        where: { stripePaymentIntentId: session.payment_intent },
        data: {
          status: "concluido",
          dataPagamento: new Date(),
          metodoPagamento: "cartão", // Ou você pode extrair do session.payment_method_types
        },
      });

      // Atualizar doação
      await prisma.doacao.update({
        where: { id: parseInt(session.metadata.idDoacao) },
        data: { status: "concluido" },
      });

      console.log(`Pagamento ${session.payment_intent} processado com sucesso`);
    } catch (err) {
      console.error("Erro ao atualizar banco de dados:", err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
