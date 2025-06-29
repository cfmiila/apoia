"use client"; // Marca como Client Component no Next.js

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Função utilitária para formatar moeda
const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Cores para o gráfico de pizza (exemplo)
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

export default function DoadorPainel() {
  const [usuarioId, setUsuarioId] = useState(null); // Começa como null
  const [resumo, setResumo] = useState(null);
  const [minhasDoacoes, setMinhasDoacoes] = useState([]);
  const [doacoesPorCampanha, setDoacoesPorCampanha] = useState([]);
  const [doacoesPorMes, setDoacoesPorMes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tenta obter o ID do usuário do localStorage quando o componente montar
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.id) {
          setUsuarioId(user.id);
        } else {
          setError("ID do usuário não encontrado no localStorage.");
          setLoading(false);
        }
      } catch (e) {
        console.error("Erro ao parsear dados do usuário do localStorage:", e);
        setError("Erro ao carregar informações do usuário.");
        setLoading(false);
      }
    } else {
      setError("Nenhum usuário logado. Por favor, faça login.");
      setLoading(false);
    }
  }, []); // O array vazio garante que este useEffect rode apenas uma vez ao montar

  useEffect(() => {
    const fetchDoadorData = async () => {
      if (!usuarioId) {
        // Não busca dados se o usuarioId ainda não foi definido
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null); // Limpa erros anteriores

      try {
        // Fetch de dados para o resumo
        const resumoRes = await fetch(
          `http://localhost:3100/api/dashboard-doador/resumo/${usuarioId}`
        );
        if (!resumoRes.ok) throw new Error("Falha ao buscar resumo.");
        const resumoData = await resumoRes.json();
        setResumo(resumoData);

        // Fetch de dados para minhas doações
        const doacoesRes = await fetch(
          `http://localhost:3100/api/dashboard-doador/minhas-doacoes/${usuarioId}`
        );
        if (!doacoesRes.ok) throw new Error("Falha ao buscar minhas doações.");
        const doacoesData = await doacoesRes.json();
        setMinhasDoacoes(doacoesData);

        // Fetch de dados para doações por campanha
        const doacoesCampanhaRes = await fetch(
          `http://localhost:3100/api/dashboard-doador/doacoes-por-campanha/${usuarioId}`
        );
        if (!doacoesCampanhaRes.ok)
          throw new Error("Falha ao buscar doações por campanha.");
        const doacoesCampanhaData = await doacoesCampanhaRes.json();
        setDoacoesPorCampanha(doacoesCampanhaData);

        // Fetch de dados para doações por mês
        const doacoesMesRes = await fetch(
          `http://localhost:3100/api/dashboard-doador/doacoes-por-mes/${usuarioId}`
        );
        if (!doacoesMesRes.ok)
          throw new Error("Falha ao buscar doações por mês.");
        const doacoesMesData = await doacoesMesRes.json();
        setDoacoesPorMes(doacoesMesData);
      } catch (err) {
        console.error("Erro ao carregar dados do doador:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoadorData();
  }, [usuarioId]); // Este useEffect será re-executado sempre que `usuarioId` mudar

  if (loading) {
    return (
      <div className="p-8 text-center">Carregando painel do doador...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Erro: {error}</div>;
  }

  // Se usuarioId for null (não encontrado no localStorage ou erro), pode-se redirecionar
  // ou exibir uma mensagem específica. Aqui, já é tratado pelo `error` state.
  if (!usuarioId) {
    return (
      <div className="p-8 text-center text-red-500">
        Não foi possível carregar o painel. ID do usuário não disponível.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Seu Painel de Doador
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Acompanhe suas contribuições e o impacto que você está gerando.
      </p>

      {/* Seção de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Doado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(resumo?.totalDoado || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sua contribuição total.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Campanhas Apoiadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resumo?.campanhasApoiadas || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Número de campanhas.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">ONGs Apoiadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resumo?.ongsApoiadas || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Organizações ajudadas.
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Minhas Doações Recentes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Minhas Doações Recentes</CardTitle>
          <CardDescription>
            Um histórico das suas últimas contribuições.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {minhasDoacoes.length === 0 ? (
            <p className="text-center text-gray-500">
              Você ainda não fez nenhuma doação.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>ONG</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {minhasDoacoes.slice(0, 5).map(
                  (
                    doacao // Exibe as 5 últimas doações
                  ) => (
                    <TableRow key={doacao.id}>
                      <TableCell className="font-medium">
                        {doacao.campanha?.nome}
                      </TableCell>
                      <TableCell>{doacao.campanha?.ong?.nome}</TableCell>
                      <TableCell>{formatCurrency(doacao.valor)}</TableCell>
                      <TableCell>
                        {new Date(doacao.dataDoacao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </TableCell>
                      <TableCell>{doacao.status}</TableCell>
                      <TableCell className="text-right">
                        {doacao.status === "concluido" && (
                          <Button variant="outline" size="sm" asChild>
                            {/* MOCK: Link para a página de certificado. Você precisará criar esta página */}
                            <a
                              href={`/dashboard-doador/certificado/${doacao.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Gerar Certificado
                            </a>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
              {minhasDoacoes.length > 5 && (
                <TableCaption>
                  <Button variant="link">Ver todas as doações</Button>{" "}
                  {/* Implementar link para uma página de histórico completo */}
                </TableCaption>
              )}
            </Table>
          )}
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Doações por Campanha (Gráfico de Pizza) */}
        <Card>
          <CardHeader>
            <CardTitle>Doações por Campanha</CardTitle>
            <CardDescription>
              Sua distribuição de apoio entre as campanhas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {doacoesPorCampanha.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={doacoesPorCampanha}
                    dataKey="valorTotal"
                    nameKey="nomeCampanha" // Esta chave deve corresponder ao nome da propriedade no objeto de dados
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    labelLine={false}
                    // AQUI é onde o nome é acessado para o label
                    label={({ payload, percent }) =>
                      `${payload.nomeCampanha} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {doacoesPorCampanha.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">
                Sem dados para exibir.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Evolução das Doações por Mês (Gráfico de Barras) */}
        <Card>
          <CardHeader>
            <CardTitle>Doações por Mês ({new Date().getFullYear()})</CardTitle>
            <CardDescription>Sua contribuição ao longo do ano.</CardDescription>
          </CardHeader>
          <CardContent>
            {doacoesPorMes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={doacoesPorMes}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="valor" fill="#8884d8" name="Valor Doado" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">
                Sem dados para exibir para o ano atual.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
