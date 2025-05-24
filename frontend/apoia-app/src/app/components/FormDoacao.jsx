"use client";

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardElement
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RG9pX3moN6CE1AoVc7qIb6N0wfBmyHnhtawnbXbz8eZivwNbHlwJI5nqVJI4SdyIWY9c2nsI3ZiFFWi8AKnlOJM00X78jQTLU'); // troque pela sua

const CheckoutForm = () => {
  const [valor, setValor] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4242/doacao/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor: parseFloat(valor) }),
    });

    const data = await response.json();

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert(`Erro no pagamento: ${result.error.message}`);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        alert('Pagamento realizado com sucesso!');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 shadow-md rounded">
      <label className="block mb-4">
        <span className="text-gray-700">Valor da Doação (R$):</span>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        />
      </label>
      <div className="mb-4">
        <CardElement />
      </div>
      <button
        type="submit"
        disabled={!stripe}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Doar
      </button>
    </form>
  );
};

const FormDoacao = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default FormDoacao;
