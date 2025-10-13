"use client";

import clsx from "clsx";
import { useState } from "react";
import SidebarItem from "./SidebarItem";

// Ícones do Material UI
import {
  Close as CloseIcon,
  DashboardOutlined,
  DescriptionOutlined,
  HistoryOutlined,
  LogoutOutlined,
  MapOutlined,
  Menu as MenuIcon,
  WorkspacePremiumOutlined,
} from "@mui/icons-material";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { label: "Dashboard", icon: DashboardOutlined, href: "/" },
    { label: "Mapeamento", icon: MapOutlined, href: "/mapeamento" },
    { label: "Criar Formulário", icon: DescriptionOutlined, href: "/criar-formulario" },
    { label: "Histórico", icon: HistoryOutlined, href: "/historico" },
    { label: "Plano", icon: WorkspacePremiumOutlined, href: "/plano" },
  ];

  return (
    <aside
      className={clsx(
        "bg-background border-border flex h-screen flex-col border-r transition-all duration-300",
        isOpen ? "w-60" : "w-12",
      )}
    >
      {/* Cabeçalho */}
      <div className={clsx(
        "flex items-center px-4 py-4",
        isOpen ? "justify-between" : "justify-center"
      )}>
        {isOpen && <span className="text-foreground text-lg font-bold">Plataform</span>}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-foreground transition hover:opacity-75"
        >
          {isOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
        </button>
      </div>

      {/* Itens de navegação */}
      <nav className="mt-4 flex-1 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isOpen={isOpen}
          />
        ))}
      </nav>

      {/* Rodapé */}
      <div className="border-border mt-auto border-t p-4">
        <SidebarItem icon={LogoutOutlined} label="Sair" href="/" isOpen={isOpen} />
      </div>
    </aside>
  );
}
