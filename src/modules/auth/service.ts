import type { JWTPayload, LoginCredentials, LoginResponse, User } from "@/modules/auth/types";

// Mock user database
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
  },
];

// Helper function to encode base64url
function base64urlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Helper function to decode base64url
function base64urlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return atob(str);
}

// Generate a mock JWT token
function generateMockJWT(user: User): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signature = base64urlEncode("mock-signature");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Decode JWT token
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(base64urlDecode(parts[1]));
    return payload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

// Verify if token is expired
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

// Mock login function
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = MOCK_USERS.find(
    (u) =>
      u.email === credentials.email && u.password === credentials.password,
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const userData: User = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const token = generateMockJWT(userData);

  return {
    token,
    user: userData,
  };
}

// Validate token and return user data
export async function validateToken(token: string): Promise<User | null> {
  if (isTokenExpired(token)) {
    return null;
  }

  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
  };
}
