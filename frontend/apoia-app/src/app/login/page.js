"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";  // ⬅️ Ícones do olhinho

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const [mensagem, setMensagem] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ⬅️ Estado para mostrar/ocultar senha
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.senha) {
      setMensagem({
        text: "Por favor, preencha todos os campos",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3100/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMensagem({ text: "Login realizado com sucesso!", type: "success" });

      const tipoUsuario = data.user.tipo;

      if (tipoUsuario === "ONG") {
        router.push("/dashboard-ong");
      } else if (tipoUsuario === "DOADOR") {
        router.push("/");
      } else {
        router.push("/");
      }
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
            src="/login.png"
            alt="Login"
            className="object-cover w-full h-full"
            fill
          />
        </div>
      </div>

      {/* Formulário de login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold">Bem-vindo de volta!</h1>
        <p className="mt-2 text-gray-600">Faça login para continuar.</p>

        {mensagem.text && (
          <div
            className={`mt-3 text-sm ${
              mensagem.type === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {mensagem.text}
          </div>
        )}

        <form
          className="flex flex-col space-y-3 mt-4"
          onSubmit={handleSubmit}
          noValidate
        >
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

          <Label htmlFor="senha">Senha*</Label>
          <div className="relative">
            <Input
              id="senha"
              name="senha"
              type={showPassword ? "text" : "password"}
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite sua senha"
              className="rounded-2xl pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-blue-700 rounded-3xl text-white hover:bg-blue-400 cursor-pointer delay-100"
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </Button>

          <div className="mt-4 text-center">
            <p>
              Não tem uma conta?{" "}
              <Link
                href="/cadastro-doador"
                className="text-blue-600 hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
