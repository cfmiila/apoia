"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from 'next/link';

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
    endereco: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });

    const [mensagem, setMensagem] = useState({ text: "", type: "" });
    const [isLoading, setIsLoading] = useState(false);

    const [isLoadingCep, setIsLoadingCep] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      const isEnderecoField = name.startsWith("endereco.");


    if (name === "cpf" || name === "telefone" || name === "endereco.cep") {
        const onlyNums = value.replace(/\D/g, "");
        if (isEnderecoField) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
              ...prev,
              endereco: { ...prev.endereco, [field]: onlyNums },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: onlyNums.slice(0, 11) }));
        }
    } else {
        if (isEnderecoField) {
          const field = name.split(".")[1];
          setFormData((prev) => ({
            ...prev,
            endereco: { ...prev.endereco, [field]: value },
          }));
        } else {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }
  };

  // Função para buscar CEP na API ViaCEP ---
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");

    if (cep.length !== 8) {
      return;
    }

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setMensagem({ text: "CEP não encontrado.", type: "error" });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        },
      }));
      setMensagem({ text: "", type: "" }); 
    } catch (error) {
      setMensagem({ text: "Erro ao buscar CEP.", type: "error" });
    } finally {
      setIsLoadingCep(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações básicas
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
    // --- Validação de endereço ---
    if (!formData.endereco.cep || !formData.endereco.numero) {
      setMensagem({ text: "CEP e Número são obrigatórios.", type: "error" });
      return;
    }


    setIsLoading(true);
    setMensagem({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:3100/usuario/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar doador");
      }

      setMensagem({ text: "Doador cadastrado com sucesso!", type: "success" });
     
      setFormData({
        nome: "", email: "", senha: "", telefone: "", cpf: "",
        endereco: { cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "" }
      });

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
      <div className="hidden md:block w-1/2 h-screen bg-gray-200 relative">
        <div className="absolute inset-0">
          <Image
            src="/doador-image.png"
            alt="ONG"
            fill
            className="object-cover"
          />
        </div>
      </div>

    
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-white overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold">Seja um doador</h1>
        <p className="mt-2 text-gray-600">Faça a diferença!</p>

        <form
          className="flex flex-col space-y-3 mt-4"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Campos de Dados Pessoais */}
          <Label htmlFor="nome">Nome completo*</Label>
          <Input id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} placeholder="Nome completo" className="rounded-2xl" required/>

          <Label htmlFor="email">Email*</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="exemplo@dominio.com" className="rounded-2xl" required/>

          <Label htmlFor="senha">Senha*</Label>
          <Input id="senha" name="senha" type="password" value={formData.senha} onChange={handleChange} placeholder="Crie uma senha forte" className="rounded-2xl" required/>

          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} placeholder="Apenas números, com DDD" className="rounded-2xl"/>

          <Label htmlFor="cpf">CPF*</Label>
          <Input id="cpf" name="cpf" type="text" value={formData.cpf} onChange={handleChange} placeholder="00000000000" className="rounded-2xl" required maxLength={11}/>
          
          {/* --- NOVOS CAMPOS DE ENDEREÇO --- */}   <h2 className="text-xl font-semibold pt-4 border-t mt-4">Endereço</h2>

          <Label htmlFor="cep">CEP*</Label>
          <Input
            id="cep"
            name="endereco.cep"
            type="text"
            value={formData.endereco.cep}
            onChange={handleChange}
            onBlur={handleCepBlur} 
            placeholder="00000000"
            className="rounded-2xl"
            required
            maxLength={8}
          />
          {isLoadingCep && <p className="text-sm text-blue-500">Buscando CEP...</p>}

          <Label htmlFor="logradouro">Logradouro*</Label>
          <Input id="logradouro" name="endereco.logradouro" type="text" value={formData.endereco.rua} onChange={handleChange} placeholder="Rua, Avenida..." className="rounded-2xl" required readOnly={isLoadingCep} />

          <div className="flex space-x-4">
            <div className="w-1/2">
              <Label htmlFor="numero">Número*</Label>
              <Input id="numero" name="endereco.numero" type="text" value={formData.endereco.numero} onChange={handleChange} className="rounded-2xl" required />
            </div>
            <div className="w-1/2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" name="endereco.complemento" type="text" value={formData.endereco.complemento} onChange={handleChange} placeholder="Apto, Bloco..." className="rounded-2xl" />
            </div>
          </div>
          
          <Label htmlFor="bairro">Bairro*</Label>
          <Input id="bairro" name="endereco.bairro" type="text" value={formData.endereco.bairro} onChange={handleChange} className="rounded-2xl" required readOnly={isLoadingCep} />

          <div className="flex space-x-4">
            <div className="w-2/3">
              <Label htmlFor="cidade">Cidade*</Label>
              <Input id="cidade" name="endereco.cidade" type="text" value={formData.endereco.cidade} onChange={handleChange} className="rounded-2xl" required readOnly={isLoadingCep} />
            </div>
            <div className="w-1/3">
              <Label htmlFor="estado">Estado*</Label>
              <Input id="estado" name="endereco.estado" type="text" value={formData.endereco.estado} onChange={handleChange} className="rounded-2xl" required readOnly={isLoadingCep} />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-4 bg-blue-700 rounded-3xl text-white hover:bg-blue-400 cursor-pointer delay-100"
            disabled={isLoading || isLoadingCep}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>

          {mensagem.text && (
            <p className={`mt-4 text-sm text-center ${mensagem.type === "success" ? "text-green-500" : "text-red-500"}`}>
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