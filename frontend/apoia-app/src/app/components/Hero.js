import Image from "next/image";
import imagem1 from "../../../public/Apoia.png";

export default function Hero() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Vídeo de fundo cobrindo tudo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/video1.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>

      {/* Sobreposição escura para contraste */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      {/* Navbar - Clicável */}
      <nav className="relative w-full flex items-center justify-between px-8 py-4 z-10">
        <div>
          <Image src="/Apoia.png" alt="Imagem logo" width={150} height={150} />
        </div>
        <div className="flex items-center space-x-6 text-white">
          <a href="#" className="hover:text-blue-300 transition">
            Como funciona
          </a>
          <a href="#" className="hover:text-blue-300 transition">
            Causas
          </a>
          <a href="#" className="hover:text-blue-300 transition">
            Sobre
          </a>
          <a href="#" className="hover:text-blue-300 transition">
            Depoimentos
          </a>
          <a
            href="#"
            className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-blue-600 transition"
          >
            Login
          </a>
          <a
            href="#"
            className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-blue-600 transition"
          >
            Inscreva-se
          </a>
        </div>
      </nav>

      {/* Hero Section - Agora mais para cima */}
      <section className="relative z-10 flex flex-col items-center justify-center  text-center text-white px-6 pt-40">
        <div className="max-w-6xl">
          <h3 className="text-white font-bold uppercase">
            ONGS E DOADORES EM TODO MUNDO
          </h3>
          <h1 className="text-6xl font-extrabold leading-tight mt-2">
            <span className="text-blue-300">Conecte-se a ONGs</span> e Faça a
            Diferença!
          </h1>
          <p className="text-lg text-gray-200 mt-4">
            Apoie causas que transformam vidas! Cadastre-se como doador ou ONG e
            ajude de forma rápida, segura e transparente.
          </p>
          <a
            href="#"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold text-lg rounded-md shadow-lg hover:bg-blue-700 transition"
          >
            Encontre uma Causa para Apoiar
          </a>
        </div>
      </section>
    </div>
  );
}
