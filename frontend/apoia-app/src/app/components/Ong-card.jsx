// src/components/Ong-card.jsx
import { Button } from "@/components/ui/button";

export function OngCard({ ong, onClick, isSelected }) {
  return (
    <div 
      className={`border rounded-lg p-4 transition-all cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img 
            className="h-12 w-12 rounded-full" 
            src={ong.logo || "/default-ong.png"} 
            alt={ong.nome} 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {ong.nome}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {ong.causa}
          </p>
        </div>
      </div>
    </div>
  );
}