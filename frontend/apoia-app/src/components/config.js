import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'ApoiaBot';

const config = {
  botName: botName,
  initialMessages: [
    createChatBotMessage(`Olá! Eu sou o ${botName}. Como posso ajudar você?`)
  ],
  customStyles: {
    botMessageBox: { backgroundColor: '#376B7E' },
    chatButton: { backgroundColor: '#376B7E' }
  },
  customComponents: {
    header: () => <div className="text-white p-2 bg-blue-700">{botName}</div>,
    botAvatar: () => <img src="/apoiabot.png" alt="bot" className="w-8 h-8 rounded-full" />,

  }
};

export default config;
