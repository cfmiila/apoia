// src/components/Sidebar.jsx
import { FaChartPie, FaClipboardList, FaCog, FaSignOutAlt } from "react-icons/fa";

export function Sidebar() {
  return (
    <aside className="w-60 bg-white shadow-md p-6 flex flex-col justify-between min-h-screen">
      <div>
        <h1 className="text-xl font-bold mb-8">APOIA +</h1>
        <nav className="space-y-4">
          <MenuItem icon={<FaChartPie />} text="Painel" />
          <MenuItem icon={<FaClipboardList />} text="Quadro" />
          <MenuItem icon={<FaChartPie />} text="Análises" />
          <MenuItem icon={<FaCog />} text="Configurações" />
        </nav>
      </div>
      <button className="flex items-center text-red-500 gap-2 hover:underline">
        <FaSignOutAlt />
        Log out
      </button>
    </aside>
  );
}

function MenuItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer">
      {icon}
      <span>{text}</span>
    </div>
  );
}
