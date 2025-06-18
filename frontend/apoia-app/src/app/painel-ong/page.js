'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PainelOng() {
  const router = useRouter();

  // Estado para armazenar lista de campanhas vindas do backend
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Função para carregar campanhas do backend via API
  async function carregarCampanhas() {
    setLoading(true);
    setError('');
    try {
      // TODO: Ajustar a URL da API para o endpoint real do backend
      const res = await fetch('/api/campanhas'); 
      if (!res.ok) throw new Error('Erro ao carregar campanhas');
      const data = await res.json();
      setCampanhas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Carrega campanhas quando componente monta
  useEffect(() => {
    carregarCampanhas();
  }, []);

  // Navega para criação de campanha
  function handleCriarCampanha() {
    router.push('/painel-ong/criar-campanha');
  }

  // Navega para edição da campanha com o ID fornecido
  function handleEditarCampanha(campanhaId) {
    router.push(`/painel-ong/editar-campanha/${campanhaId}`);
  }

  // Excluir campanha via API
  async function handleExcluirCampanha(campanhaId) {
    // TODO: Implementar confirmação antes da exclusão (ex: modal)
    if (!confirm(`Tem certeza que deseja excluir a campanha ${campanhaId}?`)) return;

    try {
      // TODO: Ajustar URL da API para exclusão real no backend
      const res = await fetch(`/api/campanhas/${campanhaId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erro ao excluir campanha');

      // Atualiza lista após exclusão
      setCampanhas(prev => prev.filter(c => c.id !== campanhaId));
      alert('Campanha excluída com sucesso!');
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#005bbb', color: '#fff', padding: '20px' }}>
        <h1>Painel da ONG</h1>
      </header>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <nav style={{ width: '220px', backgroundColor: '#003f7f', color: '#fff', padding: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '15px' }}>
              <a href="#" style={linkStyle}>Dashboard</a>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <a href="#" style={linkStyle}>Campanhas</a>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <a href="#" style={linkStyle}>Comentários</a>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <a href="#" style={linkStyle}>Mensagens</a>
            </li>
            <li>
              <a href="#" style={linkStyle}>Configurações</a>
            </li>
          </ul>
        </nav>

        {/* Conteúdo principal */}
        <main style={{ flexGrow: 1, padding: '30px' }}>
          <h2>Gerenciar Campanhas</h2>

          <button onClick={handleCriarCampanha} style={btnStyle}>Criar Campanha</button>

          {loading && <p>Carregando campanhas...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Lista de campanhas */}
          <ul style={{ marginTop: 20, padding: 0, listStyle: 'none' }}>
            {campanhas.map(campanha => (
              <li key={campanha.id} style={campanhaItemStyle}>
                <span>{campanha.nome}</span>
                <div>
                  <button
                    onClick={() => handleEditarCampanha(campanha.id)}
                    style={btnSmallStyle}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluirCampanha(campanha.id)}
                    style={btnSmallDeleteStyle}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
            {(!loading && campanhas.length === 0) && <p>Nenhuma campanha encontrada.</p>}
          </ul>
        </main>
      </div>
    </div>
  );
}

// Estilos simples
const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const btnStyle = {
  backgroundColor: '#005bbb',
  color: '#fff',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginBottom: 20,
};

const campanhaItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px',
  borderBottom: '1px solid #ccc',
};

const btnSmallStyle = {
  backgroundColor: '#005bbb',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  padding: '5px 10px',
  cursor: 'pointer',
  marginRight: 10,
};

const btnSmallDeleteStyle = {
  ...btnSmallStyle,
  backgroundColor: '#bb0000',
};
