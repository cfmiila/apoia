"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CampanhaCard } from "../components/Campanha-card";
import { CampanhaDialogForm } from "../components/Campanha-dialog-form";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function Campanhas() {
  const router = useRouter();
  const [campanhas, setCampanhas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [idOng, setIdOng] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedIdOng = localStorage.getItem("idOng");
    if (storedIdOng) {
      setIdOng(Number(storedIdOng));
      fetchCampanhas(Number(storedIdOng));
    } else {
      console.error("Redirecionando para login - ID da ONG não encontrado");
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const fetchCampanhas = async (ongId) => {
    try {
      const res = await axios.get(
        `http://localhost:3100/api/campanhas?ongId=${ongId}`
      );
      setCampanhas(res.data);
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
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
          `http://localhost:3100/api/campanhas/${editing.id}`,
          data
        );
      } else {
        await axios.post("http://localhost:3100/api/campanhas", {
          ...data,
          idOng,
        });
      }
      setEditing(null);
      setShowForm(false);
      fetchCampanhas(idOng);
    } catch (error) {
      console.error("Erro ao salvar campanha:", error);
      alert("Erro ao salvar campanha: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta campanha?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3100/api/campanhas/${id}`);
      fetchCampanhas(idOng);
    } catch (error) {
      console.error("Erro ao excluir campanha:", error);
      alert("Erro ao excluir campanha: " + error.message);
    }
  };

  if (loading)
    return <div className="flex justify-center p-8">Carregando...</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Minhas Campanhas</h1>
        <Button
          className="transition-all duration-200 ease-in-out hover:bg-blue-700 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-white bg-blue-600"
          onClick={() => setShowForm(true)}
        >
          Nova Campanha
        </Button>
      </div>

      <CampanhaDialogForm
        open={showForm}
        onOpenChange={(val) => {
          setShowForm(val);
          if (!val) setEditing(null);
        }}
        initialData={editing}
        onSave={handleSave}
        idOng={idOng}
      />

      {campanhas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Alert className="max-w-md">
            <Info className="h-4 w-4" />
            <AlertTitle>Nenhuma campanha cadastrada</AlertTitle>
            <AlertDescription>
              Você ainda não possui campanhas cadastradas. Clique em "Nova
              Campanha" para começar.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campanhas.map((campanha) => (
            <CampanhaCard
              key={campanha.id}
              campanha={campanha}
              onEdit={(camp) => {
                setEditing(camp);
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
