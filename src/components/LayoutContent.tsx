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
  // Treat any /login/* routes as public (login, register, etc.)
  const isAuthRoute = pathname?.startsWith("/login");
  const { theme } = useTheme();
  const muiTheme = getMuiTheme(theme);

  if (isAuthRoute) {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ProtectedRoute>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </ProtectedRoute>
    </MuiThemeProvider>
  );
}
