"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroONG() {

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cnpj: "",
    telefone: "",
    descricao: "",
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const router = useRouter();

  const validatePassword = (password) => {
    if (password.length < 8) return "A senha deve ter pelo menos 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Deve conter pelo menos uma letra maiúscula";
    if (!/[a-z]/.test(password)) return "Deve conter pelo menos uma letra minúscula";
    if (!/[0-9]/.test(password)) return "Deve conter pelo menos um número";
    if (!/[\W_]/.test(password)) return "Deve conter pelo menos um caractere especial";
    return "";
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const isEnderecoField = name.startsWith("endereco.");

    // Limpeza de caracteres não numéricos
    if (name === "cnpj" || name === "telefone" || name === "endereco.cep") {
      const onlyNums = value.replace(/\D/g, "");
      const maxLength = name === 'cnpj' ? 14 : (name === 'telefone' ? 11 : 8);
      
      if (isEnderecoField) {
        const field = name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          endereco: { ...prev.endereco, [field]: onlyNums.slice(0, maxLength) },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: onlyNums.slice(0, maxLength) }));
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

    if (name === 'senha') {
        setPasswordError(validatePassword(value));
    }
  };
  
 //Função para buscar CEP usando o estado 'error'
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");

    if (cep.length !== 8) {
      return;
    }

    setIsLoadingCep(true);
    setError(""); 
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado.");
      }

      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cep: cep,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        },
      }));
    } catch (err) {
      setError(err.message); 
    } finally {
      setIsLoadingCep(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const pwdError = validatePassword(formData.senha);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    if (formData.cnpj.length !== 14) {
      setError("CNPJ inválido - deve conter 14 dígitos.");
      return;
    }
  
    if (!formData.endereco.cep || !formData.endereco.numero) {
        setError("CEP e Número do endereço são obrigatórios.");
        return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3100/ong/create", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err.message || "Erro ao cadastrar a ONG. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:block w-1/2 h-screen bg-gray-200 relative">
        <Image src="/ong-image.png" alt="ONG" fill className="object-cover" priority />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-white overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold">Cadastre sua ONG</h1>
        <p className="mt-2 text-gray-600">Receba apoio!</p>

        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        {success && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">Cadastro realizado com sucesso! Você será redirecionado...</div>}

        <form className="flex flex-col space-y-4 mt-4" onSubmit={handleSubmit} noValidate>
        
          <Input name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome da ONG" required />
          <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email de contato" required />
          <Input name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ (apenas números)" required />
          <Input name="telefone" type="tel" value={formData.telefone} onChange={handleChange} placeholder="Telefone (com DDD)" />
          <Input name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descreva brevemente sua ONG" required />
          <div>
            <Input name="senha" type="password" value={formData.senha} onChange={handleChange} placeholder="Crie uma senha segura" required />
            {formData.senha && passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
          </div>

          <h2 className="text-xl font-semibold pt-4 border-t mt-4">Endereço da Sede</h2>
          <Input name="endereco.cep" value={formData.endereco.cep} onChange={handleChange} onBlur={handleCepBlur} placeholder="CEP (apenas números)" required />
          {isLoadingCep && <p className="text-sm text-blue-500">Buscando CEP...</p>}
          <Input name="endereco.logradouro" value={formData.endereco.logradouro} onChange={handleChange} placeholder="Rua" required readOnly={isLoadingCep} />
          <div className="flex space-x-4">
            <Input name="endereco.numero" value={formData.endereco.numero} onChange={handleChange} placeholder="Número" required className="w-1/2"/>
            <Input name="endereco.complemento" value={formData.endereco.complemento} onChange={handleChange} placeholder="Complemento" className="w-1/2"/>
          </div>
          <Input name="endereco.bairro" value={formData.endereco.bairro} onChange={handleChange} placeholder="Bairro" required readOnly={isLoadingCep} />
          <div className="flex space-x-4">
            <Input name="endereco.cidade" value={formData.endereco.cidade} onChange={handleChange} placeholder="Cidade" required readOnly={isLoadingCep} className="w-2/3"/>
            <Input name="endereco.estado" value={formData.endereco.estado} onChange={handleChange} placeholder="Estado" required readOnly={isLoadingCep} className="w-1/3"/>
          </div>

         
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700" 
            disabled={loading || isLoadingCep || !!passwordError}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

        <p className="mt-4 text-center">
          Possui uma conta?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}