"use client";
import React from "react";
import '@/app/css/styles.css';

export default function LoginPage() {
  return (
    <div className="container">
      <div className="form-section">
        <h2>Bem vindo de volta</h2>
        <p>Entre com suas credenciais para acessar sua conta</p>

        <form action="/login" method="POST">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Digite seu e-mail"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            placeholder="Digite sua senha"
            required
          />

          <div className="options">
            <label>
              <input type="checkbox" /> Lembrar por 30 dias
            </label>
            <a href="#">Esqueceu a senha</a>
          </div>

          <button type="submit" className="login-btn">Entrar</button>
        </form>

        <div className="divisao">ou</div>

        <button className="google-button">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
          />
          Entrar com Google
        </button>

        <p className="signup">
          Não possui uma conta? <a href="#">Cadastre-se</a>
        </p>
      </div>

      <div className="image-section">
        <img src="/imglogin.png" alt="Imagem de fundo" />
      </div>
    </div>
  );
}
