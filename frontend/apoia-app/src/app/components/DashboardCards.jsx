// src/components/DashboardCards.jsx
export function DashboardCards() {
  const cards = [
    "Total de ONGs cadastradas",
    "Total de usuários registrados",
    "Gráfico de doações ao longo do tempo",
    "Total de campanhas ativas",
    "Total de doações recebidas",
    "Crescimento de ONGs/usuários ao longo do tempo",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cards.map((title, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-4 h-40">
          <h3 className="text-md font-medium">{title}:</h3>
          {/* Aqui você pode colocar gráfico, número ou dados */}
        </div>
      ))}
    </div>
  );
}
