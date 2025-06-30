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
  FaCalendarAlt,
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
              href="/dashboard-ong"
              active={isActive("/dashboard-ong")}
            />
            <MenuItem
              icon={<FaClipboardList />}
              text="Gerenciamento de Campanhas"
              href="/dashboard-ong/campanhas"
              active={isActive("/dashboard-ong/campanhas")}
            />
            <MenuItem
              icon={<FaCalendarAlt />}
              text="Gerenciamento de Eventos"
              href="/dashboard-ong/eventos"
              active={isActive("/dashboard-ong/eventos")}
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
              icon={<FaCalendarAlt />}
              text="Eventos"
              href="/dashboard-doador/eventos"
              active={isActive("/dashboard-doador/eventos")}
            />
          </>
        );
      case "admin":
        return (
          <>
            <MenuItem
              icon={<FaChartPie />}
              text="Painel"
              href="/dashboard-adm"
              active={isActive("/dashboard-adm")}
            />
            <MenuItem
              icon={<FaClipboardList />}
              text="Solicitações"
              href="/dashboard-adm/solicitacoes"
              active={isActive("/dashboard-adm/solicitacoes")}
            />
            <MenuItem
              icon={<FaChartPie />}
              text="Estatísticas"
              href="/dashboard-adm/estatisticas"
              active={isActive("/dashboard-adm/estatisticas")}
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
          ${active
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
