"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getMuiTheme } from "@/theme/muiTheme";

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isViewerPage = pathname?.startsWith("/viewer-documentos/");
  const { theme } = useTheme();
  const muiTheme = getMuiTheme(theme);

  // If on login page, render without sidebar and protection
  if (isLoginPage) {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    );
  }

  // Protected pages with sidebar
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ProtectedRoute>
        <div className="flex">
          <Sidebar />
          <main className={isViewerPage ? "flex-1" : "flex-1 p-8"}>{children}</main>
        </div>
      </ProtectedRoute>
    </MuiThemeProvider>
  );
}
