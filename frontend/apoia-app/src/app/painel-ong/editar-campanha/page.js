'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditarCampanha() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    meta: '',
    dataFim: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!form.nome.trim()) {
      setError('O nome da campanha é obrigatório.');
      return;
    }

    if (!form.meta || Number(form.meta) <= 0) {
      setError('A meta deve ser um valor positivo.');
      return;
    }

    setSaving(true);
    try {
      
      const res = await fetch('/api/campanhas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess('Campanha salva com sucesso!');
        setForm({ nome: '', descricao: '', meta: '', dataFim: '' });
        setTimeout(() => router.push('/painel-ong'), 1500);
      } else {
        const data = await res.json();
        setError(data.message || 'Erro ao salvar campanha.');
      }
    } catch {
      setError('Erro na comunicação com o servidor.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Editar Campanha</h2>
        <img
          src="/Apoia.png"
          alt="Logo"
          style={styles.logo}
        />
      </div>

      <form onSubmit={handleSubmit} style={styles.form} noValidate>
        <label htmlFor="nome" style={styles.label}>
          Nome da Campanha<span style={{ color: 'red' }}>*</span>:
        </label>
        <input
          id="nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
          style={styles.input}
          disabled={saving}
        />

        <label htmlFor="descricao" style={styles.label}>
          Descrição:
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          style={{ ...styles.input, height: 100, resize: 'vertical' }}
          disabled={saving}
        />

        <label htmlFor="meta" style={styles.label}>
          Meta (R$)<span style={{ color: 'red' }}>*</span>:
        </label>
        <input
          id="meta"
          type="number"
          step="0.01"
          min="0.01"
          name="meta"
          value={form.meta}
          onChange={handleChange}
          required
          style={styles.input}
          disabled={saving}
        />

        <label htmlFor="dataFim" style={styles.label}>
          Data de Término:
        </label>
        <input
          id="dataFim"
          type="date"
          name="dataFim"
          value={form.dataFim}
          onChange={handleChange}
          style={styles.input}
          disabled={saving}
        />

        {error && <p role="alert" style={styles.error}>{error}</p>}
        {success && <p role="status" style={styles.success}>{success}</p>}

        <button type="submit" style={saving ? styles.btnDisabled : styles.btn} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Campanha'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    fontFamily: 'Arial, sans-serif',
    maxWidth: 600,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: '1.75rem',
    color: '#0070f3',
    fontWeight: 'bold',
  },
  logo: {
    height: 120,
    objectFit: 'contain',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
    outline: 'none',
    fontFamily: 'Arial, sans-serif',
  },
  btn: {
    backgroundColor: '#005bbb',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: 16,
    transition: 'background-color 0.3s ease',
  },
  btnDisabled: {
    backgroundColor: '#0077ff88',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: 5,
    fontWeight: '600',
    fontSize: 16,
    cursor: 'not-allowed',
  },
  error: {
    color: '#bb0000',
    fontWeight: '600',
  },
  success: {
    color: '#007700',
    fontWeight: '600',
  },
};
