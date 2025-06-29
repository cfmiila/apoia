"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { OngCard } from "../../components/Ong-card";
import { EventoCard } from "../../components/Evento-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Importe o componente Input

export default function DoadorPage() {
  const [ongs, setOngs] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [selectedOng, setSelectedOng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null);

  // Estados para os filtros de Eventos
  const [searchTermEventos, setSearchTermEventos] = useState("");
  const [addressFilterEventos, setAddressFilterEventos] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.id) {
          setUsuarioId(user.id);
        } else {
          console.error(
            "ID do usuário não encontrado ou inválido no localStorage."
          );
        }
      } catch (e) {
        console.error("Erro ao parsear dados do usuário do localStorage:", e);
      }
    } else {
      console.warn(
        "Nenhum usuário logado detectado. Algumas funcionalidades podem não funcionar."
      );
    }

    const fetchData = async () => {
      await fetchOngs();
      // Removido: await fetchCampanhas();
      await fetchEventos();
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchOngs = async () => {
    try {
      const res = await axios.get("http://localhost:3100/api/ongs");
      setOngs(res.data);
    } catch (error) {
      console.error("Erro ao buscar ONGs:", error);
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

  const handleInteresse = async (idEvento) => {
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
          idUsuario: usuarioId,
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

  // Lógica de filtragem otimizada com useMemo para Eventos
  const filteredEventos = useMemo(() => {
    let currentEventos = eventos;

    // 1. Filtra por ONG selecionada (se houver)
    if (selectedOng) {
      currentEventos = currentEventos.filter((ev) => ev.idOng === selectedOng);
    }

    // 2. Filtra por termo de pesquisa (nome ou descrição do evento)
    if (searchTermEventos) {
      const lowerCaseSearchTerm = searchTermEventos.toLowerCase();
      currentEventos = currentEventos.filter(
        (ev) =>
          ev.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
          (ev.descricao &&
            ev.descricao.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // 3. Filtra por endereço da ONG associada
    if (addressFilterEventos) {
      const lowerCaseAddressFilter = addressFilterEventos.toLowerCase();
      currentEventos = currentEventos.filter((evento) => {
        const ong = ongs.find((o) => o.id === evento.idOng);
        if (!ong) return false;

        const fullAddress = `${ong.logradouro || ""} ${ong.numero || ""} ${
          ong.complemento || ""
        } ${ong.bairro || ""} ${ong.cidade || ""} ${ong.estado || ""} ${
          ong.cep || ""
        }`.toLowerCase();

        return fullAddress.includes(lowerCaseAddressFilter);
      });
    }

    return currentEventos;
  }, [eventos, selectedOng, searchTermEventos, addressFilterEventos, ongs]); // Dependências do useMemo para eventos

  if (loading)
    return <div className="flex justify-center p-8">Carregando...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex-1 p-6 space-y-12">
        {/* Seção ONGs (Inalterada) */}
        <section>
          <h2 className="text-xl font-bold mb-4">ONGs disponíveis</h2>
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

        {/* Seção Eventos (Mantida com filtros e mensagem) */}
        <section>
          <h2 className="text-xl font-bold mb-4">Próximos Eventos</h2>

          {/* Inputs de Filtro e Pesquisa para Eventos */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              type="text"
              placeholder="Pesquisar eventos por nome ou descrição..."
              value={searchTermEventos}
              onChange={(e) => setSearchTermEventos(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="text"
              placeholder="Filtrar eventos por endereço da ONG..."
              value={addressFilterEventos}
              onChange={(e) => setAddressFilterEventos(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {selectedOng && (
            <p className="mb-4 text-gray-700">
              Mostrando eventos da ONG selecionada.
              <Button
                variant="link"
                className="ml-2 px-0 py-0 h-auto text-blue-600 hover:underline"
                onClick={() => setSelectedOng(null)}
              >
                Mostrar todas
              </Button>
            </p>
          )}

          {/* Exibe eventos filtrados ou mensagem de "não encontrado" */}
          {filteredEventos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEventos.map((evento) => {
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
          ) : (
            <div className="text-center p-8 text-gray-500 text-lg rounded-lg bg-white shadow-sm">
              Nenhum evento encontrado com os filtros aplicados.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
