'use client';

import { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import Dashboard from '../components/Dashboard';
import Board from '../components/Board';
import Analytics from '../components/Analytics';

export default function AdminPage() {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');

  return (
    <div className="flex min-h-screen">
      {/* Menu lateral */}
      <AdminHeader abaAtual={abaAtiva} aoMudarAba={setAbaAtiva} />

      {/* Conteúdo principal */}
      <main className="flex-1 p-6">
        {abaAtiva === 'dashboard' && <Dashboard />}
        {abaAtiva === 'board' && <Board />}
        {abaAtiva === 'analytics' && <Analytics />}
        {abaAtiva === 'config' && <div>Configurações</div>}
      </main>
    </div>
  );
}
