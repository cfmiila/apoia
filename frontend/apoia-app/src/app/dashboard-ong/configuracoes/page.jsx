"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner"; // Import toast from sonner
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function OngSettings() {
  const router = useRouter();
  const [ongData, setOngData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchOngData = async () => {
      const storedIdOng = localStorage.getItem("idOng");
      if (!storedIdOng) {
        // Não é necessário console.error, o toast e redirect são suficientes.
        toast.error("Sua sessão expirou.", {
          description:
            "Por favor, faça login novamente para acessar as configurações.",
        });
        router.push("/login");
        return;
      }

      const ongId = Number(storedIdOng);
      try {
        const res = await axios.get(`http://localhost:3100/api/ongs/${ongId}`);
        setOngData(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados da ONG:", err); // Manter este log para depuração em caso de falha na busca
        setError(
          "Não foi possível carregar os dados da ONG. Tente novamente mais tarde."
        );
        toast.error("Não foi possível carregar os dados da ONG.", {
          description: "Verifique sua conexão ou tente novamente.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOngData();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("endereco.")) {
      const addressField = name.split(".")[1];
      setOngData((prevData) => ({
        ...prevData,
        endereco: {
          ...prevData.endereco,
          [addressField]: value,
        },
      }));
    } else {
      setOngData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const storedIdOng = localStorage.getItem("idOng");
    if (!storedIdOng) {
      toast.error("Sua sessão expirou.", {
        description: "Por favor, faça login novamente.",
      });
      router.push("/login");
      setIsSaving(false);
      return;
    }

    const ongId = Number(storedIdOng);

    try {
      // Não é necessário armazenar a resposta se não for usá-la imediatamente para atualizar o estado
      // Mas se o backend retornar dados atualizados, é uma boa prática usar:
      const response = await axios.put(
        `http://localhost:3100/api/ongs/${ongId}`,
        ongData
      );
      // Opcional: Atualizar o estado com os dados retornados pelo backend para garantir consistência
      setOngData(response.data);

      toast.success("Suas informações foram atualizadas!", {
        description: "Os dados da sua ONG foram salvos com sucesso.",
      });
    } catch (err) {
      console.error(
        "Erro ao atualizar ONG:",
        err.response ? err.response.data : err.message
      ); // Manter este log para depuração
      setError(
        "Erro ao atualizar suas informações. Verifique os dados e tente novamente."
      );
      toast.error("Não foi possível atualizar as informações da ONG.", {
        description: `Ocorreu um erro ao salvar os dados: ${
          err.response?.data?.details || err.message
        }`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        Carregando informações da ONG...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Alert className="max-w-md" variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!ongData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Alert className="max-w-md">
          <Info className="h-4 w-4" />
          <AlertTitle>ONG não encontrada</AlertTitle>
          <AlertDescription>
            Não foi possível encontrar os dados da sua ONG.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Configurações da ONG
          </CardTitle>
          <CardDescription>
            Atualize o nome da sua ONG e suas informações de contato e endereço.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="col-span-full">
              <Label htmlFor="nome">Nome da ONG</Label>
              <Input
                id="nome"
                name="nome"
                value={ongData.nome || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-full md:col-span-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={ongData.email || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-full md:col-span-1">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                value={ongData.telefone || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-full">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={ongData.descricao || ""}
                onChange={handleChange}
                className="min-h-[80px]"
              />
            </div>

            <div className="col-span-full md:col-span-1">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                name="cnpj"
                value={ongData.cnpj || ""}
                onChange={handleChange}
              />
            </div>

            {/* Campos de Endereço */}
            <div className="col-span-full mt-4">
              <h3 className="text-lg font-semibold mb-2">Endereço</h3>
            </div>
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="endereco.cep">CEP</Label>
              <Input
                id="endereco.cep"
                name="endereco.cep"
                value={ongData.endereco?.cep || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="endereco.numero">Número</Label>
              <Input
                id="endereco.numero"
                name="endereco.numero"
                value={ongData.endereco?.numero || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="endereco.complemento">Complemento</Label>
              <Input
                id="endereco.complemento"
                name="endereco.complemento"
                value={ongData.endereco?.complemento || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="endereco.bairro">Bairro</Label>
              <Input
                id="endereco.bairro"
                name="endereco.bairro"
                value={ongData.endereco?.bairro || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="endereco.cidade">Cidade</Label>
              <Input
                id="endereco.cidade"
                name="endereco.cidade"
                value={ongData.endereco?.cidade || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-full md:col-span-1">
              <Label htmlFor="endereco.estado">Estado</Label>
              <Input
                id="endereco.estado"
                name="endereco.estado"
                value={ongData.endereco?.estado || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-full flex justify-end mt-6">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
