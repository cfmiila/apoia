// src/components/Doacao-dialog.jsx
import { useState } from "react";
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

export function DoacaoDialog({ open, onOpenChange, campanha, onSuccess }) {
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const idDoador = localStorage.getItem("userId"); // Supondo que o ID do doador está no localStorage

      if (!idDoador) {
        throw new Error("Usuário não autenticado");
      }

      await axios.post("http://localhost:3100/api/doacoes", {
        valor: parseFloat(valor),
        idCampanha: campanha.id,
        idDoador: parseInt(idDoador),
      });

      onSuccess();
      onOpenChange(false);
      setValor("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Erro ao processar doação. Tente novamente."
      );
      console.error(err);
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-2">
              <Button
                className="transition-all duration-200 ease-in-out hover:bg-gray-100 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-black bg-white"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                className="transition-all duration-200 ease-in-out hover:bg-blue-700 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-white bg-blue-600"
                type="submit"
                disabled={loading}
              >
                {loading ? "Processando..." : "Confirmar Doação"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
