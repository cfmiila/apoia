// src/components/Ong-card.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Phone, Mail } from "lucide-react"; // Importe os ícones necessários

export function OngCard({ ong, onClick, isSelected }) {
  // Constrói o endereço para exibição
  const displayAddress = ong.endereco ?
    `${ong.endereco.cidade || ''}${ong.endereco.cidade && ong.endereco.estado ? ', ' : ''}${ong.endereco.estado || ''}`.trim() : '';

  return (
    <Card
      className={`
        cursor-pointer
        hover:shadow-lg
        transition-all duration-200
        ${isSelected ? "border-2 border-blue-500 bg-blue-50" : "border border-gray-200 bg-white"}
        flex flex-col // Para garantir que o conteúdo preencha o espaço
      `}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-3">
        {/* Lógica para exibir logo ou fallback */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden flex items-center justify-center
                        bg-purple-100 text-purple-700 text-lg font-bold">
          {ong.logo ? ( // Verifica se existe um logo
            <img
              src={ong.logo}
              alt={ong.nome || "Logo da ONG"}
              className="w-full h-full object-cover" // Garante que a imagem preencha o div
            />
          ) : ong.nome ? ( // Se não tiver logo, usa a primeira letra do nome
            ong.nome[0].toUpperCase()
          ) : ( // Se não tiver nem logo nem nome, usa um ícone padrão
            <Building2 className="w-6 h-6" />
          )}
        </div>
        <CardTitle className="text-lg font-semibold text-gray-800 flex-1 truncate">
          {ong.nome || "Nome da ONG Desconhecido"}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1">
        {ong.causa && (
          <p className="text-sm text-gray-600 mb-2">
            **Causa:** {ong.causa}
          </p>
        )}
        {ong.descricao && (
          <CardDescription className="text-sm text-gray-700 mb-2 line-clamp-2">
            {ong.descricao}
          </CardDescription>
        )}
        {displayAddress && (
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
            {displayAddress}
          </p>
        )}
        {ong.telefone && (
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <Phone className="w-3 h-3 mr-1 text-gray-400" />
            {ong.telefone}
          </p>
        )}
        {ong.email && (
          <p className="text-xs text-gray-500 flex items-center mt-1">
            <Mail className="w-3 h-3 mr-1 text-gray-400" />
            {ong.email}
          </p>
        )}
        {isSelected && (
          <p className="text-sm text-blue-600 mt-3 font-medium">
            ONG Selecionada
          </p>
        )}
      </CardContent>
    </Card>
  );
}