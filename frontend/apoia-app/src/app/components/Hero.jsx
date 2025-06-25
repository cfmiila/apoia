import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      {/* Vídeo de fundo */}
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

      <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>

      {/* Navbar - Oculta quando showRegistration estiver ativo */}
      {!showRegistration && (
        <nav className="relative w-full flex items-center justify-between px-8 py-3 z-10">
          <div>
            <Image
              src="/Apoia.png"
              alt="Imagem logo"
              width={175}
              height={175}
            />
          </div>
          <div className="flex items-center space-x-6 text-white text-lg">
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
            <button className="px-6 py-2 border border-white rounded-md hover:bg-white hover:text-blue-600 transition cursor-pointer">
              Login
            </button>
            <button
              onClick={() => setShowRegistration(true)}
              className="px-6 py-2 border border-white rounded-md hover:bg-white hover:text-blue-600 transition cursor-pointer"
            >
              Inscreva-se
            </button>
          </div>
        </nav>
      )}

      {/* Hero Section - Oculta quando showRegistration estiver ativo */}
      {!showRegistration && (
        <section className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6 pt-18">
          <div className="max-w-5xl">
            <h3 className="text-white font-bold uppercase text-xl tracking-wider">
              ONGS E DOADORES EM TODO MUNDO
            </h3>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mt-4">
              <span className="text-blue-300">Conecte-se a ONGs</span> <br /> e
              Faça a Diferença!
            </h1>
            <p className="text-lg text-gray-200 mt-6">
              Apoie causas que transformam vidas! Cadastre-se como doador ou ONG
              e ajude de forma rápida, segura e transparente.
            </p>
            <Link
              href="/pesquisa"
              className="mt-8 inline-block px-8 py-4 bg-blue-600 text-white font-semibold text-xl rounded-md shadow-lg hover:bg-blue-700 transition"
            >
              Encontre uma Causa para Apoiar
            </Link>
          </div>
        </section>
      )}

      {/* Tela de Inscrição */}
      {showRegistration && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-12 rounded-lg shadow-xl text-center">
          <h2 className="text-5xl mb-12">Cadastre-se como Doador ou ONG!</h2>
          <div className="flex gap-36">
            <Link href="/cadastro-doador">
              <button className="flex flex-col items-center p-6 w-50 h-50 text-black rounded-lg shadow-lg hover:bg-red-600 transition cursor-pointer hover:text-white">
                <Image
                  src="/doador-icon.svg"
                  alt="Doador"
                  width={120}
                  height={120}
                />
                <span className="mt-4 text-lg">Sou Doador</span>
              </button>
            </Link>
            <Link href="/cadastro-ong">
              <button className="flex flex-col items-center p-6 w-50 h-50 text-black rounded-lg shadow-lg hover:bg-blue-600 transition cursor-pointer hover:text-white">
                <Image
                  src="/ong-icon.svg" alt="ONG" width={120} height={120} />
                <span className="mt-4 text-lg">Somos uma ONG</span>
              </button>
            </Link>
          </div>
          <button
            onClick={() => setShowRegistration(false)}
            className="mt-10 px-6 py-2 border border-gray-600 rounded-md hover:bg-gray-300 transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
