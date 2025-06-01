import { useState } from 'react';

import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from './config';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import CustomInput from './CustomInput';

function ApoiaChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
     
      <div
        style={{
          position: 'fixed',
          bottom: '100px', 
          right: '20px',
          width: '320px',
          height: '400px',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          borderRadius: '8px',
          background: 'white',
          zIndex: 1000,

          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1)' : 'scale(0.8)',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease, transform 300ms ease',
        }}
      >
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
          customComponents={{ userInput: CustomInput }}
        />
      </div>

     
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '40px', 
          right: '20px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(94, 224, 223, 0.9)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1100,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          transition: 'box-shadow 0.3s ease',
          boxShadow: isOpen
            ? '0 0 12px 4px rgba(94, 224, 223, 0.7)'
            : '0 2px 5px rgba(0,0,0,0.3)',
        }}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow =
            '0 0 12px 6px rgba(94, 224, 223, 0.9)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = isOpen
            ? '0 0 12px 4px rgba(94, 224, 223, 0.7)'
            : '0 2px 5px rgba(0,0,0,0.3)')
        }
      >
        <img
          src="/apoiabot.png"
          alt="ApoiaBot"
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
      </button>
    </>
  );
}

export default ApoiaChatbot;
