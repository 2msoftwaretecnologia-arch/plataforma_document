import { NextRequest, NextResponse } from "next/server";
import type { LoginCredentials, User, JWTPayload } from "@/types/auth";

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
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
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

export async function POST(request: NextRequest) {
  try {
    const credentials: LoginCredentials = await request.json();

    // Validate input
    if (!credentials.email || !credentials.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Find user
    const user = MOCK_USERS.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password,
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate token
    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = generateMockJWT(userData);

    return NextResponse.json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
