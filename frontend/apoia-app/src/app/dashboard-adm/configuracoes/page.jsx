"use client";
import { useState } from "react";

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer mb-4">
      <input
        type="checkbox"
        className="w-5 h-5"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="select-none">{label}</span>
    </label>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="flex flex-col mb-6">
      <span className="mb-2 font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded p-2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ConfiguracoesAdm() {
  // Estados das configs
  const [tema, setTema] = useState("sistema");
  const [idioma, setIdioma] = useState("pt");
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesPush, setNotificacoesPush] = useState(false);
  const [autenticacao2FA, setAutenticacao2FA] = useState(false);
  const [mostrarDashboardAoEntrar, setMostrarDashboardAoEntrar] = useState(true);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Configurações Administrativas</h1>

      {/* Tema e idioma */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Aparência e idioma</h2>
        <Select
          label="Tema"
          value={tema}
          onChange={setTema}
          options={[
            { value: "sistema", label: "Sistema (Padrão do dispositivo)" },
            { value: "claro", label: "Claro" },
            { value: "escuro", label: "Escuro" },
          ]}
        />
        <Select
          label="Idioma padrão"
          value={idioma}
          onChange={setIdioma}
          options={[
            { value: "pt", label: "Português" },
            { value: "en", label: "Inglês" },
            { value: "es", label: "Espanhol" },
          ]}
        />
      </section>

      {/* Notificações */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Notificações</h2>
        <Toggle
          label="Receber notificações por email"
          checked={notificacoesEmail}
          onChange={setNotificacoesEmail}
        />
        <Toggle
          label="Receber notificações push no navegador"
          checked={notificacoesPush}
          onChange={setNotificacoesPush}
        />
      </section>

      {/* Segurança */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Segurança</h2>
        <Toggle
          label="Ativar autenticação de dois fatores (2FA)"
          checked={autenticacao2FA}
          onChange={setAutenticacao2FA}
        />
      </section>

      {/* Experiência */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Experiência do usuário</h2>
        <Toggle
          label="Mostrar painel de estatísticas ao entrar"
          checked={mostrarDashboardAoEntrar}
          onChange={setMostrarDashboardAoEntrar}
        />
      </section>

      {/* Botão salvar ou aplicar */}
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded transition"
          onClick={() => alert("Configurações salvas! (aqui você implementaria a lógica real)")}
        >
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
