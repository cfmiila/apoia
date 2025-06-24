'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';

export default function CriarCampanha() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    meta: '',
    dataFim: '',
    categoria: 'outros'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const newErrors = {};
    
    if (!form.nome.trim()) newErrors.nome = 'Nome da campanha é obrigatório';
    if (!form.meta || Number(form.meta) <= 0) newErrors.meta = 'Meta deve ser um valor positivo';
    if (form.dataFim && new Date(form.dataFim) < new Date()) newErrors.dataFim = 'Data não pode ser no passado';
    
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setError('Por favor, corrija os erros no formulário.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/campanhas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess('Campanha criada com sucesso! Redirecionando...');
        setTimeout(() => router.push('/painel-ong'), 1500);
      } else {
        const data = await res.json();
        setError(data.message || 'Erro ao criar campanha');
      }
    } catch (err) {
      setError('Erro na comunicação com o servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Criar Nova Campanha | Apoia</title>
      </Head>
      
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Criar Nova Campanha</h1>
          <Image 
            src="/Apoia.png" 
            alt="Logo Apoia" 
            width={200} 
            height={80} 
            style={styles.logo} 
          />
        </header>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Informações Básicas</legend>
            
            <div style={styles.formGroup}>
              <label htmlFor="nome" style={styles.label}>
                Nome da Campanha*
              </label>
              <input
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                style={styles.input}
                disabled={loading}
                placeholder="Ex: Arrecadação para comunidade local"
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="descricao" style={styles.label}>
                Descrição Detalhada
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                style={styles.textarea}
                disabled={loading}
                placeholder="Descreva os objetivos e como os recursos serão utilizados..."
                rows={5}
              />
            </div>
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Meta e Prazo</legend>
            
            <div style={styles.gridContainer}>
              <div style={styles.formGroup}>
                <label htmlFor="meta" style={styles.label}>
                  Valor Meta (R$)*
                </label>
                <div style={styles.inputWithIcon}>
                  <span style={styles.currency}>R$</span>
                  <input
                    id="meta"
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="meta"
                    value={form.meta}
                    onChange={handleChange}
                    required
                    style={{...styles.input, paddingLeft: 30}}
                    disabled={loading}
                    placeholder="1500.00"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="dataFim" style={styles.label}>
                  Data Final (Opcional)
                </label>
                <input
                  id="dataFim"
                  type="date"
                  name="dataFim"
                  value={form.dataFim}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Categoria</legend>
            <div style={styles.formGroup}>
              <label htmlFor="categoria" style={styles.label}>
                Selecione a Categoria
              </label>
              <select
                id="categoria"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
              >
                <option value="educacao">Educação</option>
                <option value="saude">Saúde</option>
                <option value="meio-ambiente">Meio Ambiente</option>
                <option value="social">Social</option>
                <option value="outros">Outros</option>
              </select>
            </div>
          </fieldset>

          {error && (
            <div style={styles.alert} role="alert">
              <span style={styles.alertIcon}>⚠️</span>
              {error}
            </div>
          )}
          {success && (
            <div style={styles.successAlert} role="status">
              <span style={styles.alertIcon}>✓</span>
              {success}
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button 
              type="button" 
              style={styles.secondaryButton}
              onClick={() => router.push('/painel-ong')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              style={loading ? styles.primaryButtonDisabled : styles.primaryButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Enviando...
                </>
              ) : 'Criar Campal'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
const styles = {
  container: {
    padding: '1rem',
    maxWidth: 800,
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.6rem',
    color: '#0070f3',
    fontWeight: '700',
  },
  logo: {
    objectFit: 'contain',
  },
  form: {
    marginTop: 12,
  },
  fieldset: {
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  legend: {
    fontWeight: '700',
    color: '#0070f3',
    marginBottom: 8,
    fontSize: '1.1rem',
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontWeight: '600',
    color: '#0070f3',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 14,
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 14,
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  gridContainer: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
  },
  inputWithIcon: {
    position: 'relative',
  },
  currency: {
    position: 'absolute',
    left: 12,
    top: 12,
    color: '#888',
    fontSize: 14,
  },
  alert: {
    backgroundColor: '#fdecea',
    color: '#b71c1c',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
  },
  successAlert: {
    backgroundColor: '#e6f4ea',
    color: '#1b5e20',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
  },
  alertIcon: {
    fontWeight: 'bold',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: '#e0e0e0',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: 14,
  },
  primaryButtonDisabled: {
    backgroundColor: '#90caf9',
    color: 'white',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 6,
    cursor: 'not-allowed',
    fontWeight: '700',
    fontSize: 14,
  },
  spinner: {
    marginRight: 8,
    display: 'inline-block',
    width: 12,
    height: 12,
    border: '2px solid white',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};
