class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message]
    }));
  };

  apresentarBot = () => {
    const mensagens = [
      this.createChatBotMessage(
        'Como posso te ajudar hoje? Escolha uma opção:\n\n1️⃣ Doar para uma causa\n2️⃣ Cadastrar minha ONG\n3️⃣ Como funciona a plataforma\n4️⃣ Falar com nosso suporte'
      )
    ];
    mensagens.forEach(this.addMessageToState);
  };

  handleGreeting = () => {
    const mensagem = this.createChatBotMessage('Olá! Como posso ajudar? 😊');
    this.addMessageToState(mensagem);
    this.apresentarBot();
  };

  handleDoar = () => {
    const mensagens = [
      this.createChatBotMessage('Ótimo que quer fazer uma doação! 💙'),
      this.createChatBotMessage('1. Acesse a seção "Causas" no menu\n2. Escolha a causa\n3. Clique em "Quero Apoiar"\n4. Complete a doação com segurança via Stripe.')
    ];
    mensagens.forEach(this.addMessageToState);
  };

  handleCadastrarONG = () => {
    const mensagens = [
      this.createChatBotMessage('Que ótimo que deseja cadastrar sua ONG! 🌟'),
      this.createChatBotMessage('1. Clique em "Cadastrar ONG" no menu\n2. Preencha os dados\n3. Envie documentos\n4. Validação em até 48h.')
    ];
    mensagens.forEach(this.addMessageToState);
  };

  handleFuncionamento = () => {
    const mensagens = [
      this.createChatBotMessage('O Apoia+ conecta doadores a ONGs de forma transparente! 🔗'),
      this.createChatBotMessage('ONGs cadastram causas, doadores apoiam, e todo processo é monitorado e seguro.')
    ];
    mensagens.forEach(this.addMessageToState);
  };

  handleSuporte = () => {
    const mensagens = [
      this.createChatBotMessage('Estamos aqui para te ajudar! '),
      this.createChatBotMessage('📧 suporte@apoiaplus.com.br\n📞 (11) 4002-8922\n💬 Chat Online: Seg-Sex, 9h-18h')
    ];
    mensagens.forEach(this.addMessageToState);
  };

  handleFallback = () => {
    const mensagem = this.createChatBotMessage(
      'Desculpe, não entendi. Pode escolher:\n\n1️⃣ Doar\n2️⃣ Cadastrar ONG\n3️⃣ Como funciona\n4️⃣ Suporte'
    );
    this.addMessageToState(mensagem);
  };
}

export default ActionProvider;
