import { FaHeart, FaUser } from "react-icons/fa";
import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-6 lg:px-16">
        <h2 className="text-3xl font-bold text-blue-950 text-center mb-12">
          Um Pouco Sobre Nós...
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Textos à esquerda */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-500 text-white p-3 rounded-lg shadow-md">
                📌
              </div>
              <div>
                <h3 className="font-semibold text-xl text-blue-950">
                  Apoiamos outras empresas
                </h3>
                <p className="text-gray-600 text-base">
                  Nossa missão é conectar ONGs e doadores para que mais pessoas
                  sejam impactadas.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-red-500 text-white p-3 rounded-lg shadow-md">
                🌎
              </div>
              <div>
                <h3 className="font-semibold text-xl text-blue-950">
                  Queremos mudar o mundo
                </h3>
                <p className="text-gray-600 text-base">
                  Trabalhamos para facilitar doações e tornar a caridade mais
                  acessível a todos.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white p-3 rounded-lg shadow-md">
                🔗
              </div>
              <div>
                <h3 className="font-semibold text-xl text-blue-950">
                  Conexão entre ONGs e doadores
                </h3>
                <p className="text-gray-600 text-base">
                  Oferecemos uma plataforma segura para doações e engajamento
                  social.
                </p>
              </div>
            </div>
          </div>

          {/* Card da Criança */}
          <div className="relative bg-white shadow-lg rounded-xl p-6 w-full max-w-sm mx-auto transition-transform hover:scale-105">
            {/* Ícone de coração no canto superior direito */}
            <FaHeart className="absolute top-4 right-4 text-red-500 text-xl cursor-pointer" />

            <Image
              src="/kid.jpg"
              alt="Criança sorrindo"
              width={320}
              height={200}
              className="rounded-lg w-full object-cover"
            />

            <div className="mt-4 space-y-3">
              <h3 className="text-xl font-semibold text-blue-950">
                O Propósito
              </h3>
              <p className="text-gray-600 text-base">
                Ajude crianças em todo o mundo com sua contribuição.
              </p>

              <div className="mt-4 flex items-center justify-between text-sm">
                {/* Pessoas que contribuíram */}
                <div className="flex items-center text-gray-700">
                  <FaUser className="text-blue-500 mr-2" />
                  <span>24 pessoas contribuíram</span>
                </div>

                {/* Status de arrecadação */}
                <div className="bg-gray-200 px-3 py-1 rounded-md text-xs text-gray-700 font-medium">
                  💰 40% arrecadado
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
