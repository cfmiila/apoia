const express = require('express');
const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  const { valor } = req.body;

  if (!valor || valor <= 0) {
    return res.status(400).json({ error: 'Valor deve ser maior que zero' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: valor * 100,
      currency: 'brl',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Erro ao criar PaymentIntent:', error);
    res.status(500).json({ error: 'Erro ao criar pagamento', details: error.message });
  }
});

module.exports = router;