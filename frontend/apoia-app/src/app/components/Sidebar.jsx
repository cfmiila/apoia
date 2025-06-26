"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartPie,
  FaClipboardList,
  FaCog,
  FaUsers,
  FaBullhorn,
  FaFileAlt,
} from "react-icons/fa";

export function Sidebar() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao parsear user:", error);
      }
    }
  }, []);

  const tipo = user?.tipo?.toLowerCase();

  const isActive = (path) => pathname === path;

  const renderMenuItems = () => {
    switch (tipo) {
      case "ong":
        return (
          <>
            <MenuItem
              icon={<FaChartPie />}
              text="Painel"
              href="/painel"
              active={isActive("/painel")}
            />
            <MenuItem
              icon={<FaClipboardList />}
              text="Quadro"
              href="/quadro"
              active={isActive("/quadro")}
            />
            <MenuItem
              icon={<FaChartPie />}
              text="Análises"
              href="/analises"
              active={isActive("/analises")}
            />
            <MenuItem
              icon={<FaCog />}
              text="Configurações"
              href="/configuracoes"
              active={isActive("/configuracoes")}
            />
          </>
        );
      case "parceiro":
        return (
          <>
            <MenuItem
              icon={<FaChartPie />}
              text="Painel"
              href="/dashboard-doador"
              active={isActive("/dashboard-doador")}
            />
            <MenuItem
              icon={<FaBullhorn />}
              text="Campanhas"
              href="/dashboard-doador/campanhas"
              active={isActive("/dashboard-doador/campanhas")}
            />
            <MenuItem
              icon={<FaCog />}
              text="Configurações"
              href="/dashboard-doador/configuracoes"
              active={isActive("/dashboard-doador/configuracoes")}
            />
          </>
        );
      case "admin":
        return (
          <>
            <MenuItem
              icon={<FaChartPie />}
              text="Painel"
              href="/admin"
              active={isActive("/admin")}
            />
            <MenuItem
              icon={<FaUsers />}
              text="Gerenciar ONGs"
              href="/admin/ongs"
              active={isActive("/admin/ongs")}
            />
            <MenuItem
              icon={<FaFileAlt />}
              text="Relatórios"
              href="/admin/relatorios"
              active={isActive("/admin/relatorios")}
            />
            <MenuItem
              icon={<FaCog />}
              text="Configurações"
              href="/admin/configuracoes"
              active={isActive("/admin/configuracoes")}
            />
          </>
        );
      case "doador":
        return (
          <>
            <MenuItem
              icon={<FaChartPie />}
              text="Painel"
              href="/doador"
              active={isActive("/doador")}
            />
            <MenuItem
              icon={<FaBullhorn />}
              text="Campanhas"
              href="/doador/campanhas"
              active={isActive("/doador/campanhas")}
            />
            <MenuItem
              icon={<FaCog />}
              text="Configurações"
              href="/doador/configuracoes"
              active={isActive("/doador/configuracoes")}
            />
          </>
        );
      default:
        return <p className="text-sm text-gray-500">Carregando menu...</p>;
    }
  };

  return (
    <aside className="w-60 bg-white shadow-md p-6 flex flex-col justify-between min-h-screen">
      <div>
        <h1 className="text-xl font-bold mb-8">APOIA +</h1>
        <nav className="space-y-4">{renderMenuItems()}</nav>
      </div>
    </aside>
  );
}

function MenuItem({ icon, text, href, active }) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer 
          ${
            active
              ? "text-blue-600 font-semibold bg-blue-100"
              : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          }
        `}
      >
        {icon}
        <span>{text}</span>
      </div>
    </Link>
  );
}
