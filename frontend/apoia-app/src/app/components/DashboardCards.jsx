import React, { useEffect, useState } from 'react';

export function DashboardCards() {
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
            crescimentoOngsUsuarios: 'Não implementado', // ajustar se o backend for atualizado depois
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
    { title: "Total de ONGs cadastradas", value: data.totalOngs },
    { title: "Total de usuários registrados", value: data.totalUsuarios },
    { title: "Total de campanhas ativas", value: data.totalCampanhasAtivas },
    { title: "Total de doações recebidas", value: data.totalDoacoesRecebidas },
    { title: "Crescimento de ONGs/usuários ao longo do tempo", value: data.crescimentoOngsUsuarios },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cards.map(({ title, value }, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-4 h-40 flex flex-col justify-between">
          <h3 className="text-md font-medium">{title}:</h3>
          <p className="text-2xl text-gray-600">{value}</p>
        </div>
      ))}
    </div>
  );
}
