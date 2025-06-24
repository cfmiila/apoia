import React, { useEffect, useState } from 'react';

function DashboardCard({ title, content }) {
  return (
    <div className="bg-white h-40 p-4 rounded-xl shadow flex flex-col">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="flex-grow flex items-center justify-center">
        {typeof content === 'string' ? (
          <p className="text-gray-500 text-2xl">{content}</p>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState({
    totalOngs: 'Carregando...',
    totalUsuarios: 'Carregando...',
    graficoDoacoes: <div className="h-24 flex items-center justify-center">Carregando gráfico...</div>,
  });

  useEffect(() => {
    fetch('http://localhost:3100/api/dashboard/counts')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.counts) {
          setData({
            totalOngs: json.counts.ongs,
            totalUsuarios: json.counts.usuarios,
            graficoDoacoes: <div className="h-24 flex items-center justify-center">Gráfico aqui</div>,
          });
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        setData({
          totalOngs: 'Erro ao carregar',
          totalUsuarios: 'Erro ao carregar',
          graficoDoacoes: <div className="text-red-500">Erro no gráfico</div>,
        });
      });
  }, []);

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <span className="text-gray-500">Esta semana</span>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Total de ONGs cadastradas" 
          content={data.totalOngs} 
        />
        <DashboardCard 
          title="Total de usuários registrados" 
          content={data.totalUsuarios} 
        />
        <DashboardCard 
          title="Gráfico de doações" 
          content={data.graficoDoacoes} 
        />
      </div>
    </div>
  );
}
