"use client";

import { useEffect, useState } from "react";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function EstatisticasAdm() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3100/adm/estatisticas")
      .then((res) => res.json())
      .then((response) => {
        console.log("Resposta recebida da API:", response);
        const { success, data } = response;
        if (success && data) {
          setData(data);
        } else {
          console.error("Falha ao carregar estatísticas - Dados inválidos:", response);
          setData(null);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error("Erro ao carregar dados:", e);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando dados...</p>;
  if (!data) return <p>Erro ao carregar dados.</p>;

  const tendencia = (data.tendencia || []).map((item) => ({
    mes: item.mes,
    doacoes: Number(item.total),
  }));

  const categorias = (data.doacoesPorOng || []).map((item) => ({
    name: item.ong,
    value: Number(item.total),
  }));

  const campanhas = (data.campanhasTop || []).map(
    (c) =>
      `${c.nome} – ${Number(c.arrecadado).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`
  );

  const mapa = (data.doacoesPorOng || []).map((item) => ({
    regiao: item.ong,
    total: Number(item.total),
  }));

  const crescimentoOngs = (data.crescimentoOngs || []).map((item) => ({
    mes: item.mes,
    total: Number(item.total),
  }));

  const crescimentoUsuarios = (data.crescimentoUsuarios || []).map((item) => ({
    mes: item.mes,
    total: Number(item.total),
  }));

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-2xl font-bold">Estatísticas</h1>
        <p className="text-gray-500">
          Painel de visualização das métricas da plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-white p-4 rounded-xl shadow aspect-square flex flex-col justify-center items-center">
          <h2 className="text-sm font-medium text-gray-500">Total de Doações</h2>
          <p className="text-2xl font-bold text-indigo-600">{data.totalDoacoes}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow aspect-square flex flex-col justify-center items-center">
          <h2 className="text-sm font-medium text-gray-500">Valor Arrecadado</h2>
          <p className="text-2xl font-bold text-green-600">
            {data.valorArrecadado.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow aspect-square flex flex-col justify-center items-center">
          <h2 className="text-sm font-medium text-gray-500">Campanhas Ativas</h2>
          <p className="text-2xl font-bold text-orange-500">{data.campanhasAtivas}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow aspect-square flex flex-col justify-center items-center">
          <h2 className="text-sm font-medium text-gray-500">Total de ONGs cadastradas</h2>
          <p className="text-2xl font-bold text-indigo-600">{data.totalOngs}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow aspect-square flex flex-col justify-center items-center">
          <h2 className="text-sm font-medium text-gray-500">Total de Usuários cadastrados</h2>
          <p className="text-2xl font-bold text-indigo-600">{data.totalUsuarios}</p>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-6">
        <div className="bg-gray-50 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Crescimento de ONGs</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={crescimentoOngs}
              margin={{ top: 40, right: 40, left: 20, bottom: 30 }}
            >
              <XAxis
                dataKey="mes"
                stroke="#4A5568"
                tick={{ fontSize: 16, fill: "#4A5568" }}
                label={{
                  value: "Mês",
                  position: "insideBottom",
                  offset: -10,
                  fill: "#4A5568",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              />
              <YAxis
                stroke="#4A5568"
                tick={{ fontSize: 16, fill: "#4A5568" }}
                label={{
                  value: "Total",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#4A5568",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              />
              <Tooltip
                wrapperClassName="bg-white text-gray-700 p-4 rounded-lg shadow-md"
                cursor={{ stroke: "#00C49F", strokeWidth: 1 }}
                contentStyle={{ fontSize: "16px", fontWeight: "bold" }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#00C49F"
                strokeWidth={4}
                dot={{ r: 6, fill: "#00C49F" }}
                activeDot={{ r: 10, fill: "#008080" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Crescimento de Usuários</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={crescimentoUsuarios}
              margin={{ top: 40, right: 50, left: 30, bottom: 40 }}
            >
              <XAxis
                dataKey="mes"
                stroke="#4A5568"
                tick={{ fontSize: 16, fill: "#4A5568" }}
                label={{
                  value: "Mês",
                  position: "insideBottom",
                  offset: -15,
                  fill: "#4A5568",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              />
              <YAxis
                stroke="#4A5568"
                tick={{ fontSize: 16, fill: "#4A5568" }}
                label={{
                  value: "Total",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#4A5568",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              />
              <Tooltip
                wrapperClassName="bg-white text-gray-700 p-4 rounded-lg shadow-md"
                cursor={{ stroke: "#FFBB28", strokeWidth: 1 }}
                contentStyle={{ fontSize: "16px", fontWeight: "bold" }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#FFBB28"
                strokeWidth={4}
                dot={{ r: 6, fill: "#FFBB28" }}
                activeDot={{ r: 10, fill: "#FFA500" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Doações por ONG</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categorias}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {categorias.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>


      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Mapa de doações por ONG</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={mapa}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <XAxis dataKey="regiao" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="total" fill="#00C49F" barSize={40} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
