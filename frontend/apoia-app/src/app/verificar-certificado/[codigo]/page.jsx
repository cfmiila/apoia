"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // <--- Importação correta para App Router
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default function VerificarCertificado() {
  const params = useParams(); // <--- Hook correto para acessar parâmetros
  const { codigo } = params; // <--- Acessando o parâmetro 'codigo'
  const [certificado, setCertificado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (codigo) {
      const fetchCertificado = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await axios.get(
            `http://localhost:3100/api/certificados/verificar/${codigo}`
          );
          setCertificado(response.data);
        } catch (err) {
          console.error("Erro ao buscar certificado:", err);
          setError(
            err.response?.data?.error ||
              "Certificado não encontrado ou inválido."
          );
        } finally {
          setLoading(false);
        }
      };
      fetchCertificado();
    }
  }, [codigo]);

  if (loading) {
    return <div className="p-8 text-center">Verificando certificado...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        <h1 className="text-3xl font-bold mb-4">Erro na Verificação</h1>
        <p>{error}</p>
        <p className="mt-4 text-gray-600">
          Por favor, verifique o código e tente novamente.
        </p>
      </div>
    );
  }

  if (!certificado) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nenhum certificado encontrado para o código fornecido.
      </div>
    );
  }

  // Desestruturar para facilitar o acesso aos dados
  const { doacao, dataEmissao, descricaoImpacto, codigoVerificacao } =
    certificado;
  const { usuario, campanha } = doacao;
  const { ong } = campanha;

  return (
    <div className="container mx-auto p-8 w-full max-w-2xl">
      <Card className="shadow-lg border-2 border-green-500">
        <CardHeader className="text-center bg-green-50 p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-extrabold text-green-700">
            Certificado de Impacto Validado
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            Este certificado atesta uma doação autêntica à nossa plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700">Certificamos que</p>
            <p className="text-4xl font-bold text-blue-700 mt-2">
              {usuario.nome}
            </p>
            <p className="text-lg text-gray-700 mt-4">realizou uma doação de</p>
            <p className="text-3xl font-extrabold text-green-600 mt-2">
              {formatCurrency(doacao.valor)}
            </p>
            <p className="text-lg text-gray-700 mt-2">
              em{" "}
              <span className="font-semibold">
                {new Date(doacao.dataDoacao).toLocaleDateString("pt-BR")}
              </span>{" "}
              para a campanha
            </p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              "{campanha.nome}"
            </p>
          </div>

          <Separator className="my-6 bg-gray-300" />

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Impacto Gerado
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {descricaoImpacto ||
                "Esta doação contribui diretamente para o avanço das ações e projetos da organização, promovendo um impacto positivo e significativo na comunidade e no meio ambiente."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-8">
            <div>
              <p>
                <span className="font-semibold">Organização:</span> {ong.nome}
              </p>
              <p>
                <span className="font-semibold">E-mail da ONG:</span>{" "}
                {ong.email}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Data de Emissão:</span>{" "}
                {new Date(dataEmissao).toLocaleDateString("pt-BR")}
              </p>
              <p>
                <span className="font-semibold">Código de Verificação:</span>{" "}
                <span className="font-bold text-blue-500">
                  {codigoVerificacao}
                </span>
              </p>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm italic mt-8 pt-4 border-t border-gray-200">
            Este é um documento digital. A autenticidade pode ser verificada a
            qualquer momento através do código de verificação acima.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
