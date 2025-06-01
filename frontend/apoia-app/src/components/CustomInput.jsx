import { useState } from 'react';

function CustomInput({ onSubmit }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-2">
      <input
        className="flex-1 border rounded p-2"
        placeholder="Digite aqui sua mensagem"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Enviar
      </button>
    </form>
  );
}

export default CustomInput;
