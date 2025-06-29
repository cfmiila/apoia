"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function DoacaoDialog({ open, onOpenChange, campanha, onSuccess }) {
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!userData) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
          sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
          router.push("/login");
          return;
        }
        setUserData(storedUser);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        router.push("/login");
        return;
      }

      // 1. Criar sessão de checkout no backend
      const { data } = await axios.post(
        "http://localhost:3100/api/pagamentos/create-payment-intent",
        {
          valor: parseFloat(valor),
          idUsuario: userData.id,
          idCampanha: campanha.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2. Redirecionar para o checkout do Stripe
      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId, // Agora usando sessionId ao invés de clientSecret
      });

      if (stripeError) {
        throw stripeError;
      }

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        "Erro ao processar doação. Tente novamente."
      );
      console.error("Erro na doação:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Fazer Doação</DialogTitle>
          <DialogDescription>
            Contribua para a campanha "{campanha?.titulo}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                min="1"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Digite o valor da doação"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-md">
                <p className="text-red-600">
                  {error.includes("login") ? (
                    <>
                      {error}. Você será redirecionado para a página de login.
                      <span className="block mt-2 text-sm text-red-500">
                        Se o redirecionamento não funcionar, <a href="/login" className="underline">clique aqui</a>.
                      </span>
                    </>
                  ) : (
                    error
                  )}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setError("");
                  onOpenChange(false);
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !valor}
              >
                {loading ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Doação"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}