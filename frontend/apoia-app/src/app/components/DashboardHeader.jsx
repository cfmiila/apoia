// src/components/DashboardHeader.jsx
import { FaBell, FaQuestionCircle } from "react-icons/fa";

export function DashboardHeader() {
  return (
    <header className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-semibold">Dashboard</h2>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <FaBell className="text-gray-500" />
        <FaQuestionCircle className="text-gray-500" />
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </header>
  );
}
