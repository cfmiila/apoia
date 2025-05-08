// src/components/Dashboard.js
import React from 'react';

// Componente DashboardCard (agora interno ao Dashboard.js)
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

// Componente principal Dashboard
export default function Dashboard() {
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
          content="120" 
        />
        <DashboardCard 
          title="Total de usuários registrados" 
          content="350" 
        />
        <DashboardCard 
          title="Gráfico de doações" 
          content={<div className="h-24 flex items-center justify-center">Gráfico aqui</div>} 
        />
      </div>
    </div>
  );
}