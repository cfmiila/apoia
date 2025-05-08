import {
  LayoutDashboard,
  KanbanSquare,
  BarChart3,
  Settings,
} from "lucide-react";

export default function AdminHeader({ abaAtual, aoMudarAba }) {
  const menu = [
    { name: "Painel", aba: "dashboard", icon: LayoutDashboard },
    { name: "Quadro", aba: "board", icon: KanbanSquare },
    { name: "Análises", aba: "analytics", icon: BarChart3 },
    { name: "Configurações", aba: "config", icon: Settings },
  ];

  return (
    <aside className="w-60 min-h-screen bg-white border-r px-4 py-6 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-6">APOIA ✦</h1>
        <nav className="space-y-2">
          {menu.map(({ name, aba, icon: Icon }) => (
            <button
              key={name}
              onClick={() => aoMudarAba(aba)}
              className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                abaAtual === aba
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{name}</span>
            </button>
          ))}
        </nav>
      </div>
      <button className="text-red-500 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50">
        <span className="text-lg">⇦</span>
        Log out
      </button>
    </aside>
  );
}
