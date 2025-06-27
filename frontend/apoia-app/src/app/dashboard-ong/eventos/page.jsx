"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { EventoCard } from "../../components/Evento-card";
import { EventoDialogForm } from "../../components/Evento-dialog-form";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function Eventos() {
  const router = useRouter();
  const [eventos, setEventos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [idOng, setIdOng] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedIdOng = localStorage.getItem("idOng");
    if (storedIdOng) {
      setIdOng(Number(storedIdOng));
      fetchEventos(Number(storedIdOng));
    } else {
      console.error("Redirecionando para login - ID da ONG não encontrado");
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const fetchEventos = async (ongId) => {
    try {
      const res = await axios.get(
        `http://localhost:3100/api/eventos?ongId=${ongId}`
      );
      setEventos(res.data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  const handleSave = async (data) => {
    if (!idOng) {
      alert("Sessão expirada. Faça login novamente.");
      router.push("/login");
      return;
    }

    try {
      if (editing) {
        await axios.put(
          `http://localhost:3100/api/eventos/${editing.id}`,
          data
        );
      } else {
        await axios.post("http://localhost:3100/api/eventos", {
          ...data,
          idOng,
        });
      }
      setEditing(null);
      setShowForm(false);
      fetchEventos(idOng);
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      alert("Erro ao salvar evento: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3100/api/eventos/${id}`);
      fetchEventos(idOng);
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      alert("Erro ao excluir evento: " + error.message);
    }
  };

  if (loading)
    return <div className="flex justify-center p-8">Carregando...</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meus Eventos</h1>
        <Button
          className="transition-all duration-200 ease-in-out hover:bg-blue-700 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-white bg-blue-600"
          onClick={() => setShowForm(true)}
        >
          Novo Evento
        </Button>
      </div>

      <EventoDialogForm
        open={showForm}
        onOpenChange={(val) => {
          setShowForm(val);
          if (!val) setEditing(null);
        }}
        initialData={editing}
        onSave={handleSave}
        idOng={idOng}
      />

      {eventos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Alert className="max-w-md">
            <Info className="h-4 w-4" />
            <AlertTitle>Nenhum evento cadastrado</AlertTitle>
            <AlertDescription>
              Você ainda não possui eventos cadastrados. Clique em "Novo Evento"
              para começar.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventos.map((evento) => (
            <EventoCard
              key={evento.id}
              evento={evento}
              onEdit={(ev) => {
                setEditing(ev);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
