import type { LoginCredentials, LoginResponse, User } from "@/types/api/auth";

/**
 * API Client para fazer requisições ao backend (Next.js API Routes)
 * Todas as funções aqui fazem chamadas HTTP para /api/auth/*
 */

const API_BASE = "/api/auth";

/**
 * Faz login enviando credenciais para o server
 */
export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to login");
  }

  return response.json();
}

/**
 * Valida token enviando para o server
 */
export async function validateToken(token: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error validating token:", error);
    return null;
  }
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { message } = await response.json().catch(() => ({
      message: "Erro ao registrar usuário",
    }));
    throw new Error(message);
  }

  return response.json(); 
}
