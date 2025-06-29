"use client";
import { useEffect, useState } from "react";
import { FaBell, FaQuestionCircle } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const [user, setUser] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Erro ao parsear user:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getTitulo = () => {
    const tipo = user?.tipo?.toLowerCase();
    switch (tipo) {
      case "ong":
        return `Painel da ONG`;
      case "parceiro":
        return `Painel do parceiro`;
      case "doador":
        return `Bem-vindo, ${user?.nome?.split(" ")[0] || "Doador"}!`;
      case "admin":
        return `Painel administrativo`;
      default:
        return "Painel do usuário";
    }
  };

  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">{getTitulo()}</h2>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border-1">
                {/* Se tiver imagem de perfil: */}
                {/* <AvatarImage src={user?.imagemUrl} alt={user?.nome} /> */}
                <AvatarFallback>{getInitials(user?.nome)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>
                {user?.nome ?? "Usuário Desconhecido"}
              </DropdownMenuLabel>
              <DropdownMenuItem disabled>
                Tipo: {user?.tipo ?? "N/A"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowLogoutDialog(true)}
                className="transition-all duration-200 ease-in-out hover:bg-gray-100 cursor-pointer border-gray-300 hover:border-white px-4 py-2 rounded-md text-gray-700"
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Dialog de confirmação de logout */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Deseja realmente sair?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="transition-all duration-200 ease-in-out hover:bg-gray-100 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-gray-700 bg-white"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="transition-all duration-200 ease-in-out hover:bg-blue-700 cursor-pointer border-1 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md text-white bg-blue-600"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}