"use client";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const resumo = {
  total: 1250,
  valor: "R$87.500,00",
};

const categorias = [
  { name: "Educação", value: 400 },
  { name: "Saúde", value: 300 },
  { name: "Meio Ambiente", value: 300 },
  { name: "Animais", value: 200 },
  { name: "Crianças e Idosos", value: 500 },
];

const tendencia = [
  { mes: "Janeiro", doacoes: 100 },
  { mes: "Fevereiro", doacoes: 200 },
  { mes: "Março", doacoes: 350 },
  { mes: "Abril", doacoes: 500 },
  { mes: "Maio", doacoes: 700 },
  { mes: "Junho", doacoes: 900 },
];

const mapa = [
  { regiao: "Sudeste", total: 300 },
  { regiao: "Nordeste", total: 250 },
  { regiao: "Sul", total: 200 },
  { regiao: "Norte", total: 150 },
  { regiao: "Centro-Oeste", total: 100 },
];

const campanhas = [
  "Doe Amor – R$ 15.000,00",
  "Saúde para Todos – R$ 12.000,00",
  "Eduque já – R$ 10.000,00",
  "Ajude um Animal – R$ 9.500,00",
  "Alimente Esperança – R$ 7.000,00",
  "Contra o Frio – R$ 6.000,00",
  "Transplante Vida – R$ 5.500,00",
  "Somos do Futuro – R$ 5.000,00",
  "Projeto Abrigo – R$ 5.000,00",
  "Corrente do Bem – R$ 4.000,00",
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function EstatisticasAdm() {
  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-2xl font-bold">Estatísticas</h1>
        <p className="text-gray-500">
          Painel de visualização das métricas da plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow col-span-1">
          <h2 className="text-lg font-semibold mb-2">Resumo geral</h2>
          <p>Total de Doações: {resumo.total}</p>
          <p>Valor Arrecadado: {resumo.valor}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow col-span-1">
          <h2 className="text-lg font-semibold mb-2">Tendência de doações:</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={tendencia}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="doacoes"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow col-span-1">
          <h2 className="text-lg font-semibold mb-2">Categorias mais doadas</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categorias}
                dataKey="value"
                nameKey="name"
                outerRadius={70}
                label
              >
                {categorias.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow col-span-1 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-2">
            Campanhas de maior sucesso:
          </h2>
          <ol className="list-decimal pl-5 space-y-1">
            {campanhas.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>

        <div className="bg-white p-4 rounded-xl shadow col-span-1">
          <h2 className="text-lg font-semibold mb-2">Mapa de doações</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mapa}>
              <XAxis dataKey="regiao" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
