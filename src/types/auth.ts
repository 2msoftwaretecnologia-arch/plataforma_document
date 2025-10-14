export interface User {
  id: string;
  email: string;
  name: string;
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  name: string;
  iat: number; // issued at
  exp: number; // expiration
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}
