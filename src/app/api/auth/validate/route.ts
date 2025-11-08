import { NextRequest, NextResponse } from "next/server";
import type { JWTPayload, User } from "@/types/api/auth";

// Helper function to decode base64url
function base64urlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return Buffer.from(str, "base64").toString("utf-8");
}

// Decode JWT token
function decodeJWT(token: string): JWTPayload | null {
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
function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

// Validate token and return user data
function validateToken(token: string): User | null {
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

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // Validate input
    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 },
      );
    }

    // Validate token
    const user = validateToken(token);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
