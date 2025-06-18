"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from 'next/link';
import { Eye, EyeOff } from "lucide-react";  // ⬅️ Adicionado para o ícone do olhinho

const validarSenhaForte = (senha) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(senha);
};

const validarCPF = (cpf) => {
  const regex = /^[0-9]{11}$/;
  return regex.test(cpf);
};

export default function CadastroDoador() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cpf: "",
  });

  const [mensagem, setMensagem] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);  // ⬅️ Estado para visualizar senha

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cpf" || name === "telefone") {
      const onlyNums = value.replace(/\D/g, "").slice(0, 11);
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || formData.nome.length < 3) {
      setMensagem({ text: "Nome deve ter pelo menos 3 caracteres", type: "error" });
      return;
    }

    if (!validarSenhaForte(formData.senha)) {
      setMensagem({
        text: "Senha deve ter 8+ caracteres com maiúsculas, minúsculas, números e símbolos",
        type: "error",
      });
      return;
    }

    if (!validarCPF(formData.cpf)) {
      setMensagem({ text: "CPF inválido", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3100/usuario/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar doador");
      }

      setMensagem({ text: "Doador cadastrado com sucesso!", type: "success" });
      setFormData({ nome: "", email: "", senha: "", telefone: "", cpf: "" });
    } catch (error) {
      setMensagem({
        text: error.message.includes("Failed to fetch")
          ? "Erro na conexão com o servidor"
          : error.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Lado da Imagem */}
      <div className="w-1/2 h-screen bg-gray-200 relative">
        <div className="absolute inset-0">
          <Image
            src="/doador-image.png"
            alt="ONG"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Formulário */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold">Seja um doador</h1>
        <p className="mt-2 text-gray-600">Faça a diferença!</p>

        <form
          className="flex flex-col space-y-3 mt-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <Label htmlFor="nome">Nome completo*</Label>
          <Input
            id="nome"
            name="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome completo"
            className="rounded-2xl"
            required
            minLength={3}
          />
          <p className="text-sm text-gray-500 -mt-2">Mínimo 3 caracteres</p>

          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemplo@dominio.com"
            className="rounded-2xl"
            required
          />
          <p className="text-sm text-gray-500 -mt-2">Digite um email válido</p>

          <Label htmlFor="senha">Senha*</Label>
          <div className="relative">
            <Input
              id="senha"
              name="senha"
              type={showPassword ? "text" : "password"}  // ⬅️ Alternância de tipo
              value={formData.senha}
              onChange={handleChange}
              placeholder="Crie uma senha forte"
              className="rounded-2xl pr-10"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-sm text-gray-500 -mt-2">
            Use 8+ caracteres com maiúsculas, minúsculas, números e símbolos
          </p>

          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            name="telefone"
            type="tel"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
            className="rounded-2xl"
            pattern="[0-9]{10,11}"
          />
          <p className="text-sm text-gray-500 -mt-2">Apenas números, com DDD</p>

          <Label htmlFor="cpf">CPF*</Label>
          <Input
            id="cpf"
            name="cpf"
            type="text"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="00000000000"
            className="rounded-2xl"
            required
            maxLength={11}
          />
          <p className="text-sm text-gray-500 -mt-2">Digite um CPF válido</p>

          <Button
            type="submit"
            className="mt-4 bg-blue-700 rounded-3xl text-white hover:bg-blue-400 cursor-pointer delay-100"
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Cadastrar"}
          </Button>

          {mensagem.text && (
            <p
              className={`mt-4 text-sm ${
                mensagem.type === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {mensagem.text}
            </p>
          )}
        </form>
        <p className="mt-4 text-center">
          Possui uma conta?{" "}
          <Link href="/login" className="text-blue-600 text-center">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
