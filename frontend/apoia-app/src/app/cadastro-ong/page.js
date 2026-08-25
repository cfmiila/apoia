"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

const validarSenhaForte = (senha) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(senha);
};

export default function CadastroONG() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cnpj: "",
    telefone: "",
    descricao: "",
  });

  const [mensagem, setMensagem] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cnpj") {
      const onlyNums = value.replace(/\D/g, "").slice(0, 14);
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
      return;
    }

    if (name === "telefone") {
      const onlyNums = value.replace(/\D/g, "").slice(0, 11);
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || formData.nome.length < 3) {
      setMensagem({ text: "Nome deve ter pelo menos 3 caracteres", type: "error" });
      return;
    }

    if (!validarSenhaForte(formData.senha)) {
      setMensagem({
        text: "Senha deve ter 8+ caracteres com maiúsculas, minúsculas, números e especiais",
        type: "error"
      });
      return;
    }

    if (!formData.cnpj || formData.cnpj.length !== 14) {
      setMensagem({ text: "CNPJ inválido", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3100/ong/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          telefone: formData.telefone || null,
          descricao: formData.descricao || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar ONG");
      }

      setMensagem({ text: "ONG cadastrada com sucesso!", type: "success" });

      setFormData({
        nome: "",
        email: "",
        senha: "",
        cnpj: "",
        telefone: "",
        descricao: "",
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
      <div className="w-1/2 flex flex-col justify-center p-12 bg-white">
        <h1 className="text-4xl font-bold">Cadastre sua ONG</h1>
        <p className="mt-2 text-gray-600">Receba apoio!</p>
        <form className="flex flex-col space-y-2 mt-2" onSubmit={handleSubmit}>
          <Label htmlFor="nome-input" className="text-lg font-light">Nome da ONG</Label>
          <Input
            id="nome-input"
            name="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome da ONG"
            className="rounded-2xl"
            required
            minLength={3}
          />

          <Label htmlFor="email-input" className="text-lg font-light">Email</Label>
          <Input
            id="email-input"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="rounded-2xl"
            required
          />

          <Label htmlFor="cnpj-input" className="text-lg font-light">CNPJ</Label>
          <Input
            id="cnpj-input"
            name="cnpj"
            type="text"
            value={formData.cnpj}
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
            className="rounded-2xl"
            required
            minLength={14}
            maxLength={14}
          />

          <Label htmlFor="telefone-input" className="text-lg font-light">Telefone</Label>
          <Input
            id="telefone-input"
            name="telefone"
            type="tel"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="Telefone"
            className="rounded-2xl"
          />

          <Label htmlFor="descricao-input" className="text-lg font-light">Descrição</Label>
          <Input
            id="descricao-input"
            name="descricao"
            type="text"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descrição"
            className="rounded-2xl"
            maxLength={500}
          />

          <Label htmlFor="senha-input" className="text-lg font-light">Senha</Label>
          <Input
            id="senha-input"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Senha"
            className="rounded-2xl"
            required
            minLength={8}
          />

          <Button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-2xl"
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
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

        <p className="mt-4 text-center">Possui uma conta? <Link href="/login" className="text-blue-600 text-center">Entrar</Link></p>
      </div>
      <div className="w-1/2 bg-gray-200 flex items-center justify-center">
        <Image src="/ong-image.png" alt="ONG" width={500} height={500} className="h-full w-full" />
      </div>
    </div>
  );
}
