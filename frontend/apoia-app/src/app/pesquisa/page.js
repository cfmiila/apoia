"use client";

import React, { useState, useEffect } from "react";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [ongs, setOngs] = useState([]);
  const [openOngs, setOpenOngs] = useState({}); // objeto para controlar quais ONGs estão abertas

  useEffect(() => {
    fetch("http://localhost:3100/api/ongs")
      .then((res) => res.json())
      .then((data) => setOngs(data))
      .catch((err) => console.error("Erro ao carregar ONGs:", err));
  }, []);

  const filteredOngs = ongs.filter((ong) =>
    ong.nome.toLowerCase().includes(search.toLowerCase())
  );

  // alterna se ONG está aberta ou fechada
  const toggleOng = (id) => {
    setOpenOngs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <nav className="flex space-x-4">
            <a href="#" className="hover:underline">
              Como funciona
            </a>
            <a href="#" className="hover:underline">
              Causas
            </a>
          </nav>
          <div className="flex space-x-4 items-center">
            <a href="#" className="hover:underline">
              Sobre
            </a>
            <a href="#" className="hover:underline">
              Depoimentos
            </a>
            <a href="#" className="hover:underline">
              Login
            </a>
            <button className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200">
              Inscreva-se
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold mb-6">Pesquise por ONGs</h1>
        <div className="flex space-x-4 w-full max-w-lg">
          <input
            type="text"
            placeholder="Digite o nome da ONG"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow border border-blue-500 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            onClick={() => setSearch("")}
          >
            Buscar
          </button>
        </div>

        <div className="mt-6 w-full max-w-lg">
          {search ? (
            filteredOngs.length > 0 ? (
              filteredOngs.map((ong) => (
                <div
                  key={ong.id}
                  className="bg-white shadow rounded p-4 my-2 hover:bg-gray-100"
                >
                  <button
                    onClick={() => toggleOng(ong.id)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="font-semibold">{ong.nome}</span>
                    <span className="ml-2 text-blue-500">
                      {openOngs[ong.id] ? "▼" : "▶"}
                    </span>
                  </button>

                  {openOngs[ong.id] && (
                    <div className="mt-2 text-gray-700">
                      <p>
                        <strong>Descrição:</strong> {ong.descricao}
                      </p>
                      <p>
                        <strong>Telefone:</strong> {ong.telefone}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600 mt-4">Nenhuma ONG encontrada.</p>
            )
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
