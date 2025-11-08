"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import clsx from "clsx";
import { useState } from "react";
import SidebarItem from "./SidebarItem";

// Ícones do Material UI
import {
  Close as CloseIcon,
  DarkMode,
  DashboardOutlined,
  FolderOutlined,
  HistoryOutlined,
  LightMode,
  LogoutOutlined,
  MapOutlined,
  Menu as MenuIcon,
  WorkspacePremiumOutlined
} from "@mui/icons-material";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { label: "Dashboard", icon: DashboardOutlined, href: "/" },
    { label: "Templates", icon: MapOutlined, href: "/templates" },
    { label: "Documentos", icon: FolderOutlined, href: "/documentos" },
    { label: "Histórico", icon: HistoryOutlined, href: "/historico" },
    { label: "Plano", icon: WorkspacePremiumOutlined, href: "/plano" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={clsx(
        "bg-background border-border flex h-screen flex-col border-r transition-all duration-300 sticky top-0",
        isOpen ? "w-60" : "w-12",
      )}
    >
      {/* Cabeçalho */}
      <div className={clsx(
        "flex items-center px-4 py-4",
        isOpen ? "justify-between" : "flex-col gap-2 justify-center"
      )}>
        {isOpen && <span className="text-foreground text-lg font-bold">Plataform</span>}

        <div className={clsx("flex items-center", isOpen ? "gap-2" : "flex-col gap-2")}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="text-foreground transition hover:opacity-75 p-1"
            title={theme === "light" ? "Modo escuro" : "Modo claro"}
          >
            {theme === "light" ? (
              <DarkMode fontSize="small" />
            ) : (
              <LightMode fontSize="small" />
            )}
          </button>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-foreground transition hover:opacity-75 p-1"
          >
            {isOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </button>
        </div>
      </div>

      {/* Itens de navegação */}
      <nav className="mt-4 flex-1 space-y-1 mx-1">
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
      <div className="border-border mt-auto border-t">
        {isOpen && user && (
          <div className="px-4 py-3 border-b border-border">
            <p className="text-foreground text-sm font-medium truncate">{user.name}</p>
            <p className="text-foreground/60 text-xs truncate">{user.email}</p>
          </div>
        )}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className={clsx(
              "flex w-full items-center text-foreground transition hover:bg-foreground/5 rounded-md",
              isOpen ? "gap-3 px-3 py-2" : "justify-center py-2"
            )}
          >
            <LogoutOutlined fontSize="small" />
            {isOpen && <span className="text-sm">Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
