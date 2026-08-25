"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

const validarSenhaForte = (senha) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(senha);
};

export default function CadastroDoador() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
  });

  const [mensagem, setMensagem] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Formatação automática para CPF (11 dígitos)
    if (name === "cpf") {
      const onlyNums = value.replace(/\D/g, "").slice(0, 11);
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação frontend reforçada
    if (!formData.nome || formData.nome.length < 3) {
      setMensagem({ text: "Nome deve ter pelo menos 3 caracteres", type: "error" });
      return;
    }

    if (!validarSenhaForte(formData.senha)) {
      setMensagem({
        text: 'Senha deve ter 8+ caracteres com maiúsculas, minúsculas, números e especiais',
        type: 'error'
      });
      return;
    }

    if (!formData.cpf || formData.cpf.length !== 11) {
      setMensagem({ text: "CPF inválido", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3100/usuario/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar doador");
      }

      setMensagem({
        text: "Cadastro realizado com sucesso!",
        type: "success"
      });

      // Reset form
      setFormData({
        nome: "",
        email: "",
        senha: "",
        cpf: "",
      });

    } catch (error) {
      console.error("Erro:", error);
      setMensagem({
        text: error.message.includes("Failed to fetch") 
          ? "Erro na conexão com o servidor" 
          : error.message,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold">Seja doador</h1>
        <p className="mt-2 text-gray-600">Faça a diferença!</p>

        <form 
          className="flex flex-col space-y-3 mt-4" 
          onSubmit={handleSubmit}
          noValidate
        >
          <Label htmlFor="nome-input" className="text-lg font-light" aria-required="true">
            Nome completo*
          </Label>
          <Input
            id="nome-input"
            name="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome completo"
            className="rounded-2xl"
            required
            minLength={3}
            aria-describedby="nome-help"
          />
          <p id="nome-help" className="text-sm text-gray-500 -mt-2">Mínimo 3 caracteres</p>

          <Label htmlFor="email-input" className="text-lg font-light" aria-required="true">
            Email*
          </Label>
          <Input
            id="email-input"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemplo@email.com"
            className="rounded-2xl"
            required
            aria-describedby="email-help"
          />
          <p id="email-help" className="text-sm text-gray-500 -mt-2">Digite um email válido</p>

          <Label htmlFor="senha-input" className="text-lg font-light" aria-required="true">
            Senha*
          </Label>
          <Input
            id="senha-input"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Crie uma senha forte"
            className="rounded-2xl"
            required
            minLength={8}
            aria-describedby="senha-help"
          />
          <p id="senha-help" className="text-sm text-gray-500 -mt-2">
            Use 8+ caracteres com maiúsculas, minúsculas, números e símbolos
          </p>

          <Label htmlFor="cpf-input" className="text-lg font-light" aria-required="true">
            CPF*
          </Label>
          <Input
            id="cpf-input"
            name="cpf"
            type="text"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            className="rounded-2xl"
            required
            minLength={11}
            maxLength={11}
            pattern="\d{11}"
            aria-describedby="cpf-help"
          />
          <p id="cpf-help" className="text-sm text-gray-500 -mt-2">11 dígitos, apenas números</p>

          <Button
            type="submit" 
            className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-70 mt-4"
            disabled={isLoading}
            aria-label={isLoading ? "Cadastrando doador..." : "Cadastrar doador"}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cadastrando...
              </span>
            ) : (
              "Cadastrar"
            )}
          </Button>
        </form>

        {mensagem.text && (
          <div className={`mt-4 p-3 rounded-md text-center ${
            mensagem.type === "success" 
              ? "bg-green-50 text-green-700" 
              : "bg-red-50 text-red-700"
          }`}>
            {mensagem.text}
          </div>
        )}

        <p className="mt-4 text-center text-gray-600">
          Já possui uma conta?{" "}
          <Link 
            href="/login" 
            className="text-blue-600 hover:underline font-medium"
            aria-label="Ir para página de login"
          >
            Entrar agora
          </Link>
        </p>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
        <Image
          src="/doador-image.png"
          alt="Voluntários fazendo trabalho comunitário"
          width={600}
          height={600}
          className="h-full w-full object-cover"
          priority
          quality={85}
        />
      </div>
    </div>
  );
}