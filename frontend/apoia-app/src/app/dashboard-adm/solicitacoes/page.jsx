"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function Solicitacoes() {
  const [ongs, setOngs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processandoId, setProcessandoId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null); // { id, tipo: 'aceitar' | 'rejeitar' }

  useEffect(() => {
    const fetchOngs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:3100/api/validacao/ongs-pendentes");
        setOngs(res.data);
      } catch (err) {
        console.error("Erro ao buscar ONGs:", err);
        setError("Erro ao buscar ONGs.");
      } finally {
        setLoading(false);
      }
    };

    fetchOngs();
  }, []);

  const handleConfirm = (id, tipo) => {
    setConfirmAction({ id, tipo });
  };

  const cancelarConfirmacao = () => {
    setConfirmAction(null);
  };

  const processarOng = async (id, tipo) => {
    setProcessandoId(id);
    setError("");
    setSuccessMessage("");
    try {
      let endpoint = "";
      if (tipo === "aceitar") {
        endpoint = `http://localhost:3100/api/validacao/ongs/${id}/validar`;
      } else if (tipo === "rejeitar") {
        endpoint = `http://localhost:3100/api/validacao/ongs/${id}/rejeitar`;
      }

      await axios.put(endpoint);

      setOngs(ongs.filter((o) => o.id !== id));
      setConfirmAction(null);
      setSuccessMessage(`ONG ${tipo === "aceitar" ? "aprovada" : "rejeitada"} com sucesso!`);

      // Sumir a mensagem após 4 segundos
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(`Erro ao ${tipo === "aceitar" ? "validar" : "rejeitar"} ONG:`, err);
      setError(`Erro ao ${tipo === "aceitar" ? "validar" : "rejeitar"} ONG.`);
    } finally {
      setProcessandoId(null);
    }
  };

  if (loading) return <p>Carregando solicitações...</p>;
  if (ongs.length === 0) return <p>Nenhuma solicitação pendente.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Solicitações de ONGs</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {successMessage && <p className="text-green-600 mb-2 font-semibold">{successMessage}</p>}
      <ul className="space-y-4">
        {ongs.map((ong) => (
          <li
            key={ong.id}
            className="border p-4 rounded-md flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{ong.nome}</p>
              <p>{ong.email}</p>
            </div>

            {confirmAction && confirmAction.id === ong.id ? (
              <div className="flex space-x-2">
                <span className="self-center">
                  Deseja {confirmAction.tipo === "aceitar" ? "aceitar" : "rejeitar"} esta ONG?
                </span>
                <Button
                  className={`${
                    confirmAction.tipo === "aceitar"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white`}
                  onClick={() => processarOng(ong.id, confirmAction.tipo)}
                  disabled={processandoId === ong.id}
                >
                  {processandoId === ong.id
                    ? confirmAction.tipo === "aceitar"
                      ? "Aceitando..."
                      : "Rejeitando..."
                    : "Sim"}
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelarConfirmacao}
                  disabled={processandoId === ong.id}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleConfirm(ong.id, "aceitar")}
                  disabled={processandoId === ong.id}
                >
                  Aceitar
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleConfirm(ong.id, "rejeitar")}
                  disabled={processandoId === ong.id}
                >
                  Rejeitar
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
