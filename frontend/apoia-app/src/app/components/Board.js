import React from "react";

const tasks = [
  {
    column: "A fazer",
    items: [
      {
        title: "Aprovar nova cadastro de ONG",
        description: "Verificar dados e validar para a nova organização poder permitir acessos e gestão.",
        tags: ["Campanhas"],
      },
      {
        title: "Revisar campanha pendente",
        description: "Analisar descrição, impacto e dados de campanhas antes de aprovar.",
        tags: ["Campanhas"],
      },
    ],
  },
  {
    column: "Em progresso",
    items: [
      {
        title: "Revisando campanha 'Doe Amor'",
        description: "Análise dos dados da campanha pendente e revisão de texto antes do acordo com as ONGs.",
        tags: ["Campanhas"],
      },
      {
        title: "Investigando denúncia",
        description: "Reunindo informações e enviando questionários para a organização envolvida na campanha.",
        tags: ["Segurança"],
      },
      {
        title: "Escrevendo resposta de contato",
        description: "Preparar uma resposta detalhada para uma organização interessada em entrar no projeto.",
        tags: ["Atendimento"],
      },
    ],
  },
  {
    column: "Feito",
    items: [
      {
        title: "Conserto de Bug no CSS – Login",
        description: "Inabilitar deslocamento do espaçamento para melhorar usabilidade.",
        tags: ["Tecnologia"],
      },
    ],
  },
];

export default function Board() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Quadro</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tasks.map((taskColumn, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">{taskColumn.column}</h2>
            <div className="space-y-4">
              {taskColumn.items.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="text-xs bg-blue-100 text-blue-600 py-1 px-2 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
