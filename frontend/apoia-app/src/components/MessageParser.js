class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lower = message.toLowerCase();

    if (/^(oi|olá|ola|bom dia|boa tarde|boa noite)/i.test(lower)) {
      this.actionProvider.handleGreeting();
    } else if (/1|doar|doação|contribuir|ajudar|apoio/i.test(lower)) {
      this.actionProvider.handleDoar();
    } else if (/2|cadastrar|ong|organização|entidade|osc/i.test(lower)) {
      this.actionProvider.handleCadastrarONG();
    } else if (/3|funciona|como funciona|plataforma|serviço|projeto/i.test(lower)) {
      this.actionProvider.handleFuncionamento();
    } else if (/4|suporte|ajuda|contato|falar|problema|dúvida/i.test(lower)) {
      this.actionProvider.handleSuporte();
    } else {
      this.actionProvider.handleFallback();
    }
  }
}

export default MessageParser;
