/**
 * Usuario Model
 */

export interface Usuario {
  id: string; // UUID
  email: string;
  password_hash: string;
  nome: string;
  ativo: boolean;
  criado_em: string; // ISO 8601 timestamp
  ultimo_login_em: string | null; // ISO 8601 timestamp
}

// Versão sem a senha para uso no frontend
export interface UsuarioPublico {
  id: string;
  email: string;
  nome: string;
  ativo: boolean;
  criado_em: string;
  ultimo_login_em: string | null;
}

// DTO para criar usuário
export interface CreateUsuarioDTO {
  email: string;
  password: string;
  nome: string;
}

// DTO para atualizar usuário
export interface UpdateUsuarioDTO {
  email?: string;
  nome?: string;
  ativo?: boolean;
}

// DTO para login
export interface LoginDTO {
  email: string;
  password: string;
}
