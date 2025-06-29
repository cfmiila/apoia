"use client";

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

function DashboardCards() {
  const [data, setData] = useState({
    totalOngs: 'Carregando...',
    totalUsuarios: 'Carregando...',
    totalCampanhasAtivas: 'Carregando...',
    totalDoacoesRecebidas: 'Carregando...',
    crescimentoOngsUsuarios: 'Carregando...',
  });

  useEffect(() => {
    fetch('http://localhost:3100/api/dashboard/counts')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.counts) {
          setData({
            totalOngs: json.counts.ongs,
            totalUsuarios: json.counts.usuarios,
            totalCampanhasAtivas: json.counts.campanhas,
            totalDoacoesRecebidas: json.counts.doacoes,
            crescimentoOngsUsuarios: 'Não implementado',
          });
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        setData({
          totalOngs: 'Erro',
          totalUsuarios: 'Erro',
          totalCampanhasAtivas: 'Erro',
          totalDoacoesRecebidas: 'Erro',
          crescimentoOngsUsuarios: 'Erro',
        });
      });
  }, []);

  const cards = [
    { title: 'Total de ONGs cadastradas', value: data.totalOngs },
    { title: 'Total de usuários registrados', value: data.totalUsuarios },
    { title: 'Total de campanhas ativas', value: data.totalCampanhasAtivas },
    { title: 'Total de doações recebidas', value: data.totalDoacoesRecebidas },
    {
      title: 'Crescimento de ONGs/usuários ao longo do tempo',
      value: data.crescimentoOngsUsuarios,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {cards.map(({ title, value }, index) => (
        <DashboardCard key={index} title={title} content={value} />
      ))}
    </div>
  );
}

export default function DashboardAdm() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <span className="text-gray-500">Esta semana</span>
      </div>

      <DashboardCards />

      {/* Placeholder para gráfico — você pode trocar pelo gráfico real depois */}
      <div className="bg-white p-6 rounded-xl shadow h-60 flex items-center justify-center text-gray-500">
        Gráfico de doações (a implementar)
      </div>
    </div>
  );
}
