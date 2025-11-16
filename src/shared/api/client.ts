import type { LoginCredentials, LoginResponse, User } from "@/modules/auth/types";
import { env } from "@/shared/config";

/**
 * API Client para fazer requisições ao backend
 */

const AUTH_BASE = "/api/auth";

/**
 * Enhanced API Client with generic methods
 * Supports both relative URLs (/api/*) and absolute URLs (for Django backend)
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || env.API_BASE_URL;
  }

  private getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private buildUrl(endpoint: string): string {
    // If endpoint is already absolute, use it directly
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      return endpoint;
    }
    // Otherwise, append to baseUrl
    return `${this.baseUrl}${endpoint}`;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint), {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Request failed",
      }));
      throw new Error(error.message || `GET ${endpoint} failed`);
    }

    const data = await response.json();
    // Handle Django REST Framework response format (data.data || data)
    return (data.data !== undefined ? data.data : data) as T;
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint), {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Request failed",
      }));
      throw new Error(error.message || `POST ${endpoint} failed`);
    }

    const data = await response.json();
    return (data.data !== undefined ? data.data : data) as T;
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint), {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Request failed",
      }));
      throw new Error(error.message || `PATCH ${endpoint} failed`);
    }

    const data = await response.json();
    return (data.data !== undefined ? data.data : data) as T;
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint), {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Request failed",
      }));
      throw new Error(error.message || `PUT ${endpoint} failed`);
    }

    const data = await response.json();
    return (data.data !== undefined ? data.data : data) as T;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint), {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Request failed",
      }));
      throw new Error(error.message || `DELETE ${endpoint} failed`);
    }

    // DELETE might return 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json();
    return (data.data !== undefined ? data.data : data) as T;
  }
}

export const apiClient = new ApiClient();

/**
 * Legacy auth functions (keeping for backward compatibility)
 */
export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_BASE}/login`, {
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

export async function validateToken(token: string): Promise<User | null> {
  try {
    const response = await fetch(`${AUTH_BASE}/validate`, {
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
