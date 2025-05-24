"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react"; // Correção: remove "use" de "useState"
import axios from "axios";
import { useRouter } from "next/navigation"; // Corrigido para 'next/navigation'

export default function CadastroONG() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cnpj: "",
    telefone: "",
    descricao: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // Função para lidar com as mudanças de valores no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(""); // Resetar mensagem de erro

      // Verifique os dados antes de enviar
      console.log("Enviando dados para o backend:", formData);

      // Enviar dados para o backend
      const response = await axios.post(
        "http://localhost:3100/ong/create", // Altere para a URL do seu backend
        formData
      );

      // Redirecionar para a página de sucesso após o cadastro
      router.push("/pagina-de-sucesso"); // Altere para a URL de sucesso desejada
    } catch (err) {
      // Exibe a mensagem de erro do backend ou mensagem genérica
      const errorMessage =
        err.response?.data?.error || "Erro ao cadastrar a ONG.";
      setError(errorMessage);
      console.error("Erro no cadastro:", err);
    } finally {
      setLoading(false); // Desativa o carregamento após a requisição
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col justify-center p-12 bg-white">
        <h1 className="text-4xl font-bold">Cadastre sua ONG</h1>
        <p className="mt-2 text-gray-600">Receba apoio!</p>

        {error && <p className="text-red-500">{error}</p>}

        <form className="flex flex-col space-y-4 mt-2" onSubmit={handleSubmit}>
          <Label htmlFor="nome" className="text-lg font-light">
            Nome da ONG
          </Label>
          <Input
            type="text"
            placeholder="Nome da ONG"
            className="rounded-2xl"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />

          <Label htmlFor="email" className="text-lg font-light">
            Email
          </Label>
          <Input
            type="email"
            placeholder="Email"
            className="rounded-2xl"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Label htmlFor="cnpj" className="text-lg font-light">
            CNPJ
          </Label>
          <Input
            type="text"
            placeholder="CNPJ"
            className="rounded-2xl"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            required
          />

          <Label htmlFor="telefone" className="text-lg font-light">
            Telefone
          </Label>
          <Input
            type="text"
            placeholder="Telefone"
            className="rounded-2xl"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
          />

          <Label htmlFor="descricao" className="text-lg font-light">
            Descrição
          </Label>
          <Input
            type="text"
            placeholder="Descrição"
            className="rounded-2xl"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          />

          <Label htmlFor="senha" className="text-lg font-light">
            Senha
          </Label>
          <Input
            type="password"
            placeholder="Senha"
            className="rounded-2xl"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />

          <Button
            className="bg-blue-600 text-white p-3 rounded-2xl"
            type="submit"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

        <p className="mt-4 text-center">
          Possui uma conta?{" "}
          <Link href="/login" className="text-blue-600 text-center">
            Entrar
          </Link>
        </p>
      </div>

      <div className="w-1/2 h-screen bg-gray-200 relative">
        <div className="absolute inset-0">
          <Image src="/ong-image.jpg" alt="ONG" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}
