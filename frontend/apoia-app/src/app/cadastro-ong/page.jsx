"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  // Validação de senha com feedback detalhado
  const validatePassword = (password) => {
    if (password.length < 8) return "A senha deve ter pelo menos 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Deve conter pelo menos uma letra maiúscula";
    if (!/[a-z]/.test(password)) return "Deve conter pelo menos uma letra minúscula";
    if (!/[0-9]/.test(password)) return "Deve conter pelo menos um número";
    if (!/[@$!%*?&]/.test(password)) return "Deve conter pelo menos um caractere especial (@$!%*?&)";
    return "";
  };

  // Máscara de CNPJ melhorada
  const handleCnpjChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 14) value = value.substring(0, 14);
    
    // Máscara progressiva
    value = value
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

    setFormData(prev => ({ ...prev, cnpj: value }));
  };

  // Máscara de telefone 
  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    
    // Máscara condicional
    if (value.length <= 10) {
      value = value
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      value = value
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }

    setFormData(prev => ({ ...prev, telefone: value }));
  };

  // Validação em tempo real da senha
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, senha: value }));
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validações finais antes do envio
    const pwdError = validatePassword(formData.senha);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (formData.cnpj.replace(/\D/g, '').length !== 14) {
      setError("CNPJ inválido - deve conter 14 dígitos");
      return;
    }

    try {
      setLoading(true);
      
      // Prepara dados para envio (remove máscaras)
      const dadosParaEnviar = {
        ...formData,
        cnpj: formData.cnpj.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, '')
      };

      const response = await axios.post(
        "http://localhost:3100/ong/create",
        dadosParaEnviar,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 
        }
      );

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error("Erro no cadastro:", err);
      
      let errorMessage = "Erro ao cadastrar a ONG";
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data.error || "Dados inválidos";
        } else if (err.response.status === 409) {
          errorMessage = "ONG já cadastrada com este CNPJ ou e-mail";
        }
      } else if (err.request) {
        errorMessage = "Sem resposta do servidor";
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = "Tempo de conexão esgotado";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold">Cadastre sua ONG</h1>
        <p className="mt-2 text-gray-600">Receba apoio!</p>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
            Cadastro realizado com sucesso! Redirecionando...
          </div>
        )}

        <form className="flex flex-col space-y-4 mt-4" onSubmit={handleSubmit}>
          {/* Campo Nome */}
          <div>
            <Label htmlFor="nome" className="text-base md:text-lg font-light">
              Nome da ONG
            </Label>
            <Input
              type="text"
              placeholder="Nome da ONG"
              className="rounded-2xl mt-1"
              name="nome"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
            />
          </div>

          {/* Campo Email */}
          <div>
            <Label htmlFor="email" className="text-base md:text-lg font-light">
              Email
            </Label>
            <Input
              type="email"
              placeholder="exemplo@ong.org"
              className="rounded-2xl mt-1"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          {/* Campo CNPJ */}
          <div>
            <Label htmlFor="cnpj" className="text-base md:text-lg font-light">
              CNPJ
            </Label>
            <Input
              type="text"
              placeholder="00.000.000/0000-00"
              className="rounded-2xl mt-1"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleCnpjChange}
              required
            />
          </div>

          {/* Campo Telefone */}
          <div>
            <Label htmlFor="telefone" className="text-base md:text-lg font-light">
              Telefone
            </Label>
            <Input
              type="text"
              placeholder="(00) 00000-0000"
              className="rounded-2xl mt-1"
              name="telefone"
              value={formData.telefone}
              onChange={handleTelefoneChange}
              required
            />
          </div>

          {/* Campo Descrição */}
          <div>
            <Label htmlFor="descricao" className="text-base md:text-lg font-light">
              Descrição
            </Label>
            <Input
              type="text"
              placeholder="Descreva o propósito da sua ONG"
              className="rounded-2xl mt-1"
              name="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              required
            />
          </div>

          {/* Campo Senha */}
          <div>
            <Label htmlFor="senha" className="text-base md:text-lg font-light">
              Senha
            </Label>
            <Input
              type="password"
              placeholder="Crie uma senha segura"
              className="rounded-2xl mt-1"
              name="senha"
              value={formData.senha}
              onChange={handlePasswordChange}
              required
            />
            {formData.senha && passwordError && (
              <p className="text-sm text-red-500 mt-1">
                {passwordError}
              </p>
            )}
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-2xl transition-colors"
            type="submit"
            disabled={loading || passwordError}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cadastrando...
              </span>
            ) : "Cadastrar"}
          </Button>
        </form>

        <p className="mt-4 text-center">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-800 transition-colors">
            Faça login
          </Link>
        </p>
      </div>

      <div className="hidden md:block md:w-1/2 h-screen bg-gray-200 relative">
        <div className="absolute inset-0">
          <Image 
            src="/ong-image.png" 
            alt="ONG" 
            fill 
            className="object-covergit"
            priority
            sizes="(max-width: 768px) 50vw, 30vw"
          />
        </div>
      </div>
    </div>
  );
}