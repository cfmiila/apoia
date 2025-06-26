// src/app/doador/page.jsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { OngCard } from "../../components/Ong-card";
import { CampanhaCard } from "../../components/Campanha-card";
import { Button } from "@/components/ui/button";
import { DoacaoDialog } from "../../components/Doacao-dialog";

export default function DoadorPage() {
  const [ongs, setOngs] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [selectedOng, setSelectedOng] = useState(null);
  const [showDoacaoDialog, setShowDoacaoDialog] = useState(false);
  const [selectedCampanha, setSelectedCampanha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOngs();
    fetchCampanhas();
    setLoading(false);
  }, []);

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

  const handleDoarClick = (campanha) => {
    setSelectedCampanha(campanha);
    setShowDoacaoDialog(true);
  };

  if (loading)
    return <div className="flex justify-center p-8">Carregando...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex-1 p-6">

        <div className="space-y-8">
          {/* Seção de ONGs */}
          <section>
            <h2 className="text-xl font-bold mb-4">ONGs Disponíveis</h2>
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
            {selectedOng ? (
              <p className="mb-4">
                Mostrando campanhas da ONG selecionada.
                <Button
                  variant="link"
                  className="ml-2"
                  onClick={() => setSelectedOng(null)}
                >
                  Mostrar todas
                </Button>
              </p>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campanhas
                .filter((camp) => !selectedOng || camp.idOng === selectedOng)
                .map((campanha) => {
                  const ong = ongs.find((o) => o.id === campanha.idOng);
                  return (
                    <CampanhaCard
                      key={campanha.id}
                      campanha={campanha}
                      ong={ong}
                      onDoarClick={handleDoarClick}
                      isDoador={true}
                    />
                  );
                })}
            </div>
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
