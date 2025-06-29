"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { OngCard } from "../../components/Ong-card";
import { CampanhaCard } from "../../components/Campanha-card";
import { EventoCard } from "../../components/Evento-card";
import { Button } from "@/components/ui/button";
import { DoacaoDialog } from "../../components/Doacao-dialog";

export default function DoadorPage() {
  const [ongs, setOngs] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [selectedOng, setSelectedOng] = useState(null);
  const [showDoacaoDialog, setShowDoacaoDialog] = useState(false);
  const [selectedCampanha, setSelectedCampanha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null); // Novo estado para armazenar o ID do usuário

  useEffect(() => {
    // 1. Tenta obter o ID do usuário do localStorage quando o componente montar
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.id) {
          setUsuarioId(user.id);
        } else {
          // Trate o caso onde o usuário está no localStorage mas o ID não é válido
          console.error(
            "ID do usuário não encontrado ou inválido no localStorage."
          );
          // Opcional: Redirecionar para login ou mostrar uma mensagem
        }
      } catch (e) {
        console.error("Erro ao parsear dados do usuário do localStorage:", e);
        // Opcional: Redirecionar para login ou mostrar uma mensagem
      }
    } else {
      console.warn(
        "Nenhum usuário logado detectado. Algumas funcionalidades podem não funcionar."
      );
      // Opcional: Redirecionar para login ou mostrar uma mensagem
    }

    // 2. Continua buscando os dados gerais que não dependem do ID do usuário
    fetchOngs();
    fetchCampanhas();
    fetchEventos();
    setLoading(false);
  }, []); // Este useEffect roda apenas uma vez ao montar

  const fetchOngs = async () => {
    try {
      const res = await axios.get("http://localhost:3100/api/ongs");
      setOngs(res.data);
    } catch (error) {
      console.error("Erro ao buscar ONGs:", error);
    }
  };

  const fetchCampanhas = async () => {
    try {
      const res = await axios.get("http://localhost:3100/api/campanhas");
      setCampanhas(res.data);
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
    }
  };

  const fetchEventos = async () => {
    try {
      const res = await axios.get("http://localhost:3100/api/eventos");
      setEventos(res.data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  const handleDoarClick = (campanha) => {
    setSelectedCampanha(campanha);
    setShowDoacaoDialog(true);
  };

  const handleInteresse = async (idEvento) => {
    // Verifica se o ID do usuário está disponível antes de fazer a requisição
    if (!usuarioId) {
      alert(
        "Erro: ID do usuário não disponível. Por favor, faça login novamente."
      );
      return;
    }

    try {
      await axios.post(
        `http://localhost:3100/api/eventos/${idEvento}/interesse`,
        {
          idUsuario: usuarioId, // ✅ Agora usa o ID real do usuário logado!
        }
      );
      alert("Interesse registrado!");
      fetchEventos(); // Atualiza contagem de interessados
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Você já marcou interesse neste evento.");
      } else {
        console.error(err);
        alert("Erro ao registrar interesse. Tente novamente.");
      }
    }
  };

  if (loading)
    return <div className="flex justify-center p-8">Carregando...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex-1 p-6 space-y-12">
        {/* Seção ONGs */}
        <section>
          <h2 className="text-xl font-bold mb-4">Eventos disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ongs.map((ong) => (
              <OngCard
                key={ong.id}
                ong={ong}
                onClick={() =>
                  setSelectedOng(ong.id === selectedOng ? null : ong.id)
                }
                isSelected={ong.id === selectedOng}
                isDoador={true}
              />
            ))}
          </div>
        </section>

        {/* Seção Eventos */}
        <section>
          <h2 className="text-xl font-bold mb-4">Próximos Eventos</h2>
          {selectedOng && (
            <p className="mb-4">
              Mostrando eventos da ONG selecionada.
              <Button
                variant="link"
                className="ml-2"
                onClick={() => setSelectedOng(null)}
              >
                Mostrar todos
              </Button>
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventos
              .filter((ev) => !selectedOng || ev.idOng === selectedOng)
              .map((evento) => {
                const ong = ongs.find((o) => o.id === evento.idOng);
                return (
                  <EventoCard
                    key={evento.id}
                    evento={evento}
                    ong={ong}
                    isDoador={true}
                    onInteresse={handleInteresse}
                  />
                );
              })}
          </div>
        </section>

        <DoacaoDialog
          open={showDoacaoDialog}
          onOpenChange={setShowDoacaoDialog}
          campanha={selectedCampanha}
          // Provavelmente você também precisará passar o usuarioId para o DoacaoDialog
          // se ele for usado para registrar a doação
          // usuarioId={usuarioId}
          onSuccess={() => {
            setShowDoacaoDialog(false);
            // Poderia também recarregar as campanhas ou doações se o dialog
            // realizar uma doação que impacte os dados exibidos aqui.
          }}
        />
      </div>
    </div>
  );
}
