"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Heart } from "lucide-react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DashboardOngPage() {
  const [ongId, setOngId] = useState(null);
  const [loadingOngId, setLoadingOngId] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.id && user.tipo === "ONG") {
          setOngId(user.id);
        } else {
          console.warn("Usuário logado não é uma ONG ou ID inválido.");
          // Opcional: Redirecionar ou mostrar mensagem se não for uma ONG logada
        }
      } catch (e) {
        console.error("Erro ao parsear dados do usuário do localStorage:", e);
      }
    } else {
      console.warn("Nenhum usuário logado detectado no localStorage.");
    }
    setLoadingOngId(false);
  }, []);

  /* ---------- chamadas ----------------- */
  const { data: resumo } = useSWR(
    ongId ? `/api/dashboard/resumo?ongId=${ongId}` : null,
    fetcher
  );

  // Certificamos que doacoesPorMes é um array para evitar erros
  const { data: doacoesPorMes = [] } = useSWR( // Default para array vazio
    ongId ? `/api/dashboard/doacoes-por-mes?ongId=${ongId}` : null,
    fetcher
  );

  // Certificamos que campanhas é um array
  const { data: campanhas = [] } = useSWR( // Default para array vazio
    ongId ? `/api/campanhas?ongId=${ongId}` : null,
    fetcher
  );

  // Certificamos que ultimasDoacoes é um array
  const { data: ultimasDoacoes = [] } = useSWR( // Default para array vazio
    ongId ? `/api/doacoes?campanhaId=&usuarioId=&limit=5&ongId=${ongId}` : null,
    fetcher
  );

  // Certificamos que eventos é um array
  const { data: eventos = [] } = useSWR( // Default para array vazio
    ongId ? `/api/eventos?ongId=${ongId}` : null,
    fetcher
  );

  /* ---------- loaders simples ---------- */
  if (loadingOngId || !ongId || !resumo) { // Simplificado: só precisa do resumo e ongId inicial
    return <p className="p-6">Carregando dados da ONG…</p>;
  }

  // O doacoesPorMesArray não é mais necessário se usarmos o default [] no useSWR
  // const doacoesPorMesArray = Array.isArray(doacoesPorMes) ? doacoesPorMes : [];

  return (
    <div className="p-6 space-y-8">
      {/* Resumo (permanece sem mensagem de vazio, pois sempre terá os totais mesmo que 0) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResumoCard
          title="Total Arrecadado"
          value={
            isNaN(Number(resumo.totalDoacoes))
              ? "R$ 0,00"
              : `R$ ${Number(resumo.totalDoacoes).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`
          }
        />
        <ResumoCard title="Doadores Únicos" value={resumo.doadoresUnicos} />
        <ResumoCard title="Campanhas Ativas" value={resumo.campanhasAtivas} />
      </div>

      {/* Gráfico - Doações por Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Doações por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          {doacoesPorMes.length > 0 ? ( // Verifica se há dados antes de renderizar o gráfico
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={doacoesPorMes.map((d) => ({
                  ...d,
                  valor: Number(d.valor),
                }))}
              >
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(v) => `R$ ${v.toLocaleString()}`} />
                <Bar dataKey="valor" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center p-8 text-gray-500">
              Não há dados de doações por mês disponíveis para esta ONG.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Últimas Doações */}
      <UltimasDoacoesTable doacoes={ultimasDoacoes} />

      {/* Progresso de Campanhas */}
      <CampanhasProgress campanhas={campanhas} />

      {/* Eventos */}
      <EventosList eventos={eventos} />
    </div>
  );
}

/* ----------- componentes auxiliares --------------- */
function ResumoCard({ title, value }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{value}</CardContent>
    </Card>
  );
}

function UltimasDoacoesTable({ doacoes }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Doações</CardTitle>
      </CardHeader>
      <CardContent>
        {doacoes.length > 0 ? ( // Verifica se há doações
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4">Doador</th> {/* Mais claro que "Nome" */}
                <th className="py-2 px-4">Valor</th>
                <th className="py-2 px-4">Data</th>
              </tr>
            </thead>
            <tbody>
              {doacoes.map((d) => (
                <tr key={d.id} className="border-b last:border-b-0"> {/* Adicionado last:border-b-0 para melhor visual */}
                  <td className="py-2 px-4">{d.usuario?.nome || 'Anônimo'}</td> {/* Handle null usuario */}
                  <td className="py-2 px-4">
                    R${" "}
                    {Number(d.valor).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-4">{new Date(d.dataDoacao).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center p-8 text-gray-500">
            Nenhuma doação recente encontrada para esta ONG.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Criado um novo componente para "Progresso de Campanhas" para encapsular a lógica
function CampanhasProgress({ campanhas }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso das Campanhas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {campanhas.length > 0 ? ( // Verifica se há campanhas
          campanhas.map((c) => {
            const progresso = Math.min(100, (c.valorArrecadado / c.meta) * 100);
            return (
              <div key={c.id}>
                <p className="font-medium">{c.nome}</p>
                <Progress value={progresso} className="h-2" /> {/* Adicionado h-2 para altura da barra */}
                <p className="text-xs text-gray-600 mt-1"> {/* Adicionado mt-1 */}
                  R$ {Number(c.valorArrecadado).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} / R$ {Number(c.meta).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ({progresso.toFixed(1)}% da meta)
                </p>
              </div>
            );
          })
        ) : (
          <div className="text-center p-8 text-gray-500">
            Nenhuma campanha ativa encontrada para esta ONG.
          </div>
        )}
      </CardContent>
    </Card>
  );
}


function EventosList({ eventos }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Eventos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {eventos.length > 0 ? ( // Verifica se há eventos
          eventos.map((ev) => (
            <div
              key={ev.id}
              className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm" // Adicionado bg e shadow
            >
              <div>
                <p className="font-semibold">{ev.nome}</p>
                <p className="text-xs text-gray-600 mt-1"> {/* Ajustado a cor e margin */}
                  📅 {new Date(ev.data).toLocaleDateString("pt-BR")} | 📍{" "}
                  {ev.local}
                </p>
                {ev.endereco && <p className="text-xs text-gray-500 mt-0.5">{ev.endereco}</p>} {/* Renderiza endereço apenas se existir */}
              </div>
              <div className="flex items-center gap-2 text-gray-600"> {/* Ajustado a cor do ícone */}
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">{ev.interessados?.length || 0}</span> {/* Handle null interessados */}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-gray-500">
            Nenhum evento futuro encontrado para esta ONG.
          </div>
        )}
      </CardContent>
    </Card>
  );
}