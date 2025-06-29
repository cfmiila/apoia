"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { OngCard } from "../../components/Ong-card";
import { CampanhaCard } from "../../components/Campanha-card";
import { Button } from "@/components/ui/button";
import { DoacaoDialog } from "../../components/Doacao-dialog";
import { Input } from "@/components/ui/input"; // Assumindo que você tem um componente Input do shadcn/ui

export default function DoadorPage() {
  const [ongs, setOngs] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [selectedOng, setSelectedOng] = useState(null);
  const [showDoacaoDialog, setShowDoacaoDialog] = useState(false);
  const [selectedCampanha, setSelectedCampanha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Novo estado 


  // Efeito para carregar ONGs e Campanhas ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      await fetchOngs();
      await fetchCampanhas();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Função para buscar ONGs
  const fetchOngs = async () => {
    try {
      const res = await axios.get("http://localhost:3100/api/ongs");
      setOngs(res.data);
    } catch (error) {
      console.error("Erro ao buscar ONGs:", error);
    }
  };

  // Função para buscar Campanhas
  const fetchCampanhas = async () => {
    try {
      const res = await axios.get("http://localhost:3100/api/campanhas");
      setCampanhas(res.data);
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
    }
  };

  // Lida com o clique no botão "Doar" de uma campanha
  const handleDoarClick = (campanha) => {
    setSelectedCampanha(campanha);
    setShowDoacaoDialog(true);
  };

  // Lógica de filtragem otimizada com useMemo para evitar recálculos desnecessários
  const filteredCampanhas = useMemo(() => {
    // Começa com todas as campanhas
    let currentCampanhas = campanhas;

    // 1. Filtra por ONG selecionada (se houver)
    if (selectedOng) {
      currentCampanhas = currentCampanhas.filter(
        (camp) => camp.idOng === selectedOng
      );
    }

    // 2. Filtra por termo de pesquisa (nome ou descrição da campanha)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentCampanhas = currentCampanhas.filter(
        (camp) =>
          camp.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
          (camp.descricao &&
            camp.descricao.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    return currentCampanhas;
  }, [campanhas, selectedOng, searchTerm, ongs]); // Dependências do useMemo

  if (loading)
    return <div className="flex justify-center p-8">Carregando...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex-1 p-6">
        <div className="space-y-8">
          {/* Seção de ONGs */}
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
                />
              ))}
            </div>
          </section>

          {/* Seção de Campanhas */}
          <section>
            <h2 className="text-xl font-bold mb-4">Campanhas em Destaque</h2>

            {/* Inputs de Filtro e Pesquisa */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                type="text"
                placeholder="Pesquisar campanhas por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {selectedOng ? (
              <p className="mb-4 text-gray-700">
                Mostrando campanhas da ONG selecionada.
                <Button
                  variant="link"
                  className="ml-2 px-0 py-0 h-auto text-blue-600 hover:underline"
                  onClick={() => setSelectedOng(null)}
                >
                  Mostrar todas
                </Button>
              </p>
            ) : null}

            {/* Exibe campanhas filtradas ou mensagem de "não encontrado" */}
            {filteredCampanhas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCampanhas.map((campanha) => {
                  const ong = ongs.find((o) => o.id === campanha.idOng);
                  return (
                    <CampanhaCard
                      key={campanha.id}
                      campanha={campanha}
                      ong={ong} // Passa a ONG para o CampanhaCard
                      onDoarClick={handleDoarClick}
                      isDoador={true}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500 text-lg rounded-lg bg-white shadow-sm">
                Nenhuma campanha encontrada com os filtros aplicados.
              </div>
            )}
          </section>
        </div>

        {/* Dialog de Doação */}
        <DoacaoDialog
          open={showDoacaoDialog}
          onOpenChange={setShowDoacaoDialog}
          campanha={selectedCampanha}
          onSuccess={() => {
            setShowDoacaoDialog(false);
            // Aqui você pode adicionar feedback para o usuário
          }}
        />
      </div>
    </div>
  );
}
