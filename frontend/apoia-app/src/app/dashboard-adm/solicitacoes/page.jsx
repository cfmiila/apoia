"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function Solicitacoes() {
  const [ongs, setOngs] = useState([]);

  useEffect(() => {
    const fetchOngs = async () => {
      try {
        const res = await axios.get("http://localhost:3100/api/ongs?validada=false");
        setOngs(res.data);
      } catch (err) {
        console.error("Erro ao buscar ONGs:", err);
      }
    };

    fetchOngs();
  }, []);

  const validarOng = async (id) => {
    try {
      await axios.put(`http://localhost:3100/api/ongs/${id}/validar`);
      setOngs(ongs.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Erro ao validar ONG:", err);
    }
  };

  if (ongs.length === 0) {
    return <p>Nenhuma solicitação pendente.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Solicitações de ONGs</h2>
      <ul className="space-y-4">
        {ongs.map((ong) => (
          <li key={ong.id} className="border p-4 rounded-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{ong.nome}</p>
              <p>{ong.email}</p>
            </div>
            <Button onClick={() => validarOng(ong.id)}>Validar</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
