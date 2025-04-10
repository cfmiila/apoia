import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export default function CadastroDoador() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col justify-center p-12 bg-white">
        <h1 className="text-4xl font-bold">Seja doador</h1>
        <p className="mt-2 text-gray-600">Faça a diferença!</p>
        <form className="flex flex-col space-y-2 mt-2">
          <Label htmlFor="nome" className="text-lg font-light">
            Nome completo
          </Label>
          <Input
            type="text"
            placeholder="Nome completo"
            className="rounded-2xl"
          />
          <Label htmlFor="email" className="text-lg font-light">
            Email
          </Label>
          <Input type="email" placeholder="Email" className="rounded-2xl" />
          <Label htmlFor="senha" className="text-lg font-light">
            Senha
          </Label>
          <Input type="password" placeholder="Senha" className="rounded-2xl" />
          <Label htmlFor="telefone" className="text-lg font-light">
            Telefone
          </Label>
          <Input type="text" placeholder="Telefone" className="rounded-2xl" />
          <Button className="bg-blue-600 text-white p-3 rounded-2xl">
            Cadastrar
          </Button>
        </form>
        <p className="mt-4 text-center">
          Possui uma conta?{" "}
          <Link href="/login" className="text-blue-600">
            Entrar
          </Link>
        </p>
      </div>
      <div className="w-1/2 bg-gray-200 flex items-center justify-center object-cover">
        <Image
          src="/doador-image.png"
          alt="Doador"
          width={500}
          height={500}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
