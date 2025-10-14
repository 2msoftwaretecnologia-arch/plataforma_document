"use client";

import type {
  AuthContextType,
  LoginCredentials,
  User,
} from "@/types/auth";
import { loginUser, validateToken as validateTokenAPI } from "@/lib/apiClient";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // Valida token via API route (server-side)
      const userData = await validateTokenAPI(storedToken);

      if (userData) {
        setUser(userData);
        setToken(storedToken);
      } else {
        // Token is invalid or expired
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      // Faz login via API route (server-side)
      const response = await loginUser(credentials);

      setUser(response.user);
      setToken(response.token);
      localStorage.setItem(TOKEN_KEY, response.token);

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    router.push("/login");
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
