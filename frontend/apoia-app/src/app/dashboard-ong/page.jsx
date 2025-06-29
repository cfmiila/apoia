"use client";

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
const ONG_ID = 1; // 🔁 Substitua pela ONG logada

export default function DashboardOngPage() {
  /* ---------- chamadas ----------------- */
  const { data: resumo } = useSWR(
    `/api/dashboard/resumo?ongId=${ONG_ID}`,
    fetcher
  );

  const { data: doacoesPorMes } = useSWR(
    `/api/dashboard/doacoes-por-mes?ongId=${ONG_ID}`,
    fetcher
  );

  const { data: campanhas } = useSWR(`/api/campanhas?ongId=${ONG_ID}`, fetcher);

  const { data: ultimasDoacoes } = useSWR(
    `/api/doacoes?campanhaId=&usuarioId=&limit=5&ongId=${ONG_ID}`,
    fetcher
  );

  const { data: eventos } = useSWR(`/api/eventos?ongId=${ONG_ID}`, fetcher);

  /* ---------- loaders simples ---------- */
  if (!resumo || !doacoesPorMes || !campanhas || !ultimasDoacoes || !eventos) {
    return <p className="p-6">Carregando…</p>;
  }
  const doacoesPorMesArray = Array.isArray(doacoesPorMes) ? doacoesPorMes : [];
  /* ---------- UI original (sem mock) --- */
  return (
    <div className="p-6 space-y-8">
      {/* Resumo */}
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

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Doações por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={doacoesPorMesArray.map((d) => ({
                ...d,
                valor: Number(d.valor), // ← conversão
              }))}
            >
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(v) => `R$ ${v.toLocaleString()}`} />
              <Bar dataKey="valor" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Últimas Doações */}
      <UltimasDoacoesTable doacoes={ultimasDoacoes} />

      {/* Progresso de Campanhas */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso das Campanhas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {campanhas.map((c) => {
            const progresso = Math.min(100, (c.valorArrecadado / c.meta) * 100);
            return (
              <div key={c.id}>
                <p className="font-medium">{c.nome}</p>
                <Progress value={progresso} />
                <p className="text-xs">{progresso.toFixed(1)}% da meta</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

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
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {doacoes.map((d) => (
              <tr key={d.id} className="border-b">
                <td>{d.usuario.nome}</td>
                <td>
                  R${" "}
                  {Number(d.valor).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td>{new Date(d.dataDoacao).toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
        {eventos.map((ev) => (
          <div
            key={ev.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{ev.nome}</p>
              <p className="text-xs text-gray-500">
                📅 {new Date(ev.data).toLocaleDateString("pt-BR")} | 📍{" "}
                {ev.local}
              </p>
              <p className="text-xs text-gray-500">{ev.endereco}</p>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm">{ev.interessados.length}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
